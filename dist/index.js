"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BillingProfiles: () => BillingProfiles,
  Billings: () => Billings,
  DeliveryEvents: () => DeliveryEvents,
  Invoices: () => Invoices,
  Payments: () => Payments,
  RateCards: () => RateCards,
  Reports: () => Reports,
  SenderAccounts: () => SenderAccounts,
  TMSApiError: () => TMSApiError,
  TMSClient: () => TMSClient,
  Waybills: () => Waybills,
  generateNonce: () => generateNonce,
  generateSignature: () => generateSignature,
  getTimestamp: () => getTimestamp
});
module.exports = __toCommonJS(index_exports);

// src/utils.ts
async function generateSignature(params, apiSecret) {
  const filteredParams = Object.entries(params).filter(([key, value]) => key !== "sign" && value !== void 0 && value !== null).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
  const sortedKeys = Object.keys(filteredParams).sort();
  const queryString = sortedKeys.map((key) => `${key}=${filteredParams[key]}`).join("&");
  const signString = `${queryString}&key=${apiSecret}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(signString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function generateNonce(length = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
function getTimestamp() {
  return Math.floor(Date.now() / 1e3);
}
function buildQueryString(params) {
  const entries = Object.entries(params).filter(([, value]) => value !== void 0 && value !== null).map(([key, value]) => {
    if (typeof value === "boolean") {
      return `${encodeURIComponent(key)}=${value ? "true" : "false"}`;
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
  });
  return entries.length > 0 ? `?${entries.join("&")}` : "";
}
var TMSApiError = class extends Error {
  constructor(error, statusCode) {
    super(error.message);
    this.name = "TMSApiError";
    this.code = error.code;
    this.details = error.details;
    this.statusCode = statusCode;
  }
};
var HttpClient = class {
  constructor(config) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.timeout = config.timeout ?? 3e4;
    this.headers = config.headers ?? {};
  }
  /**
   * Sign request body with HMAC signature
   */
  async signRequest(body) {
    const signedBody = {
      ...body,
      mchId: this.apiKey,
      nonceStr: generateNonce(),
      timestamp: getTimestamp()
    };
    signedBody.sign = await generateSignature(signedBody, this.apiSecret);
    return signedBody;
  }
  /**
   * Make HTTP request
   */
  async request(method, path, options) {
    const url = `${this.baseUrl}${path}${options?.query ? buildQueryString(options.query) : ""}`;
    const sign = options?.sign ?? true;
    const headers = {
      "Content-Type": "application/json",
      ...this.headers
    };
    const fetchOptions = {
      method,
      headers,
      signal: AbortSignal.timeout(this.timeout)
    };
    if (options?.body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      const body = sign ? await this.signRequest(options.body) : options.body;
      fetchOptions.body = JSON.stringify(body);
    } else if (method === "POST" && sign) {
      fetchOptions.body = JSON.stringify(await this.signRequest({}));
    }
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    if (!response.ok) {
      throw new TMSApiError(
        {
          code: data.code ?? response.status,
          message: data.error ?? data.message ?? "An error occurred",
          details: data
        },
        response.status
      );
    }
    if (data.code !== void 0 && data.code !== 0 && data.success === false) {
      throw new TMSApiError(
        {
          code: data.code,
          message: data.message ?? "An error occurred",
          details: data.extra
        },
        response.status
      );
    }
    return data.data !== void 0 ? data.data : data;
  }
  /**
   * GET request
   */
  async get(path, query) {
    return this.request("GET", path, { query, sign: false });
  }
  /**
   * POST request
   */
  async post(path, body) {
    return this.request("POST", path, { body });
  }
  /**
   * PUT request
   */
  async put(path, body) {
    return this.request("PUT", path, { body });
  }
  /**
   * PATCH request
   */
  async patch(path, body) {
    return this.request("PATCH", path, { body });
  }
  /**
   * DELETE request
   */
  async delete(path, body) {
    return this.request("DELETE", path, { body });
  }
  /**
   * GET request with signature (for authenticated GET endpoints)
   */
  async getWithSignature(path, params) {
    const signedParams = await this.signRequest(params ?? {});
    return this.request("GET", path, { query: signedParams, sign: false });
  }
};

// src/resources/waybills.ts
var Waybills = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * Create a new waybill (shipping order)
   *
   * @param data - Waybill creation data
   * @returns Created waybill with tracking information
   *
   * @example
   * ```typescript
   * const waybill = await client.waybills.create({
   *   outTradeNo: 'ORDER-2024-001',
   *   owner: 'warehouse-a',
   *   senderName: 'Acme Warehouse',
   *   senderPhone: '0212345678',
   *   senderCityName: 'Bangkok',
   *   senderDistrictName: 'Watthana',
   *   senderPostCode: '10110',
   *   senderAddress: '123 Sukhumvit Road',
   *   receiverName: 'John Doe',
   *   receiverPhone: '0812345678',
   *   receiverProvinceName: 'Bangkok',
   *   receiverCityName: 'Bangkok',
   *   receiverDistrictName: 'Chatuchak',
   *   receiverPostCode: '10900',
   *   receiverAddress: '456 Phaholyothin Road',
   *   parcelList: [{
   *     outParcelNo: 'PKG-001',
   *     itemDesc: 'Electronics',
   *     itemValue: 1500,
   *     productList: [{ name: 'Wireless Mouse', sku: 'SKU-001', quantity: 2 }]
   *   }]
   * });
   * console.log(waybill.waybill_no); // 'TH24020001'
   * ```
   */
  async create(data) {
    return this.http.post("/waybills", data);
  }
  /**
   * Cancel a waybill
   *
   * @param waybillNo - Waybill number or external waybill number
   *
   * @example
   * ```typescript
   * await client.waybills.cancel('TH24020001');
   * ```
   */
  async cancel(waybillNo) {
    return this.http.delete(`/waybills/${encodeURIComponent(waybillNo)}`);
  }
  /**
   * Get tracking events for a waybill
   *
   * @param waybillNo - Waybill number
   * @returns Tracking events and status
   *
   * @example
   * ```typescript
   * const events = await client.waybills.getEvents('TH24020001');
   * console.log(events.state); // 'delivered'
   * console.log(events.routes); // Array of tracking events
   * ```
   */
  async getEvents(waybillNo) {
    return this.http.getWithSignature(`/waybills/${encodeURIComponent(waybillNo)}/events`);
  }
  /**
   * Get shipping label for a waybill (PDF)
   *
   * @param waybillNo - Waybill number
   * @param params - Optional label params (e.g. packageId for a specific package)
   * @returns Label as ArrayBuffer (PDF)
   *
   * @example
   * ```typescript
   * const label = await client.waybills.getLabel('TH24020001');
   * fs.writeFileSync('label.pdf', Buffer.from(label));
   *
   * // Get label for a specific package
   * const pkgLabel = await client.waybills.getLabel('TH24020001', { packageId: 'pkg-uuid' });
   * ```
   */
  async getLabel(waybillNo, params) {
    const url = `/waybills/${encodeURIComponent(waybillNo)}/label`;
    const queryParts = [];
    if (params?.packageId) {
      queryParts.push(`packageId=${encodeURIComponent(params.packageId)}`);
    }
    const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    const response = await fetch(
      `${this.http.baseUrl}${url}${queryString}`
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? "Failed to get label");
    }
    return response.arrayBuffer();
  }
  /**
   * Generate a merged PDF with labels for multiple waybills
   *
   * @param waybillNos - Array of waybill numbers (max 100)
   * @returns Merged PDF as ArrayBuffer
   *
   * @example
   * ```typescript
   * const pdf = await client.waybills.getBatchLabel(['TH24020001', 'TH24020002']);
   * fs.writeFileSync('labels.pdf', Buffer.from(pdf));
   * ```
   */
  async getBatchLabel(waybillNos) {
    const response = await fetch(
      `${this.http.baseUrl}/waybills/batch-label`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.http.headers
        },
        body: JSON.stringify({ waybill_nos: waybillNos })
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? "Failed to get batch labels");
    }
    return response.arrayBuffer();
  }
  /**
   * Add a package to an existing waybill
   *
   * @param waybillNo - Waybill number
   * @param data - Package data
   * @returns Created package information
   *
   * @example
   * ```typescript
   * const pkg = await client.waybills.addPackage('TH24020001', {
   *   external_package_no: 'PKG-002',
   *   weight: 2.5,
   *   products: [{ name: 'Keyboard', sku: 'SKU-002', quantity: 1 }]
   * });
   * console.log(pkg.package_no); // 'TH24020001-002'
   * ```
   */
  async addPackage(waybillNo, data) {
    return this.http.post(
      `/waybills/${encodeURIComponent(waybillNo)}/packages`,
      data
    );
  }
  /**
   * List additional services for a waybill
   *
   * @param waybillNo - Waybill number
   * @returns Array of additional services
   *
   * @example
   * ```typescript
   * const services = await client.waybills.listAdditionalServices('TH24020001');
   * console.log(services); // [{ id: '...', status: 'pending', ... }]
   * ```
   */
  async listAdditionalServices(waybillNo) {
    const result = await this.http.get(
      `/waybills/${encodeURIComponent(waybillNo)}/additional-services`
    );
    return result.data;
  }
  /**
   * Add additional services to a waybill
   *
   * @param waybillNo - Waybill number
   * @param serviceIds - Array of service UUIDs to add
   * @returns Created additional services
   *
   * @example
   * ```typescript
   * await client.waybills.addAdditionalServices('TH24020001', ['service-uuid-1', 'service-uuid-2']);
   * ```
   */
  async addAdditionalServices(waybillNo, serviceIds) {
    const result = await this.http.post(
      `/waybills/${encodeURIComponent(waybillNo)}/additional-services`,
      { service_ids: serviceIds }
    );
    return result.data;
  }
  /**
   * Update an additional service status
   *
   * @param waybillNo - Waybill number
   * @param serviceId - Additional service record ID
   * @param data - Status and optional result data
   *
   * @example
   * ```typescript
   * await client.waybills.updateAdditionalService('TH24020001', 'service-record-id', {
   *   status: 'completed',
   *   result: { photo_urls: ['https://...'] }
   * });
   * ```
   */
  async updateAdditionalService(waybillNo, serviceId, data) {
    const result = await this.http.patch(
      `/waybills/${encodeURIComponent(waybillNo)}/additional-services/${encodeURIComponent(serviceId)}`,
      data
    );
    return result.data;
  }
  /**
   * Create a consolidated waybill from multiple source waybills
   *
   * @param data - Consolidation request data
   * @returns Master waybill and sub-waybills
   *
   * @example
   * ```typescript
   * const result = await client.waybills.consolidate({
   *   waybill_ids: ['uuid-1', 'uuid-2'],
   *   external_waybill_no: 'CONSOL-001',
   *   sender: { id: 'sender-uuid' },
   *   recipient: {
   *     name: 'John Doe',
   *     phone: '0812345678',
   *     address: {
   *       street_line: '456 Road',
   *       city: 'Bangkok',
   *       state: 'Bangkok',
   *       zip_code: '10900'
   *     }
   *   },
   *   service_id: 'service-uuid'
   * });
   * console.log(result.masterWaybill.waybill_no);
   * ```
   */
  async consolidate(data) {
    return this.http.post(
      "/waybills/consolidated-waybills",
      data
    );
  }
  /**
   * Get tracking routes in legacy format (for Hisense integration)
   *
   * @param waybillNo - Waybill number
   * @returns Tracking routes with numeric state codes
   */
  async getRoutes(waybillNo) {
    return this.http.getWithSignature(`/waybills/${encodeURIComponent(waybillNo)}/routes`);
  }
};

// src/resources/billings.ts
var Billings = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * List billing records with optional filters
   *
   * @param params - Query parameters for filtering
   * @returns Paginated list of billing records
   *
   * @example
   * ```typescript
   * const billings = await client.billings.list({
   *   status: 'pending',
   *   date_from: '2024-01-01',
   *   date_to: '2024-01-31',
   *   page: 1,
   *   pageSize: 20
   * });
   * console.log(billings.data); // Array of billing records
   * console.log(billings.total); // Total count
   * ```
   */
  async list(params) {
    return this.http.get("/billings", params);
  }
  /**
   * Get a single billing record by ID
   *
   * @param id - Billing record ID
   * @returns Billing record details
   *
   * @example
   * ```typescript
   * const billing = await client.billings.get('uuid-here');
   * console.log(billing.total_amount);
   * ```
   */
  async get(id) {
    return this.http.get(`/billings/${encodeURIComponent(id)}`);
  }
  /**
   * Create a new billing record
   *
   * @param data - Billing creation data
   * @returns Created billing record
   *
   * @example
   * ```typescript
   * const billing = await client.billings.create({
   *   rate_card_id: 'rate-card-uuid',
   *   contractor_id: 'contractor-uuid',
   *   waybill_id: 'waybill-uuid',
   *   quantity: 1
   * });
   * ```
   */
  async create(data) {
    return this.http.post("/billings", data);
  }
  /**
   * Update a billing record
   *
   * @param id - Billing record ID
   * @param data - Fields to update (name, quantity, status)
   * @returns Updated billing record
   */
  async update(id, data) {
    return this.http.patch(`/billings/${encodeURIComponent(id)}`, data);
  }
  /**
   * Delete a billing record
   *
   * @param id - Billing record ID
   */
  async delete(id) {
    await this.http.delete(`/billings/${encodeURIComponent(id)}`);
  }
  /**
   * Send billing records via email as CSV attachment
   *
   * @param data - Email request with recipient and optional filters or billing IDs
   *
   * @example
   * ```typescript
   * // Send specific billings
   * await client.billings.sendEmail({
   *   recipient_email: 'finance@example.com',
   *   billing_ids: ['billing-id-1', 'billing-id-2'],
   *   subject: 'Billing Statement',
   *   message: 'Please find attached.'
   * });
   *
   * // Send filtered billings
   * await client.billings.sendEmail({
   *   recipient_email: 'finance@example.com',
   *   filter: {
   *     contractor_id: 'contractor-uuid',
   *     date_from: '2024-01-01',
   *     date_to: '2024-01-31'
   *   }
   * });
   * ```
   */
  async sendEmail(data) {
    return this.http.post("/billings/email", data);
  }
};

// src/resources/invoices.ts
var Invoices = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * List invoices with optional filters
   *
   * @param params - Query parameters for filtering
   * @returns Paginated list of invoices
   *
   * @example
   * ```typescript
   * const invoices = await client.invoices.list({
   *   status: 'issued',
   *   contractor_id: 'contractor-uuid',
   *   page: 1,
   *   pageSize: 20
   * });
   * ```
   */
  async list(params) {
    return this.http.get("/invoices", params);
  }
  /**
   * Get a single invoice by ID
   *
   * @param id - Invoice ID
   * @returns Invoice details with line items
   *
   * @example
   * ```typescript
   * const invoice = await client.invoices.get('invoice-uuid');
   * console.log(invoice.invoice_no); // 'INV-2024-001'
   * console.log(invoice.line_items); // Array of line items
   * ```
   */
  async get(id) {
    return this.http.get(`/invoices/${encodeURIComponent(id)}`);
  }
  /**
   * Create a new invoice
   *
   * @param data - Invoice creation data
   * @returns Created invoice
   *
   * @example
   * ```typescript
   * const invoice = await client.invoices.create({
   *   contractor_id: 'contractor-uuid',
   *   period_start: '2024-01-01',
   *   period_end: '2024-01-31',
   *   billing_ids: ['billing-1', 'billing-2'],
   *   tax_rate: 7
   * });
   * ```
   */
  async create(data) {
    return this.http.post("/invoices", data);
  }
  /**
   * Update an invoice
   *
   * @param id - Invoice ID
   * @param data - Fields to update
   * @returns Updated invoice
   *
   * @example
   * ```typescript
   * await client.invoices.update('invoice-uuid', {
   *   status: 'canceled',
   *   notes: 'Invoice canceled due to order cancellation'
   * });
   * ```
   */
  async update(id, data) {
    return this.http.patch(`/invoices/${encodeURIComponent(id)}`, data);
  }
  /**
   * Delete an invoice (only draft invoices can be deleted)
   *
   * @param id - Invoice ID
   */
  async delete(id) {
    await this.http.delete(`/invoices/${encodeURIComponent(id)}`);
  }
  /**
   * Issue an invoice (change status from draft to issued)
   *
   * @param id - Invoice ID
   * @param data - Optional issue date and due date
   * @returns Updated invoice with issue date
   *
   * @example
   * ```typescript
   * const issued = await client.invoices.issue('invoice-uuid', {
   *   due_date: '2024-03-01'
   * });
   * console.log(issued.data.status); // 'issued'
   * ```
   */
  async issue(id, data) {
    return this.http.post(`/invoices/${encodeURIComponent(id)}/issue`, data ?? {});
  }
  /**
   * Send invoice via email as PDF attachment
   *
   * @param id - Invoice ID
   * @param data - Email details
   *
   * @example
   * ```typescript
   * await client.invoices.sendEmail('invoice-uuid', {
   *   recipient_email: 'billing@customer.com',
   *   cc_emails: ['accounts@customer.com'],
   *   subject: 'Invoice INV-2024-001',
   *   message: 'Please find your invoice attached.'
   * });
   * ```
   */
  async sendEmail(id, data) {
    return this.http.post(`/invoices/${encodeURIComponent(id)}/email`, data);
  }
  /**
   * Add billing records as line items to an invoice
   *
   * @param id - Invoice ID
   * @param billingIds - Array of billing record IDs
   *
   * @example
   * ```typescript
   * await client.invoices.addLineItems('invoice-uuid', ['billing-1', 'billing-2']);
   * ```
   */
  async addLineItems(id, billingIds) {
    return this.http.post(`/invoices/${encodeURIComponent(id)}/line-items`, { billing_ids: billingIds });
  }
  /**
   * Remove billing records from an invoice
   *
   * @param id - Invoice ID
   * @param billingIds - Array of billing record IDs to remove
   */
  async removeLineItems(id, billingIds) {
    return this.http.delete(`/invoices/${encodeURIComponent(id)}/line-items`, { billing_ids: billingIds });
  }
};

// src/resources/payments.ts
var Payments = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * List payments with optional filters
   *
   * @param params - Query parameters for filtering
   * @returns Paginated list of payments
   *
   * @example
   * ```typescript
   * const payments = await client.payments.list({
   *   status: 'verified',
   *   invoice_id: 'invoice-uuid',
   *   from_date: '2024-01-01',
   *   to_date: '2024-01-31',
   *   page: 1,
   *   pageSize: 20
   * });
   * ```
   */
  async list(params) {
    return this.http.get("/payments", params);
  }
  /**
   * Get a single payment by ID
   *
   * @param id - Payment ID
   * @returns Payment details with allocations
   *
   * @example
   * ```typescript
   * const payment = await client.payments.get('payment-uuid');
   * console.log(payment.allocations); // Invoice allocations
   * ```
   */
  async get(id) {
    return this.http.get(`/payments/${encodeURIComponent(id)}`);
  }
  /**
   * Create a new payment
   *
   * @param data - Payment creation data
   * @returns Created payment
   *
   * @example
   * ```typescript
   * const payment = await client.payments.create({
   *   amount: 5000,
   *   payment_method: 'bank_transfer',
   *   payment_date: '2024-02-01',
   *   contractor_id: 'contractor-uuid',
   *   allocations: [
   *     { invoice_id: 'invoice-1', amount: 3000 },
   *     { invoice_id: 'invoice-2', amount: 2000 }
   *   ]
   * });
   * ```
   */
  async create(data) {
    return this.http.post("/payments", data);
  }
  /**
   * Update a payment
   *
   * @param id - Payment ID
   * @param data - Fields to update
   * @returns Updated payment
   *
   * @example
   * ```typescript
   * await client.payments.update('payment-uuid', {
   *   status: 'verified',
   *   reference_no: 'BANK-REF-123'
   * });
   * ```
   */
  async update(id, data) {
    return this.http.patch(`/payments/${encodeURIComponent(id)}`, data);
  }
  /**
   * Delete a payment
   *
   * @param id - Payment ID
   */
  async delete(id) {
    await this.http.delete(`/payments/${encodeURIComponent(id)}`);
  }
  // ---- Allocations ----
  /**
   * Get allocations for a payment
   *
   * @param id - Payment ID
   * @returns Array of payment allocations
   */
  async getAllocations(id) {
    return this.http.get(`/payments/${encodeURIComponent(id)}/allocations`);
  }
  /**
   * Replace all allocations for a payment
   *
   * @param id - Payment ID
   * @param allocations - New allocations to set
   *
   * @example
   * ```typescript
   * await client.payments.replaceAllocations('payment-uuid', [
   *   { invoice_id: 'invoice-1', amount: 3000 },
   *   { invoice_id: 'invoice-2', amount: 2000 }
   * ]);
   * ```
   */
  async replaceAllocations(id, allocations) {
    return this.http.put(`/payments/${encodeURIComponent(id)}/allocations`, {
      allocations
    });
  }
  /**
   * Create a payment allocation
   *
   * @param id - Payment ID
   * @param invoiceId - Invoice ID to allocate to
   * @param amount - Allocation amount
   * @returns Created allocation
   * @deprecated Use replaceAllocations instead
   */
  async createAllocation(id, invoiceId, amount) {
    return this.http.post(`/payments/${encodeURIComponent(id)}/allocations`, {
      invoice_id: invoiceId,
      amount
    });
  }
  // ---- Bank Slip ----
  /**
   * Get bank slip for a payment
   *
   * @param id - Payment ID
   * @returns Bank slip or null if none exists
   *
   * @example
   * ```typescript
   * const slip = await client.payments.getSlip('payment-uuid');
   * if (slip) {
   *   console.log(slip.slip_url);
   * }
   * ```
   */
  async getSlip(id) {
    return this.http.get(`/payments/${encodeURIComponent(id)}/slip`);
  }
  /**
   * Upload bank slip metadata for a payment
   *
   * @param id - Payment ID
   * @param data - Bank slip data
   * @returns Created bank slip
   *
   * @example
   * ```typescript
   * const slip = await client.payments.uploadSlip('payment-uuid', {
   *   slip_url: 'https://storage.example.com/slips/123.jpg',
   *   bank_name: 'Bangkok Bank',
   *   transfer_date: '2024-02-01',
   *   transfer_amount: 5000,
   *   transfer_reference: 'REF-123'
   * });
   * ```
   */
  async uploadSlip(id, data) {
    return this.http.post(
      `/payments/${encodeURIComponent(id)}/slip`,
      data
    );
  }
  /**
   * Verify or reject a bank slip
   *
   * @param id - Payment ID
   * @param data - Verification data
   *
   * @example
   * ```typescript
   * await client.payments.verifySlip('payment-uuid', {
   *   verified: true,
   *   verification_notes: 'Slip verified successfully'
   * });
   * ```
   */
  async verifySlip(id, data) {
    return this.http.post(`/payments/${encodeURIComponent(id)}/slip/verify`, data);
  }
  // ---- FlashPay ----
  /**
   * Initiate a FlashPay payment (QR code or mobile banking)
   *
   * @param data - FlashPay request data
   * @returns QR code data or deeplink URL depending on flashpay_type
   *
   * @example
   * ```typescript
   * // QR code payment
   * const qr = await client.payments.initiateFlashPay({
   *   amount: 5000,
   *   flashpay_type: 'qr',
   *   contractor_id: 'contractor-uuid',
   *   allocations: [{ invoice_id: 'invoice-1', amount: 5000 }]
   * });
   * if ('qr_image' in qr) {
   *   console.log(qr.qr_image); // Base64 QR image
   * }
   *
   * // Mobile banking payment
   * const app = await client.payments.initiateFlashPay({
   *   amount: 5000,
   *   flashpay_type: 'app',
   *   flashpay_bank_code: 'bbl',
   *   contractor_id: 'contractor-uuid',
   *   allocations: [{ invoice_id: 'invoice-1', amount: 5000 }]
   * });
   * if ('deeplink_url' in app) {
   *   console.log(app.deeplink_url);
   * }
   * ```
   */
  async initiateFlashPay(data) {
    const result = await this.http.post(
      "/payments/flashpay",
      data
    );
    return result.data;
  }
  /**
   * Generate a FlashPay QR code for payment
   * @deprecated Use initiateFlashPay instead
   */
  async generateFlashPayQR(data) {
    return this.initiateFlashPay(data);
  }
};

// src/resources/rate-cards.ts
var RateCards = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * List rate cards with optional filters
   *
   * @param params - Query parameters for filtering
   * @returns Array of rate cards
   *
   * @example
   * ```typescript
   * const rateCards = await client.rateCards.list({
   *   service_id: 'service-uuid'
   * });
   * ```
   */
  async list(params) {
    return this.http.get("/rate-cards", params);
  }
  /**
   * Get a single rate card by ID
   *
   * @param id - Rate card ID
   * @returns Rate card details
   *
   * @example
   * ```typescript
   * const rateCard = await client.rateCards.get('rate-card-uuid');
   * console.log(rateCard.unit_price); // 50.00
   * ```
   */
  async get(id) {
    return this.http.get(`/rate-cards/${encodeURIComponent(id)}`);
  }
  /**
   * Create a new rate card
   *
   * @param data - Rate card creation data
   * @returns Created rate card
   *
   * @example
   * ```typescript
   * const rateCard = await client.rateCards.create({
   *   name: 'Express Delivery',
   *   unit_price: 75.00,
   *   service_id: 'service-uuid',
   *   description: 'Same-day delivery rate'
   * });
   * ```
   */
  async create(data) {
    return this.http.post("/rate-cards", data);
  }
  /**
   * Update a rate card
   *
   * @param id - Rate card ID
   * @param data - Fields to update
   * @returns Updated rate card
   *
   * @example
   * ```typescript
   * await client.rateCards.update('rate-card-uuid', {
   *   unit_price: 80.00,
   *   name: 'Premium Express Delivery'
   * });
   * ```
   */
  async update(id, data) {
    return this.http.patch(`/rate-cards/${encodeURIComponent(id)}`, data);
  }
  /**
   * Delete a rate card
   *
   * @param id - Rate card ID
   */
  async delete(id) {
    await this.http.delete(`/rate-cards/${encodeURIComponent(id)}`);
  }
};

// src/resources/sender-accounts.ts
var SenderAccounts = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * List sender accounts with optional filters
   *
   * @param params - Query parameters for filtering
   * @returns Paginated list of sender accounts
   *
   * @example
   * ```typescript
   * const accounts = await client.senderAccounts.list({
   *   search: 'Acme',
   *   is_active: true,
   *   limit: 50
   * });
   * console.log(accounts.data); // Array of sender accounts
   * ```
   */
  async list(params) {
    return this.http.get("/sender-accounts", params);
  }
  /**
   * Get a single sender account by ID or sender_code
   *
   * @param id - Sender account ID or sender_code
   * @returns Sender account details
   *
   * @example
   * ```typescript
   * const account = await client.senderAccounts.get('account-uuid');
   * console.log(account.sender_code); // 'ACME001'
   * ```
   */
  async get(id) {
    return this.http.get(`/sender-accounts/${encodeURIComponent(id)}`);
  }
  /**
   * Create a new sender account
   *
   * @param data - Sender account creation data
   * @returns Created sender account
   *
   * @example
   * ```typescript
   * const account = await client.senderAccounts.create({
   *   name: 'Acme Corp',
   *   company_name: 'Acme Corporation',
   *   email: 'shipping@acme.com',
   *   phone: '0812345678'
   * });
   * console.log(account.sender_code); // Auto-generated code
   * ```
   */
  async create(data) {
    return this.http.post("/sender-accounts", data);
  }
  /**
   * Update a sender account
   *
   * @param id - Sender account ID
   * @param data - Fields to update
   * @returns Updated sender account
   *
   * @example
   * ```typescript
   * await client.senderAccounts.update('account-uuid', {
   *   is_active: false
   * });
   * ```
   */
  async update(id, data) {
    return this.http.put(`/sender-accounts/${encodeURIComponent(id)}`, data);
  }
  /**
   * Delete a sender account
   *
   * @param id - Sender account ID
   */
  async delete(id) {
    await this.http.delete(`/sender-accounts/${encodeURIComponent(id)}`);
  }
  // ---- Addresses ----
  /**
   * List addresses linked to a sender account
   *
   * @param id - Sender account ID
   * @param params - Optional filters (address_type, is_active)
   * @returns Array of addresses
   *
   * @example
   * ```typescript
   * const addresses = await client.senderAccounts.listAddresses('account-uuid', {
   *   address_type: 'pickup'
   * });
   * ```
   */
  async listAddresses(id, params) {
    const result = await this.http.get(
      `/sender-accounts/${encodeURIComponent(id)}/addresses`,
      params
    );
    return result.data;
  }
  /**
   * Get a single address linked to a sender account
   *
   * @param id - Sender account ID
   * @param addressId - Address ID
   * @returns Address details
   */
  async getAddress(id, addressId) {
    return this.http.get(
      `/sender-accounts/${encodeURIComponent(id)}/addresses/${encodeURIComponent(addressId)}`
    );
  }
  /**
   * Add a new address to a sender account
   *
   * @param id - Sender account ID
   * @param data - Address creation data
   * @returns Created address
   *
   * @example
   * ```typescript
   * const address = await client.senderAccounts.createAddress('account-uuid', {
   *   street_line: '123 Sukhumvit Road',
   *   city: 'Bangkok',
   *   state: 'Bangkok',
   *   zip_code: '10110',
   *   address_type: 'pickup',
   *   is_default: true
   * });
   * ```
   */
  async createAddress(id, data) {
    return this.http.post(
      `/sender-accounts/${encodeURIComponent(id)}/addresses`,
      data
    );
  }
  /**
   * Update an address linked to a sender account
   *
   * @param id - Sender account ID
   * @param addressId - Address ID
   * @param data - Fields to update
   * @returns Updated address
   *
   * @example
   * ```typescript
   * await client.senderAccounts.updateAddress('account-uuid', 'address-uuid', {
   *   address: { street_line: '456 New Road' },
   *   is_default: true
   * });
   * ```
   */
  async updateAddress(id, addressId, data) {
    return this.http.put(
      `/sender-accounts/${encodeURIComponent(id)}/addresses/${encodeURIComponent(addressId)}`,
      data
    );
  }
  /**
   * Remove an address from a sender account
   *
   * @param id - Sender account ID
   * @param addressId - Address ID
   */
  async deleteAddress(id, addressId) {
    await this.http.delete(
      `/sender-accounts/${encodeURIComponent(id)}/addresses/${encodeURIComponent(addressId)}`
    );
  }
};

// src/resources/billing-profiles.ts
var BillingProfiles = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * List billing profiles with optional filters
   *
   * @param params - Query parameters for filtering
   * @returns Paginated list of billing profiles
   *
   * @example
   * ```typescript
   * const profiles = await client.billingProfiles.list({
   *   billing_type: 'consolidated',
   *   is_active: true,
   *   page: 1,
   *   pageSize: 20
   * });
   * ```
   */
  async list(params) {
    return this.http.get("/billing-profiles", params);
  }
  /**
   * Get a single billing profile by ID
   *
   * @param id - Billing profile ID
   * @returns Billing profile details
   *
   * @example
   * ```typescript
   * const profile = await client.billingProfiles.get('profile-uuid');
   * console.log(profile.billing_cycle); // 'monthly'
   * ```
   */
  async get(id) {
    const result = await this.http.get(`/billing-profiles/${encodeURIComponent(id)}`);
    return result.data;
  }
  /**
   * Create a new billing profile
   *
   * @param data - Billing profile creation data
   * @returns Created billing profile
   *
   * @example
   * ```typescript
   * const profile = await client.billingProfiles.create({
   *   contractor_id: 'contractor-uuid',
   *   billing_type: 'consolidated',
   *   billing_cycle: 'monthly',
   *   cycle_day: 1,
   *   payment_terms: 'net_30',
   *   default_tax_rate: 7,
   *   auto_issue: true
   * });
   * ```
   */
  async create(data) {
    const result = await this.http.post(
      "/billing-profiles",
      data
    );
    return result.data;
  }
  /**
   * Update a billing profile
   *
   * @param id - Billing profile ID
   * @param data - Fields to update
   * @returns Updated billing profile
   *
   * @example
   * ```typescript
   * await client.billingProfiles.update('profile-uuid', {
   *   auto_issue: false,
   *   payment_terms: 'net_60'
   * });
   * ```
   */
  async update(id, data) {
    const result = await this.http.patch(
      `/billing-profiles/${encodeURIComponent(id)}`,
      data
    );
    return result.data;
  }
  /**
   * Deactivate a billing profile (soft delete)
   *
   * @param id - Billing profile ID
   * @returns Deactivated billing profile
   */
  async delete(id) {
    const result = await this.http.delete(
      `/billing-profiles/${encodeURIComponent(id)}`
    );
    return result.data;
  }
  // ---- Billing Cycles ----
  /**
   * List cycle runs for a billing profile
   *
   * @param id - Billing profile ID
   * @param params - Optional filters (status, pagination)
   * @returns Paginated list of cycle runs
   *
   * @example
   * ```typescript
   * const cycles = await client.billingProfiles.listCycles('profile-uuid', {
   *   status: 'completed',
   *   page: 1,
   *   pageSize: 10
   * });
   * ```
   */
  async listCycles(id, params) {
    return this.http.get(
      `/billing-profiles/${encodeURIComponent(id)}/cycles`,
      params
    );
  }
  /**
   * Manually trigger a billing cycle run
   *
   * @param id - Billing profile ID (must be a consolidated profile)
   * @param data - Optional as_of_date
   * @returns Cycle run result
   *
   * @example
   * ```typescript
   * const result = await client.billingProfiles.triggerCycle('profile-uuid', {
   *   as_of_date: '2024-02-01'
   * });
   * ```
   */
  async triggerCycle(id, data) {
    const result = await this.http.post(
      `/billing-profiles/${encodeURIComponent(id)}/cycles`,
      data ?? {}
    );
    return result.data;
  }
};

// src/resources/delivery-events.ts
var DeliveryEvents = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * Create a delivery event
   *
   * @param data - Event creation data
   * @returns Created delivery event
   *
   * @example
   * ```typescript
   * const event = await client.deliveryEvents.create({
   *   waybill_id: 'waybill-uuid',
   *   event_type: 'delivered',
   *   notes: 'Left at front door',
   *   photos: ['base64-encoded-image...']
   * });
   * ```
   */
  async create(data) {
    return this.http.post("/delivery-events", data);
  }
  /**
   * Upload POD images for a delivery event via multipart form data
   *
   * Note: This method accepts File or Blob objects for browser/Node.js environments.
   * For Node.js, you can use the `File` or `Blob` class from `node:buffer`.
   *
   * @param eventId - Delivery event ID
   * @param photos - Array of File or Blob objects
   * @returns Upload result
   *
   * @example
   * ```typescript
   * // Node.js
   * import { readFileSync } from 'fs';
   * const photoBuffer = readFileSync('photo.jpg');
   * const blob = new Blob([photoBuffer], { type: 'image/jpeg' });
   *
   * await client.deliveryEvents.uploadPods('event-uuid', [blob]);
   * ```
   */
  async uploadPods(eventId, photos) {
    const formData = new FormData();
    photos.forEach((photo, index) => {
      formData.append("photos[]", photo, `photo-${index}`);
    });
    const baseUrl = this.http.baseUrl;
    const headers = this.http.headers;
    const response = await fetch(
      `${baseUrl}/delivery-events/${encodeURIComponent(eventId)}/pods`,
      {
        method: "POST",
        headers: { ...headers },
        body: formData
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? "Failed to upload PODs");
    }
    return response.json();
  }
  /**
   * Delete a POD image from a delivery event
   *
   * @param eventId - Delivery event ID
   * @param imageUrl - The image URL to delete (URL-encoded)
   *
   * @example
   * ```typescript
   * await client.deliveryEvents.deletePod('event-uuid', 'https://storage.example.com/pods/photo.jpg');
   * ```
   */
  async deletePod(eventId, imageUrl) {
    await this.http.delete(
      `/delivery-events/${encodeURIComponent(eventId)}/pods/${encodeURIComponent(imageUrl)}`
    );
  }
};

// src/resources/reports.ts
var Reports = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * Get billing breakdown by service
   *
   * @param params - Date range and optional contractor filter
   * @returns Billing data grouped by service with totals
   *
   * @example
   * ```typescript
   * const report = await client.reports.billingByService({
   *   date_from: '2024-01-01',
   *   date_to: '2024-01-31',
   *   contractor_id: 'contractor-uuid'
   * });
   * console.log(report.totals); // { quantity: 150, amount: 7500 }
   * ```
   */
  async billingByService(params) {
    return this.http.get("/reports/billing-by-service", params);
  }
  /**
   * Get billing by service report as CSV
   *
   * @param params - Date range and optional contractor filter
   * @returns CSV content as string
   */
  async billingByServiceCSV(params) {
    return this._fetchCSV("/reports/billing-by-service", { ...params, format: "csv" });
  }
  /**
   * Get outstanding invoices report
   *
   * @param params - Optional contractor and status filters
   * @returns Outstanding invoices with aging analysis
   *
   * @example
   * ```typescript
   * const report = await client.reports.outstandingInvoices({
   *   status: 'overdue'
   * });
   * console.log(report.data); // Array of overdue invoices
   * ```
   */
  async outstandingInvoices(params) {
    return this.http.get("/reports/outstanding-invoices", params);
  }
  /**
   * Get outstanding invoices report as CSV
   */
  async outstandingInvoicesCSV(params) {
    return this._fetchCSV("/reports/outstanding-invoices", { ...params, format: "csv" });
  }
  /**
   * Get payment history report
   *
   * @param params - Date range and optional filters
   * @returns Payment history with summary
   *
   * @example
   * ```typescript
   * const report = await client.reports.paymentHistory({
   *   date_from: '2024-01-01',
   *   date_to: '2024-01-31'
   * });
   * ```
   */
  async paymentHistory(params) {
    return this.http.get("/reports/payment-history", params);
  }
  /**
   * Get payment history report as CSV
   */
  async paymentHistoryCSV(params) {
    return this._fetchCSV("/reports/payment-history", { ...params, format: "csv" });
  }
  /**
   * Get revenue summary report
   *
   * @param params - Date range, period, and optional contractor filter
   * @returns Revenue data grouped by time period
   *
   * @example
   * ```typescript
   * const report = await client.reports.revenueSummary({
   *   date_from: '2024-01-01',
   *   date_to: '2024-12-31',
   *   period: 'monthly'
   * });
   * ```
   */
  async revenueSummary(params) {
    return this.http.get("/reports/revenue-summary", params);
  }
  /**
   * Get revenue summary report as CSV
   */
  async revenueSummaryCSV(params) {
    return this._fetchCSV("/reports/revenue-summary", { ...params, format: "csv" });
  }
  /**
   * Internal helper to fetch CSV reports
   */
  async _fetchCSV(path, params) {
    const baseUrl = this.http.baseUrl;
    const headers = this.http.headers;
    const response = await fetch(
      `${baseUrl}${path}${buildQueryString(params)}`,
      { headers: { ...headers } }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? "Failed to fetch report");
    }
    return response.arrayBuffer();
  }
};

// src/client.ts
var TMSClient = class {
  /**
   * Create a new TMS API client
   *
   * @param config - Client configuration
   *
   * @example
   * ```typescript
   * const client = new TMSClient({
   *   baseUrl: 'https://your-domain.com/api',
   *   apiKey: 'your-api-key',
   *   apiSecret: 'your-api-secret',
   *   timeout: 30000 // optional, defaults to 30 seconds
   * });
   * ```
   */
  constructor(config) {
    if (!config.baseUrl) {
      throw new Error("baseUrl is required");
    }
    if (!config.apiKey) {
      throw new Error("apiKey is required");
    }
    if (!config.apiSecret) {
      throw new Error("apiSecret is required");
    }
    this.http = new HttpClient(config);
    this.waybills = new Waybills(this.http);
    this.billings = new Billings(this.http);
    this.invoices = new Invoices(this.http);
    this.payments = new Payments(this.http);
    this.rateCards = new RateCards(this.http);
    this.senderAccounts = new SenderAccounts(this.http);
    this.billingProfiles = new BillingProfiles(this.http);
    this.deliveryEvents = new DeliveryEvents(this.http);
    this.reports = new Reports(this.http);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BillingProfiles,
  Billings,
  DeliveryEvents,
  Invoices,
  Payments,
  RateCards,
  Reports,
  SenderAccounts,
  TMSApiError,
  TMSClient,
  Waybills,
  generateNonce,
  generateSignature,
  getTimestamp
});
