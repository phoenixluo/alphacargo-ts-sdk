import { HttpClient } from '../utils';
import type {
  OrganizationUnit,
  CreateOrganizationUnitRequest,
  UpdateOrganizationUnitRequest,
  ListOrganizationUnitsParams,
} from '../types';

interface ListOrganizationUnitsResponse {
  data: OrganizationUnit[];
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
 * OrganizationUnits resource for managing organization units (branches, warehouses, etc.)
 */
export class OrganizationUnits {
  constructor(private readonly http: HttpClient) {}

  /**
   * List organization units with optional filters
   *
   * @param params - Query parameters for filtering
   * @returns Paginated list of organization units
   *
   * @example
   * ```typescript
   * const units = await client.organizationUnits.list({
   *   type: 'branch',
   *   is_active: true,
   *   limit: 50
   * });
   * console.log(units.data); // Array of organization units
   * ```
   */
  async list(params?: ListOrganizationUnitsParams): Promise<ListOrganizationUnitsResponse> {
    return this.http.get<ListOrganizationUnitsResponse>('/organization-units', params as Record<string, unknown>);
  }

  /**
   * Create a new organization unit
   *
   * @param data - Organization unit creation data
   * @returns Created organization unit
   *
   * @example
   * ```typescript
   * const unit = await client.organizationUnits.create({
   *   name: 'Bangkok Branch',
   *   code: 'BKK-01',
   *   type: 'branch',
   *   address: {
   *     street_line: '123 Sukhumvit Rd',
   *     city: 'Bangkok',
   *     state: 'Bangkok',
   *     zip_code: '10110',
   *     country: 'TH'
   *   },
   *   phone: '0212345678'
   * });
   * ```
   */
  async create(data: CreateOrganizationUnitRequest): Promise<OrganizationUnit> {
    return this.http.post<OrganizationUnit>('/organization-units', data as unknown as Record<string, unknown>);
  }

  /**
   * Update an organization unit
   *
   * @param id - Organization unit ID
   * @param data - Fields to update
   * @returns Updated organization unit
   *
   * @example
   * ```typescript
   * await client.organizationUnits.update('unit-uuid', {
   *   name: 'Bangkok Main Branch',
   *   is_active: false
   * });
   * ```
   */
  async update(id: string, data: UpdateOrganizationUnitRequest): Promise<OrganizationUnit> {
    return this.http.patch<OrganizationUnit>(`/organization-units/${encodeURIComponent(id)}`, data as unknown as Record<string, unknown>);
  }

  /**
   * Delete an organization unit
   *
   * @param id - Organization unit ID
   */
  async delete(id: string): Promise<void> {
    await this.http.delete(`/organization-units/${encodeURIComponent(id)}`);
  }
}
