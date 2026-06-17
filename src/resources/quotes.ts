import { HttpClient } from '../utils';
import type { CreateQuoteRequest, CreateQuoteResponse } from '../types';

/**
 * Quotes resource for the FTL/LTL shipping-quote flow.
 *
 * Only quote creation is exposed here: `POST /api/quote` uses signature
 * authentication (the API key), which is what this SDK is built around. The
 * downstream quote operations — `GET /api/quote/{id}`, `POST /api/quote/{id}/pay`,
 * `POST /api/quote/{id}/cancel`, and `GET /api/orders/{id}/tracking` — are
 * authenticated with the customer's sender-account session cookie, not an API
 * key, so they are not part of this server-to-server SDK.
 */
export class Quotes {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a shipping quotation.
   *
   * Selects a vehicle/pricing source for the shipment and persists a quotation,
   * returning the quote ID along with the resolved provider and vehicle.
   *
   * @param data - Quote request (cargo, addresses, aggregates)
   * @returns The created quotation
   *
   * @example
   * ```typescript
   * const quote = await client.quotes.create({
   *   request_id: 'req-123',
   *   draft_order_id: 'draft-456',
   *   draft_order_version: 1,
   *   pickup: { address: '123 Sukhumvit Rd, Bangkok' },
   *   delivery: { address: '456 Nimman Rd, Chiang Mai' },
   *   items: [
   *     { qty: 2, length_cm: 100, width_cm: 80, height_cm: 60, weight_kg: 25 },
   *   ],
   *   aggregates: {
   *     total_weight_kg: 50,
   *     total_volume_m3: 0.96,
   *     longest_edge_cm: 100,
   *     total_package_count: 2,
   *   },
   * });
   * console.log(quote.quotation_id, quote.provider, quote.vehicle);
   * ```
   */
  async create(data: CreateQuoteRequest): Promise<CreateQuoteResponse> {
    return this.http.post<CreateQuoteResponse>(
      '/quote',
      data as unknown as Record<string, unknown>,
    );
  }
}
