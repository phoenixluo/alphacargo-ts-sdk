import type { TMSClientConfig, TMSError } from './types';

/**
 * Canonicalize a JSON object into a deterministic string representation.
 * Recursively sorts keys at all levels and removes whitespace.
 * Must match the server-side canonicalizeJson implementation.
 */
export function canonicalizeJson(obj: unknown): string {
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') {
    if (Number.isNaN(obj)) return 'null';
    if (!Number.isFinite(obj)) return 'null';
    return obj.toString();
  }
  if (typeof obj === 'string') return JSON.stringify(obj);

  if (Array.isArray(obj)) {
    const items = obj.map((item) => canonicalizeJson(item));
    return `[${items.join(',')}]`;
  }

  if (typeof obj === 'object' && obj !== null) {
    const record = obj as Record<string, unknown>;
    const sortedKeys = Object.keys(record).sort();
    const pairs = sortedKeys
      .filter((key) => record[key] !== undefined)
      .map((key) => `${JSON.stringify(key)}:${canonicalizeJson(record[key])}`);
    return `{${pairs.join(',')}}`;
  }

  return JSON.stringify(obj);
}

/**
 * Generate SHA-256 signature for API requests using Web Crypto API.
 * Uses canonical JSON serialization of the payload (excluding the `sign` field)
 * to match the server-side signature verification.
 */
export async function generateSignature(
  params: Record<string, unknown>,
  _apiSecret?: string
): Promise<string> {
  // Remove the sign field from the payload
  const { sign, ...paramsWithoutSign } = params;

  // Canonicalize the payload to produce a deterministic string
  const stringToSign = canonicalizeJson(paramsWithoutSign);

  console.log('[TMS SDK] generateSignature - keys:', Object.keys(paramsWithoutSign).sort().join(', '));
  console.log('[TMS SDK] generateSignature - stringToSign:', stringToSign);
  console.log('[TMS SDK] generateSignature - apiSecret provided:', !!_apiSecret);

  // Generate SHA256 hash using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  console.log('[TMS SDK] generateSignature - result:', signature);
  return signature;
}

/**
 * Generate a random nonce string
 */
export function generateNonce(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Get current Unix timestamp in seconds
 */
export function getTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return `${encodeURIComponent(key)}=${value ? 'true' : 'false'}`;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    });

  return entries.length > 0 ? `?${entries.join('&')}` : '';
}

/**
 * TMS API Error class
 */
export class TMSApiError extends Error {
  public readonly code: number;
  public readonly details?: unknown;
  public readonly statusCode?: number;

  constructor(error: TMSError, statusCode?: number) {
    super(error.message);
    this.name = 'TMSApiError';
    this.code = error.code;
    this.details = error.details;
    this.statusCode = statusCode;
  }
}

/**
 * HTTP client for making API requests
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly timeout: number;
  private readonly headers: Record<string, string>;

  constructor(config: TMSClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.timeout = config.timeout ?? 30000;
    this.headers = config.headers ?? {};
  }

  /**
   * Sign request body with HMAC signature
   */
  private async signRequest(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    const signedBody: Record<string, unknown> = {
      ...body,
      api_key: this.apiKey,
      nonceStr: String(Date.now()),
    };
    console.log('[TMS SDK] signRequest - apiKey:', this.apiKey);
    console.log('[TMS SDK] signRequest - body keys:', Object.keys(signedBody).sort().join(', '));
    signedBody.sign = await generateSignature(signedBody, this.apiSecret);
    console.log('[TMS SDK] signRequest - final signed body:', JSON.stringify(signedBody, null, 2));
    return signedBody;
  }

  /**
   * Make HTTP request
   */
  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options?: {
      body?: Record<string, unknown>;
      query?: Record<string, unknown>;
      sign?: boolean;
    }
  ): Promise<T> {
    const url = `${this.baseUrl}${path}${options?.query ? buildQueryString(options.query) : ''}`;
    const sign = options?.sign ?? true;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.headers,
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    const bodyMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (options?.body && bodyMethods.includes(method)) {
      const body = sign ? await this.signRequest(options.body) : options.body;
      fetchOptions.body = JSON.stringify(body);
    } else if (bodyMethods.includes(method) && sign) {
      // For body methods without body, still add signature params
      fetchOptions.body = JSON.stringify(await this.signRequest({}));
    }

    console.log(`[TMS SDK] ${method} ${url}`);
    if (fetchOptions.body) {
      console.log('[TMS SDK] Request body:', fetchOptions.body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json() as Record<string, unknown>;

    console.log(`[TMS SDK] Response status: ${response.status}`);
    console.log('[TMS SDK] Response body:', JSON.stringify(data, null, 2));

    // Handle error responses
    if (!response.ok) {
      throw new TMSApiError(
        {
          code: (data.code as number) ?? response.status,
          message: (data.error as string) ?? (data.message as string) ?? 'An error occurred',
          details: data,
        },
        response.status
      );
    }

    // Handle legacy error format
    if (data.code !== undefined && data.code !== 0 && data.success === false) {
      throw new TMSApiError(
        {
          code: data.code as number,
          message: (data.message as string) ?? 'An error occurred',
          details: data.extra,
        },
        response.status
      );
    }

    // Unwrap legacy envelope ({ code, success, data }) but pass through
    // direct RESTful responses (e.g. PaginatedResult which has its own .data field)
    const isLegacyEnvelope = data.success !== undefined && data.code !== undefined;
    return (isLegacyEnvelope && data.data !== undefined ? data.data : data) as T;
  }

  /**
   * GET request
   */
  async get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
    return this.getWithSignature<T>(path, query);
  }

  /**
   * POST request
   */
  async post<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    return this.request<T>('POST', path, { body });
  }

  /**
   * PUT request
   */
  async put<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    return this.request<T>('PUT', path, { body });
  }

  /**
   * PATCH request
   */
  async patch<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    return this.request<T>('PATCH', path, { body });
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    return this.request<T>('DELETE', path, { body });
  }

  /**
   * GET request with signature (for authenticated GET endpoints).
   *
   * All parameter values are coerced to strings before signing because
   * query-string parameters are always strings after URL parsing on the
   * server. Without this the canonical JSON would differ (e.g. `"page":1`
   * vs `"page":"1"`) and the signature would not match.
   */
  async getWithSignature<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    // Convert all values to strings to match server-side query param parsing
    const stringifiedParams: Record<string, unknown> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          stringifiedParams[key] = String(value);
        }
      }
    }
    const signedParams = await this.signRequest(stringifiedParams);
    return this.request<T>('GET', path, { query: signedParams, sign: false });
  }
}
