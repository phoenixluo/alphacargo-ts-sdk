import { HttpClient } from '../utils';
import type {
  BillingProfile,
  CreateBillingProfileRequest,
  UpdateBillingProfileRequest,
  ListBillingProfilesParams,
  BillingCycleRun,
  ListCycleRunsParams,
  TriggerCycleRequest,
  PaginatedResponse,
} from '../types';

/**
 * BillingProfiles resource for managing billing profiles and cycles
 */
export class BillingProfiles {
  constructor(private readonly http: HttpClient) {}

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
  async list(params?: ListBillingProfilesParams): Promise<PaginatedResponse<BillingProfile>> {
    return this.http.get<PaginatedResponse<BillingProfile>>('/billing-profiles', params as Record<string, unknown>);
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
  async get(id: string): Promise<BillingProfile> {
    const result = await this.http.get<{ data: BillingProfile }>(`/billing-profiles/${encodeURIComponent(id)}`);
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
  async create(data: CreateBillingProfileRequest): Promise<BillingProfile> {
    const result = await this.http.post<{ data: BillingProfile }>(
      '/billing-profiles',
      data as unknown as Record<string, unknown>
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
  async update(id: string, data: UpdateBillingProfileRequest): Promise<BillingProfile> {
    const result = await this.http.patch<{ data: BillingProfile }>(
      `/billing-profiles/${encodeURIComponent(id)}`,
      data as unknown as Record<string, unknown>
    );
    return result.data;
  }

  /**
   * Deactivate a billing profile (soft delete)
   *
   * @param id - Billing profile ID
   * @returns Deactivated billing profile
   */
  async delete(id: string): Promise<BillingProfile> {
    const result = await this.http.delete<{ data: BillingProfile }>(
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
  async listCycles(id: string, params?: ListCycleRunsParams): Promise<PaginatedResponse<BillingCycleRun>> {
    return this.http.get<PaginatedResponse<BillingCycleRun>>(
      `/billing-profiles/${encodeURIComponent(id)}/cycles`,
      params as Record<string, unknown>
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
  async triggerCycle(id: string, data?: TriggerCycleRequest): Promise<BillingCycleRun> {
    const result = await this.http.post<{ data: BillingCycleRun }>(
      `/billing-profiles/${encodeURIComponent(id)}/cycles`,
      (data ?? {}) as Record<string, unknown>
    );
    return result.data;
  }
}
