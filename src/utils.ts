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

  // Generate SHA256 hash using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
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
      mchId: this.apiKey,
      nonceStr: String(Date.now()),
      timestamp: getTimestamp(),
    };
    signedBody.sign = await generateSignature(signedBody, this.apiSecret);
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

    if (options?.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      const body = sign ? await this.signRequest(options.body) : options.body;
      fetchOptions.body = JSON.stringify(body);
    } else if (method === 'POST' && sign) {
      // For POST without body, still add signature params
      fetchOptions.body = JSON.stringify(await this.signRequest({}));
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json() as Record<string, unknown>;

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

    // Return data field if present (legacy format) or full response
    return (data.data !== undefined ? data.data : data) as T;
  }

  /**
   * GET request
   */
  async get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
    return this.request<T>('GET', path, { query, sign: false });
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
   * GET request with signature (for authenticated GET endpoints)
   */
  async getWithSignature<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const signedParams = await this.signRequest(params ?? {});
    return this.request<T>('GET', path, { query: signedParams, sign: false });
  }
}
