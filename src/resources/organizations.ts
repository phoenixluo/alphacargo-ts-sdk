import { HttpClient } from '../utils';
import type {
  Organization,
  UpdateOrganizationRequest,
} from '../types';

/**
 * Organizations resource for managing the current organization
 */
export class Organizations {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get the current authenticated organization
   *
   * @returns Organization details
   *
   * @example
   * ```typescript
   * const org = await client.organizations.get();
   * console.log(org.name); // 'Acme Corp'
   * ```
   */
  async get(): Promise<Organization> {
    return this.http.get<Organization>('/organizations');
  }

  /**
   * Update the current organization
   *
   * @param data - Fields to update
   * @returns Updated organization
   *
   * @example
   * ```typescript
   * const org = await client.organizations.update({
   *   name: 'Acme Corp Updated',
   *   phone: '0812345678'
   * });
   * ```
   */
  async update(data: UpdateOrganizationRequest): Promise<Organization> {
    return this.http.patch<Organization>('/organizations', data as unknown as Record<string, unknown>);
  }
}
