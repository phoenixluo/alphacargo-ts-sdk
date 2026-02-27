import { HttpClient } from '../utils';
import type {
  CreateWaybillRequest,
  CreateWaybillResponse,
  WaybillEvents,
  GetLabelParams,
  AddPackageRequest,
  AddPackageResponse,
  AdditionalService,
  CreateAdditionalServicesRequest,
  UpdateAdditionalServiceRequest,
  BatchLabelRequest,
  ConsolidateWaybillsRequest,
  ConsolidateWaybillsResponse,
} from '../types';

/**
 * Waybills resource for managing shipping orders
 */
export class Waybills {
  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new waybill (shipping order)
   *
   * @param data - Waybill creation data
   * @returns Created waybill with tracking information
   *
   * @example
   * ```typescript
   * const waybill = await client.waybills.create({
   *   outTradeNo: 'ORDER-2024-001',
   *   owner: 'warehouse-a',
   *   senderName: 'Acme Warehouse',
   *   senderPhone: '0212345678',
   *   senderCityName: 'Bangkok',
   *   senderDistrictName: 'Watthana',
   *   senderPostCode: '10110',
   *   senderAddress: '123 Sukhumvit Road',
   *   receiverName: 'John Doe',
   *   receiverPhone: '0812345678',
   *   receiverProvinceName: 'Bangkok',
   *   receiverCityName: 'Bangkok',
   *   receiverDistrictName: 'Chatuchak',
   *   receiverPostCode: '10900',
   *   receiverAddress: '456 Phaholyothin Road',
   *   parcelList: [{
   *     outParcelNo: 'PKG-001',
   *     itemDesc: 'Electronics',
   *     itemValue: 1500,
   *     productList: [{ name: 'Wireless Mouse', sku: 'SKU-001', quantity: 2 }]
   *   }]
   * });
   * console.log(waybill.waybill_no); // 'TH24020001'
   * ```
   */
  async create(data: CreateWaybillRequest): Promise<CreateWaybillResponse> {
    return this.http.post<CreateWaybillResponse>('/waybills', data as unknown as Record<string, unknown>);
  }

  /**
   * Cancel a waybill
   *
   * @param waybillNo - Waybill number or external waybill number
   *
   * @example
   * ```typescript
   * await client.waybills.cancel('TH24020001');
   * ```
   */
  async cancel(waybillNo: string): Promise<{ message: string }> {
    return this.http.delete<{ message: string }>(`/waybills/${encodeURIComponent(waybillNo)}`);
  }

  /**
   * Get tracking events for a waybill
   *
   * @param waybillNo - Waybill number
   * @returns Tracking events and status
   *
   * @example
   * ```typescript
   * const events = await client.waybills.getEvents('TH24020001');
   * console.log(events.state); // 'delivered'
   * console.log(events.routes); // Array of tracking events
   * ```
   */
  async getEvents(waybillNo: string): Promise<WaybillEvents> {
    return this.http.getWithSignature<WaybillEvents>(`/waybills/${encodeURIComponent(waybillNo)}/events`);
  }

  /**
   * Get shipping label for a waybill (PDF)
   *
   * @param waybillNo - Waybill number
   * @param params - Optional label params (e.g. packageId for a specific package)
   * @returns Label as ArrayBuffer (PDF)
   *
   * @example
   * ```typescript
   * const label = await client.waybills.getLabel('TH24020001');
   * fs.writeFileSync('label.pdf', Buffer.from(label));
   *
   * // Get label for a specific package
   * const pkgLabel = await client.waybills.getLabel('TH24020001', { packageId: 'pkg-uuid' });
   * ```
   */
  async getLabel(waybillNo: string, params?: GetLabelParams): Promise<ArrayBuffer> {
    const url = `/waybills/${encodeURIComponent(waybillNo)}/label`;
    const queryParts: string[] = [];
    if (params?.packageId) {
      queryParts.push(`packageId=${encodeURIComponent(params.packageId)}`);
    }
    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

    const response = await fetch(
      `${(this.http as unknown as { baseUrl: string }).baseUrl}${url}${queryString}`
    );

    if (!response.ok) {
      const error = await response.json() as Record<string, unknown>;
      throw new Error((error.error as string) ?? 'Failed to get label');
    }

    return response.arrayBuffer();
  }

  /**
   * Generate a merged PDF with labels for multiple waybills
   *
   * @param waybillNos - Array of waybill numbers (max 100)
   * @returns Merged PDF as ArrayBuffer
   *
   * @example
   * ```typescript
   * const pdf = await client.waybills.getBatchLabel(['TH24020001', 'TH24020002']);
   * fs.writeFileSync('labels.pdf', Buffer.from(pdf));
   * ```
   */
  async getBatchLabel(waybillNos: string[]): Promise<ArrayBuffer> {
    const response = await fetch(
      `${(this.http as unknown as { baseUrl: string }).baseUrl}/waybills/batch-label`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.http as unknown as { headers: Record<string, string> }).headers,
        },
        body: JSON.stringify({ waybill_nos: waybillNos } satisfies BatchLabelRequest),
      }
    );

    if (!response.ok) {
      const error = await response.json() as Record<string, unknown>;
      throw new Error((error.error as string) ?? 'Failed to get batch labels');
    }

    return response.arrayBuffer();
  }

  /**
   * Add a package to an existing waybill
   *
   * @param waybillNo - Waybill number
   * @param data - Package data
   * @returns Created package information
   *
   * @example
   * ```typescript
   * const pkg = await client.waybills.addPackage('TH24020001', {
   *   external_package_no: 'PKG-002',
   *   weight: 2.5,
   *   products: [{ name: 'Keyboard', sku: 'SKU-002', quantity: 1 }]
   * });
   * console.log(pkg.package_no); // 'TH24020001-002'
   * ```
   */
  async addPackage(waybillNo: string, data: AddPackageRequest): Promise<AddPackageResponse> {
    return this.http.post<AddPackageResponse>(
      `/waybills/${encodeURIComponent(waybillNo)}/packages`,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * List additional services for a waybill
   *
   * @param waybillNo - Waybill number
   * @returns Array of additional services
   *
   * @example
   * ```typescript
   * const services = await client.waybills.listAdditionalServices('TH24020001');
   * console.log(services); // [{ id: '...', status: 'pending', ... }]
   * ```
   */
  async listAdditionalServices(waybillNo: string): Promise<AdditionalService[]> {
    const result = await this.http.get<{ success: boolean; data: AdditionalService[] }>(
      `/waybills/${encodeURIComponent(waybillNo)}/additional-services`
    );
    return result.data;
  }

  /**
   * Add additional services to a waybill
   *
   * @param waybillNo - Waybill number
   * @param serviceIds - Array of service UUIDs to add
   * @returns Created additional services
   *
   * @example
   * ```typescript
   * await client.waybills.addAdditionalServices('TH24020001', ['service-uuid-1', 'service-uuid-2']);
   * ```
   */
  async addAdditionalServices(waybillNo: string, serviceIds: string[]): Promise<AdditionalService[]> {
    const result = await this.http.post<{ success: boolean; data: AdditionalService[] }>(
      `/waybills/${encodeURIComponent(waybillNo)}/additional-services`,
      { service_ids: serviceIds } satisfies CreateAdditionalServicesRequest as unknown as Record<string, unknown>
    );
    return result.data;
  }

  /**
   * Update an additional service status
   *
   * @param waybillNo - Waybill number
   * @param serviceId - Additional service record ID
   * @param data - Status and optional result data
   *
   * @example
   * ```typescript
   * await client.waybills.updateAdditionalService('TH24020001', 'service-record-id', {
   *   status: 'completed',
   *   result: { photo_urls: ['https://...'] }
   * });
   * ```
   */
  async updateAdditionalService(
    waybillNo: string,
    serviceId: string,
    data: UpdateAdditionalServiceRequest
  ): Promise<AdditionalService> {
    const result = await this.http.patch<{ success: boolean; data: AdditionalService }>(
      `/waybills/${encodeURIComponent(waybillNo)}/additional-services/${encodeURIComponent(serviceId)}`,
      data as unknown as Record<string, unknown>
    );
    return result.data;
  }

  /**
   * Create a consolidated waybill from multiple source waybills
   *
   * @param data - Consolidation request data
   * @returns Master waybill and sub-waybills
   *
   * @example
   * ```typescript
   * const result = await client.waybills.consolidate({
   *   waybill_ids: ['uuid-1', 'uuid-2'],
   *   external_waybill_no: 'CONSOL-001',
   *   sender: { id: 'sender-uuid' },
   *   recipient: {
   *     name: 'John Doe',
   *     phone: '0812345678',
   *     address: {
   *       street_line: '456 Road',
   *       city: 'Bangkok',
   *       state: 'Bangkok',
   *       zip_code: '10900'
   *     }
   *   },
   *   service_id: 'service-uuid'
   * });
   * console.log(result.masterWaybill.waybill_no);
   * ```
   */
  async consolidate(data: ConsolidateWaybillsRequest): Promise<ConsolidateWaybillsResponse> {
    return this.http.post<ConsolidateWaybillsResponse>(
      '/waybills/consolidated-waybills',
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Get tracking routes in legacy format (for Hisense integration)
   *
   * @param waybillNo - Waybill number
   * @returns Tracking routes with numeric state codes
   */
  async getRoutes(waybillNo: string): Promise<WaybillEvents> {
    return this.http.getWithSignature<WaybillEvents>(`/waybills/${encodeURIComponent(waybillNo)}/routes`);
  }
}
