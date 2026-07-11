import { HttpClient } from '../utils';
import type { AddressResolveRequest, ResolvedAddress } from '../types';

/**
 * Address resource for resolving locations into structured address fields.
 */
export class Address {
  constructor(private readonly http: HttpClient) {}

  /**
   * Resolve a location into structured address fields (country, province,
   * district, subdistrict, postal code, coordinates). Provide exactly one of
   * three input modes — the response shape is identical across all of them:
   *
   *   - `{ address }`      → free-text geocode cascade
   *   - `{ url }`          → Google-Maps pin / short link → coordinates
   *   - `{ lat, lng }`     → reverse-geocode a shared device location
   *
   * @param request - One of the three input modes, plus optional `country`
   *   (ISO alpha-2 hint) and `logResolution` (defaults to `true`).
   * @returns The resolved address. Throws `TMSApiError` with status `404` when
   *   the location could not be resolved, or `400` for invalid input.
   *
   * @example
   * ```typescript
   * // Free-text
   * const a = await client.address.resolve({
   *   address: '123 Sukhumvit Rd, Bangkok',
   *   country: 'TH',
   * });
   *
   * // Google-Maps link
   * const b = await client.address.resolve({ url: 'https://maps.app.goo.gl/xyz' });
   *
   * // Reverse-geocode coordinates
   * const c = await client.address.resolve({ lat: 13.7563, lng: 100.5018 });
   * console.log(c.province, c.postal_code);
   * ```
   */
  async resolve(request: AddressResolveRequest): Promise<ResolvedAddress> {
    return this.http.post<ResolvedAddress>(
      '/address/resolve',
      request as unknown as Record<string, unknown>
    );
  }
}
