import { HttpClient } from '../utils';
import type { PublicBankAccount, BankAccountAvailability } from '../types';

/**
 * Receiving bank accounts — where an organization's customers send money for
 * the `bank_transfer` payment method.
 *
 * Read-only over the SDK, and only the payer-safe projection. Managing accounts
 * (caps, priority, statement mappings) is an operator surface in the TMS app,
 * because those settings decide how inbound volume is spread and are not the
 * business of an API client.
 *
 * Not to be confused with a bank slip, which is the PAYER's evidence of having
 * sent money and describes THEIR account.
 */
export class BankAccounts {
  constructor(private readonly http: HttpClient) {}

  /**
   * List the active receiving accounts, as a payer may see them.
   *
   * @param params.currency - Only accounts denominated in this currency. Worth
   * passing: money can only be received into an account in its own currency, so
   * an account in the wrong one is never a valid answer.
   *
   * @example
   * ```typescript
   * const accounts = await client.bankAccounts.list({ currency: 'THB' });
   * ```
   */
  async list(params?: { currency?: string }): Promise<PublicBankAccount[]> {
    const query = new URLSearchParams({ view: 'public' });
    if (params?.currency) query.set('currency', params.currency);
    return this.http.get<PublicBankAccount[]>(`/bank-accounts?${query.toString()}`);
  }

  /**
   * Whether a bank transfer can be offered for this amount and currency.
   *
   * Call it before showing the option, so a customer is never handed a payment
   * method that immediately dead-ends. It comes back false when the organization
   * holds no active account in that currency, or when every such account would
   * breach its monthly receiving cap.
   *
   * Advisory only: another payment can consume the headroom a moment later, so
   * a `true` here is not a promise that the payment will succeed.
   *
   * @example
   * ```typescript
   * const { available } = await client.bankAccounts.checkAvailability({
   *   amount: 1500,
   *   currency: 'THB',
   * });
   * ```
   */
  async checkAvailability(params: {
    amount: number;
    currency: string;
  }): Promise<BankAccountAvailability> {
    const query = new URLSearchParams({
      amount: String(params.amount),
      currency: params.currency,
    });
    return this.http.get<BankAccountAvailability>(
      `/bank-accounts/availability?${query.toString()}`,
    );
  }
}
