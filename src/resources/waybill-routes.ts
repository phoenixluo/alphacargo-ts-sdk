import { HttpClient } from '../utils';
import type { WaybillRoute, ListWaybillRoutesParams } from '../types';

/**
 * WaybillRoutes resource for querying waybill routes
 */
export class WaybillRoutes {
  constructor(private readonly http: HttpClient) {}

  /**
   * List waybill routes with optional filters
   *
   * @param params - Query parameters for filtering
   * @returns Array of waybill routes
   *
   * @example
   * ```typescript
   * const routes = await client.waybillRoutes.list({ search: 'BKK' });
   * ```
   */
  async list(params?: ListWaybillRoutesParams): Promise<WaybillRoute[]> {
    return this.http.get<WaybillRoute[]>('/waybill-routes', params as Record<string, unknown>);
  }

  /**
   * Get a single waybill route by ID (includes legs)
   *
   * @param id - Waybill route ID
   * @returns Waybill route with legs
   *
   * @example
   * ```typescript
   * const route = await client.waybillRoutes.get('route-uuid');
   * console.log(route.legs);
   * ```
   */
  async get(id: string): Promise<WaybillRoute> {
    return this.http.get<WaybillRoute>(`/waybill-routes/${encodeURIComponent(id)}`);
  }
}
