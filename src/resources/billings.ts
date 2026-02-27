import { HttpClient } from '../utils';
import type {
  BillingRecord,
  CreateBillingRequest,
  UpdateBillingRequest,
  ListBillingsParams,
  BillingEmailRequest,
  PaginatedResponse,
} from '../types';

/**
 * Billing resource for managing billing records
 */
export class Billings {
  constructor(private readonly http: HttpClient) {}

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
  async list(params?: ListBillingsParams): Promise<PaginatedResponse<BillingRecord>> {
    return this.http.get<PaginatedResponse<BillingRecord>>('/billings', params as Record<string, unknown>);
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
  async get(id: string): Promise<BillingRecord> {
    return this.http.get<BillingRecord>(`/billings/${encodeURIComponent(id)}`);
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
  async create(data: CreateBillingRequest): Promise<BillingRecord> {
    return this.http.post<BillingRecord>('/billings', data as unknown as Record<string, unknown>);
  }

  /**
   * Update a billing record
   *
   * @param id - Billing record ID
   * @param data - Fields to update (name, quantity, status)
   * @returns Updated billing record
   */
  async update(id: string, data: UpdateBillingRequest): Promise<BillingRecord> {
    return this.http.patch<BillingRecord>(`/billings/${encodeURIComponent(id)}`, data as unknown as Record<string, unknown>);
  }

  /**
   * Delete a billing record
   *
   * @param id - Billing record ID
   */
  async delete(id: string): Promise<void> {
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
  async sendEmail(data: BillingEmailRequest): Promise<{ success: boolean; message: string; records_count: number; total_amount: number }> {
    return this.http.post('/billings/email', data as unknown as Record<string, unknown>);
  }
}
