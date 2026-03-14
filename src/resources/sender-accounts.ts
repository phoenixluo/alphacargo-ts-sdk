import { HttpClient } from '../utils';
import type {
  SenderAccount,
  CreateSenderAccountRequest,
  UpdateSenderAccountRequest,
  ListSenderAccountsParams,
  SenderAccountRecipient,
  CreateSenderAccountRecipientRequest,
  UpdateSenderAccountRecipientRequest,
  ListSenderAccountRecipientsParams,
} from '../types';

interface ListSenderAccountsResponse {
  data: SenderAccount[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * SenderAccounts resource for managing sender accounts
 */
export class SenderAccounts {
  constructor(private readonly http: HttpClient) {}

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
  async list(params?: ListSenderAccountsParams): Promise<ListSenderAccountsResponse> {
    return this.http.get<ListSenderAccountsResponse>('/sender-accounts', params as Record<string, unknown>);
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
  async get(id: string): Promise<SenderAccount> {
    return this.http.get<SenderAccount>(`/sender-accounts/${encodeURIComponent(id)}`);
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
  async create(data: CreateSenderAccountRequest): Promise<SenderAccount> {
    return this.http.post<SenderAccount>('/sender-accounts', data as unknown as Record<string, unknown>);
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
  async update(id: string, data: UpdateSenderAccountRequest): Promise<SenderAccount> {
    return this.http.put<SenderAccount>(`/sender-accounts/${encodeURIComponent(id)}`, data as unknown as Record<string, unknown>);
  }

  /**
   * Delete a sender account
   *
   * @param id - Sender account ID
   */
  async delete(id: string): Promise<void> {
    await this.http.delete(`/sender-accounts/${encodeURIComponent(id)}`);
  }

  // ---- Recipients ----

  /**
   * List recipients linked to a sender account
   *
   * @param id - Sender account ID
   * @param params - Optional filters (is_active)
   * @returns Array of sender account recipients
   *
   * @example
   * ```typescript
   * const recipients = await client.senderAccounts.listRecipients('account-uuid', {
   *   is_active: true
   * });
   * ```
   */
  async listRecipients(id: string, params?: ListSenderAccountRecipientsParams): Promise<SenderAccountRecipient[]> {
    const result = await this.http.get<{ data: SenderAccountRecipient[] }>(
      `/sender-accounts/${encodeURIComponent(id)}/recipients`,
      params as Record<string, unknown>
    );
    return result.data;
  }

  /**
   * Get a single recipient linked to a sender account
   *
   * @param id - Sender account ID
   * @param recipientId - Recipient ID
   * @returns Sender account recipient details
   */
  async getRecipient(id: string, recipientId: string): Promise<SenderAccountRecipient> {
    return this.http.get<SenderAccountRecipient>(
      `/sender-accounts/${encodeURIComponent(id)}/recipients/${encodeURIComponent(recipientId)}`
    );
  }

  /**
   * Link a recipient to a sender account
   *
   * @param id - Sender account ID
   * @param data - Recipient data (name, phone, email, address, junction metadata)
   * @returns Created sender account recipient
   *
   * @example
   * ```typescript
   * const recipient = await client.senderAccounts.createRecipient('account-uuid', {
   *   name: 'John Doe',
   *   phone: '0812345678',
   *   email: 'john@example.com',
   *   address: {
   *     street_line: '123 Main St',
   *     city: 'Bangkok',
   *     state: 'Bangkok',
   *     zip_code: '10110',
   *     country: 'TH',
   *   },
   *   is_default: true,
   * });
   * ```
   */
  async createRecipient(id: string, data: CreateSenderAccountRecipientRequest): Promise<SenderAccountRecipient> {
    return this.http.post<SenderAccountRecipient>(
      `/sender-accounts/${encodeURIComponent(id)}/recipients`,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Update a recipient link on a sender account
   *
   * @param id - Sender account ID
   * @param recipientId - Recipient ID
   * @param data - Junction fields to update (is_default, label, etc.)
   * @returns Updated sender account recipient
   *
   * @example
   * ```typescript
   * await client.senderAccounts.updateRecipient('account-uuid', 'recipient-uuid', {
   *   is_default: true
   * });
   * ```
   */
  async updateRecipient(id: string, recipientId: string, data: UpdateSenderAccountRecipientRequest): Promise<SenderAccountRecipient> {
    return this.http.put<SenderAccountRecipient>(
      `/sender-accounts/${encodeURIComponent(id)}/recipients/${encodeURIComponent(recipientId)}`,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Remove a recipient from a sender account
   *
   * @param id - Sender account ID
   * @param recipientId - Recipient ID
   */
  async deleteRecipient(id: string, recipientId: string): Promise<void> {
    await this.http.delete(
      `/sender-accounts/${encodeURIComponent(id)}/recipients/${encodeURIComponent(recipientId)}`
    );
  }

}
