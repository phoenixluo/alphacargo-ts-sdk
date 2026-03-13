import { HttpClient } from '../utils';
import type {
  RegionHierarchy,
  ListRegionsParams,
} from '../types';

/**
 * Regions resource for querying location hierarchy data
 * (countries → provinces → cities → districts)
 *
 * Use this to build cascading address selectors in your UI.
 *
 * @example
 * ```typescript
 * // Get available countries
 * const countries = await client.regions.listCountries();
 * // => ['TH']
 *
 * // Get full hierarchy for a country
 * const hierarchy = await client.regions.getHierarchy({ country: 'TH' });
 * // => { provinces: [{ name: 'Bangkok', cities: [{ name: 'Phra Nakhon', districts: [...] }] }] }
 *
 * // Narrow to a specific postal code
 * const filtered = await client.regions.getHierarchy({ country: 'TH', postal_code: '10110' });
 * ```
 */
export class Regions {
  constructor(private readonly http: HttpClient) {}

  /**
   * List all available countries that have region data
   *
   * @returns Array of ISO country codes
   *
   * @example
   * ```typescript
   * const countries = await client.regions.listCountries();
   * console.log(countries); // ['TH']
   * ```
   */
  async listCountries(): Promise<string[]> {
    const result = await this.http.get<{ data: string[] }>('/regions/countries');
    return result.data;
  }

  /**
   * Get the region hierarchy (provinces → cities → districts) for a country.
   * Optionally filter by postal code to narrow results.
   *
   * @param params - Country code and optional postal code
   * @returns Region hierarchy tree
   *
   * @example
   * ```typescript
   * const hierarchy = await client.regions.getHierarchy({ country: 'TH' });
   * for (const province of hierarchy.provinces) {
   *   console.log(province.name);
   *   for (const city of province.cities) {
   *     console.log(`  ${city.name}`);
   *     for (const district of city.districts) {
   *       console.log(`    ${district.name} (${district.code})`);
   *     }
   *   }
   * }
   * ```
   */
  async getHierarchy(params: ListRegionsParams): Promise<RegionHierarchy> {
    return this.http.get<RegionHierarchy>('/regions', params as unknown as Record<string, unknown>);
  }
}
