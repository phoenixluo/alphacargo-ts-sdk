import { HttpClient, buildQueryString } from '../utils';
import type {
  BillingByServiceParams,
  BillingByServiceReport,
  OutstandingInvoicesParams,
  OutstandingInvoicesReport,
  PaymentHistoryParams,
  PaymentHistoryReport,
  RevenueSummaryParams,
  RevenueSummaryReport,
} from '../types';

/**
 * Reports resource for generating financial reports
 */
export class Reports {
  constructor(private readonly http: HttpClient) {}

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
  async billingByService(params: BillingByServiceParams): Promise<BillingByServiceReport> {
    return this.http.get<BillingByServiceReport>('/reports/billing-by-service', params as unknown as Record<string, unknown>);
  }

  /**
   * Get billing by service report as CSV
   *
   * @param params - Date range and optional contractor filter
   * @returns CSV content as string
   */
  async billingByServiceCSV(params: Omit<BillingByServiceParams, 'format'>): Promise<ArrayBuffer> {
    return this._fetchCSV('/reports/billing-by-service', { ...params, format: 'csv' });
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
  async outstandingInvoices(params?: OutstandingInvoicesParams): Promise<OutstandingInvoicesReport> {
    return this.http.get<OutstandingInvoicesReport>('/reports/outstanding-invoices', params as unknown as Record<string, unknown>);
  }

  /**
   * Get outstanding invoices report as CSV
   */
  async outstandingInvoicesCSV(params?: Omit<OutstandingInvoicesParams, 'format'>): Promise<ArrayBuffer> {
    return this._fetchCSV('/reports/outstanding-invoices', { ...params, format: 'csv' });
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
  async paymentHistory(params: PaymentHistoryParams): Promise<PaymentHistoryReport> {
    return this.http.get<PaymentHistoryReport>('/reports/payment-history', params as unknown as Record<string, unknown>);
  }

  /**
   * Get payment history report as CSV
   */
  async paymentHistoryCSV(params: Omit<PaymentHistoryParams, 'format'>): Promise<ArrayBuffer> {
    return this._fetchCSV('/reports/payment-history', { ...params, format: 'csv' });
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
  async revenueSummary(params: RevenueSummaryParams): Promise<RevenueSummaryReport> {
    return this.http.get<RevenueSummaryReport>('/reports/revenue-summary', params as unknown as Record<string, unknown>);
  }

  /**
   * Get revenue summary report as CSV
   */
  async revenueSummaryCSV(params: Omit<RevenueSummaryParams, 'format'>): Promise<ArrayBuffer> {
    return this._fetchCSV('/reports/revenue-summary', { ...params, format: 'csv' });
  }

  /**
   * Internal helper to fetch CSV reports
   */
  private async _fetchCSV(path: string, params: Record<string, unknown>): Promise<ArrayBuffer> {
    const baseUrl = (this.http as unknown as { baseUrl: string }).baseUrl;
    const headers = (this.http as unknown as { headers: Record<string, string> }).headers;

    const response = await fetch(
      `${baseUrl}${path}${buildQueryString(params)}`,
      { headers: { ...headers } }
    );

    if (!response.ok) {
      const error = await response.json() as Record<string, unknown>;
      throw new Error((error.error as string) ?? 'Failed to fetch report');
    }

    return response.arrayBuffer();
  }
}
