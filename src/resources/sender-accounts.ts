import { HttpClient } from '../utils';
import type {
  SenderAccount,
  CreateSenderAccountRequest,
  UpdateSenderAccountRequest,
  ListSenderAccountsParams,
  SenderAccountAddress,
  CreateSenderAccountAddressRequest,
  UpdateSenderAccountAddressRequest,
  ListSenderAccountAddressesParams,
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
  async listAddresses(id: string, params?: ListSenderAccountAddressesParams): Promise<SenderAccountAddress[]> {
    const result = await this.http.get<{ data: SenderAccountAddress[] }>(
      `/sender-accounts/${encodeURIComponent(id)}/addresses`,
      params as Record<string, unknown>
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
  async getAddress(id: string, addressId: string): Promise<SenderAccountAddress> {
    return this.http.get<SenderAccountAddress>(
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
  async createAddress(id: string, data: CreateSenderAccountAddressRequest): Promise<SenderAccountAddress> {
    return this.http.post<SenderAccountAddress>(
      `/sender-accounts/${encodeURIComponent(id)}/addresses`,
      data as unknown as Record<string, unknown>
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
  async updateAddress(id: string, addressId: string, data: UpdateSenderAccountAddressRequest): Promise<SenderAccountAddress> {
    return this.http.put<SenderAccountAddress>(
      `/sender-accounts/${encodeURIComponent(id)}/addresses/${encodeURIComponent(addressId)}`,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Remove an address from a sender account
   *
   * @param id - Sender account ID
   * @param addressId - Address ID
   */
  async deleteAddress(id: string, addressId: string): Promise<void> {
    await this.http.delete(
      `/sender-accounts/${encodeURIComponent(id)}/addresses/${encodeURIComponent(addressId)}`
    );
  }
}
