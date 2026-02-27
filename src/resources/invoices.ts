import { HttpClient } from '../utils';
import type {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  ListInvoicesParams,
  IssueInvoiceRequest,
  SendInvoiceEmailRequest,
  PaginatedResponse,
} from '../types';

/**
 * Invoices resource for managing invoices
 */
export class Invoices {
  constructor(private readonly http: HttpClient) {}

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
  async list(params?: ListInvoicesParams): Promise<PaginatedResponse<Invoice>> {
    return this.http.get<PaginatedResponse<Invoice>>('/invoices', params as Record<string, unknown>);
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
  async get(id: string): Promise<Invoice> {
    return this.http.get<Invoice>(`/invoices/${encodeURIComponent(id)}`);
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
  async create(data: CreateInvoiceRequest): Promise<Invoice> {
    return this.http.post<Invoice>('/invoices', data as unknown as Record<string, unknown>);
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
  async update(id: string, data: UpdateInvoiceRequest): Promise<Invoice> {
    return this.http.patch<Invoice>(`/invoices/${encodeURIComponent(id)}`, data as unknown as Record<string, unknown>);
  }

  /**
   * Delete an invoice (only draft invoices can be deleted)
   *
   * @param id - Invoice ID
   */
  async delete(id: string): Promise<void> {
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
  async issue(id: string, data?: IssueInvoiceRequest): Promise<{ success: boolean; message: string; data: Invoice }> {
    return this.http.post(`/invoices/${encodeURIComponent(id)}/issue`, (data ?? {}) as Record<string, unknown>);
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
  async sendEmail(id: string, data: SendInvoiceEmailRequest): Promise<{ success: boolean; message: string; invoice_no: string }> {
    return this.http.post(`/invoices/${encodeURIComponent(id)}/email`, data as unknown as Record<string, unknown>);
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
  async addLineItems(id: string, billingIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.http.post(`/invoices/${encodeURIComponent(id)}/line-items`, { billing_ids: billingIds });
  }

  /**
   * Remove billing records from an invoice
   *
   * @param id - Invoice ID
   * @param billingIds - Array of billing record IDs to remove
   */
  async removeLineItems(id: string, billingIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.http.delete(`/invoices/${encodeURIComponent(id)}/line-items`, { billing_ids: billingIds });
  }
}
