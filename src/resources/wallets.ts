import { HttpClient } from '../utils';
import type {
  WalletBalance,
  TopUpWalletRequest,
  WalletTopUpResponse,
  PayInvoiceWithWalletRequest,
  PayInvoiceWithWalletResponse,
  ListWalletTransactionsParams,
  WalletTransactionsResponse,
} from '../types';

/**
 * Wallets resource — prepaid deposit balances.
 *
 * A wallet is a single money ledger per sender account. Top-ups are funded
 * through FlashPay (credited on webhook confirmation); the balance can then be
 * used to pay invoices.
 */
export class Wallets {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get the wallet balance for a sender account (created lazily on first access).
   *
   * @example
   * ```typescript
   * const wallet = await client.wallets.getBalance('sender-account-uuid');
   * console.log(wallet.balance); // e.g. 1500.00
   * ```
   */
  async getBalance(senderAccountId: string): Promise<WalletBalance> {
    const result = await this.http.get<{ data: WalletBalance }>('/wallets', {
      sender_account_id: senderAccountId,
    });
    return result.data;
  }

  /**
   * Start a wallet top-up via FlashPay. Returns the QR image / deeplink and the
   * payment id. The balance is credited only when FlashPay confirms the payment.
   *
   * @example
   * ```typescript
   * const topup = await client.wallets.topUp({
   *   sender_account_id: 'sender-account-uuid',
   *   amount: 1000,
   *   flashpay_type: 'qr',
   * });
   * if (topup.type === 'qr') console.log(topup.qr_image);
   * ```
   */
  async topUp(data: TopUpWalletRequest): Promise<WalletTopUpResponse> {
    const result = await this.http.post<{ data: WalletTopUpResponse }>(
      '/wallets/topup',
      data as unknown as Record<string, unknown>
    );
    return result.data;
  }

  /**
   * Pay (part of) an invoice from the wallet balance. Defaults to the invoice's
   * outstanding balance when `amount` is omitted.
   *
   * @example
   * ```typescript
   * const result = await client.wallets.pay({
   *   sender_account_id: 'sender-account-uuid',
   *   invoice_id: 'invoice-uuid',
   * });
   * console.log(result.balance); // remaining wallet balance
   * ```
   */
  async pay(data: PayInvoiceWithWalletRequest): Promise<PayInvoiceWithWalletResponse> {
    const result = await this.http.post<{ data: PayInvoiceWithWalletResponse }>(
      '/wallets/pay',
      data as unknown as Record<string, unknown>
    );
    return result.data;
  }

  /**
   * List ledger entries for a sender account's wallet (most recent first).
   *
   * @example
   * ```typescript
   * const { data, pagination } = await client.wallets.listTransactions({
   *   sender_account_id: 'sender-account-uuid',
   *   page: 1,
   *   pageSize: 20,
   * });
   * ```
   */
  async listTransactions(
    params: ListWalletTransactionsParams
  ): Promise<WalletTransactionsResponse> {
    return this.http.get<WalletTransactionsResponse>(
      '/wallets/transactions',
      params as unknown as Record<string, unknown>
    );
  }
}
