/**
 * TMS API SDK Types
 */
interface PaginationParams {
    page?: number;
    pageSize?: number;
}
interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
interface DateRangeParams {
    date_from?: string;
    date_to?: string;
}
interface Product {
    sku: string;
    name: string;
    quantity?: number;
    number?: number;
    weight?: number;
    width?: number;
    length?: number;
    height?: number;
}
interface Parcel {
    outParcelNo: string;
    itemDesc: string;
    itemValue: number;
    weight?: number;
    width?: number;
    length?: number;
    height?: number;
    productList: Product[];
    photos?: string[];
}
interface CreateWaybillRequest {
    outTradeNo: string;
    owner: string;
    senderName: string;
    senderPhone: string;
    senderCityName: string;
    senderDistrictName: string;
    senderPostCode: string;
    senderAddress: string;
    receiverName: string;
    receiverPhone: string;
    receiverPhone2?: string;
    receiverProvinceName: string;
    receiverCityName: string;
    receiverDistrictName: string;
    receiverPostCode: string;
    receiverAddress: string;
    parcelList: Parcel[];
    remark?: string;
    service_id?: string;
    route_id?: string;
    additional_service_ids?: string[];
    sender_account?: {
        code?: string;
        id?: string;
    };
}
interface WaybillPackage {
    package_no: string;
    external_package_no: string;
}
interface CreateWaybillResponse {
    waybill_no: string;
    external_waybill_no: string;
    status: string;
    packages: WaybillPackage[];
}
interface TrackingRoute {
    state: string;
    stateText: string;
    message: string;
    createdAt: number;
}
interface WaybillEvents {
    trackingNo: string;
    state: string;
    stateText: string;
    licensePlate?: string;
    courierPhone?: string;
    podImages: string[];
    returnedItems: string[];
    routes: TrackingRoute[];
}
type LabelFormat = 'pdf' | 'png' | 'zpl';
type LabelSize = 'a4' | 'a6' | '4x6';
interface GetLabelParams {
    packageId?: string;
}
interface AddPackageRequest {
    external_package_no: string;
    weight?: number;
    width?: number;
    length?: number;
    height?: number;
    notes?: string;
    products?: Product[];
}
interface AddPackageResponse {
    package_no: string;
    external_package_no: string;
    waybill_id: string;
}
interface AdditionalService {
    id: string;
    service_id: string;
    waybill_id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'skipped';
    result?: Record<string, unknown>;
    service?: {
        id: string;
        name: string;
    };
    created_at: string;
}
interface CreateAdditionalServicesRequest {
    service_ids: string[];
}
interface UpdateAdditionalServiceRequest {
    status: 'completed' | 'skipped' | 'in_progress';
    result?: Record<string, unknown>;
}
interface BatchLabelRequest {
    waybill_nos: string[];
}
interface RecipientAddress {
    street_line: string;
    block_floor_room?: string;
    city: string;
    state: string;
    town?: string;
    zip_code: string;
    country?: string;
}
interface RecipientInput {
    name: string;
    phone: string;
    email?: string;
    address: RecipientAddress;
}
interface ConsolidateWaybillsRequest {
    waybill_ids: string[];
    external_waybill_no: string;
    sender: {
        id: string;
    };
    recipient: RecipientInput;
    service_id: string;
    route_id?: string;
    notes?: string;
    tags?: string[];
}
interface ConsolidateWaybillsResponse {
    masterWaybill: {
        id: string;
        waybill_no: string;
    };
    subWaybills: Array<{
        id: string;
        waybill_no: string;
    }>;
}
type BillingStatus = 'pending' | 'draft' | 'invoiced' | 'paid' | 'canceled';
interface BillingRecord {
    id: string;
    name: string;
    rate_card_id: string;
    contractor_id?: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    status: BillingStatus;
    waybill_id?: string;
    created_at: string;
}
interface CreateBillingRequest {
    name?: string;
    rate_card_id: string;
    contractor_id?: string;
    subcontractor_id?: string;
    sender_account_id?: string;
    organization_id?: string;
    waybill_id?: string;
    delivery_id?: string;
    quantity: number;
    status?: BillingStatus;
}
interface UpdateBillingRequest {
    name?: string;
    quantity?: number;
    status?: BillingStatus;
}
interface ListBillingsParams extends PaginationParams, DateRangeParams {
    contractor_id?: string;
    subcontractor_id?: string;
    rate_card_id?: string;
    status?: BillingStatus;
    invoice_id?: string;
}
interface BillingEmailRequest {
    recipient_email: string;
    subject?: string;
    message?: string;
    filter?: {
        contractor_id?: string;
        subcontractor_id?: string;
        status?: BillingStatus;
        date_from?: string;
        date_to?: string;
    };
    billing_ids?: string[];
}
type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partial' | 'overdue' | 'canceled';
interface InvoiceLineItem {
    id: string;
    billing_id: string;
    name: string;
    quantity: number;
    unit_price: number;
    amount: number;
    waybill_no?: string;
}
interface Invoice {
    id: string;
    invoice_no: string;
    contractor_id?: string;
    sender_account_id?: string;
    status: InvoiceStatus;
    subtotal: number;
    tax_amount: number;
    discount_amount?: number;
    total_amount: number;
    issue_date?: string;
    due_date?: string;
    period_start: string;
    period_end: string;
    notes?: string;
    payment_terms?: string;
    created_at: string;
    line_items?: InvoiceLineItem[];
}
interface CreateInvoiceRequest {
    contractor_id?: string;
    sender_account_id?: string;
    billing_ids?: string[];
    period_start: string;
    period_end: string;
    notes?: string;
    payment_terms?: string;
    tax_rate?: number;
    currency?: string;
}
interface UpdateInvoiceRequest {
    status?: InvoiceStatus;
    notes?: string;
    payment_terms?: string;
    tax_rate?: number;
    discount_amount?: number;
}
interface ListInvoicesParams extends PaginationParams {
    contractor_id?: string;
    subcontractor_id?: string;
    status?: InvoiceStatus;
    issue_date_from?: string;
    issue_date_to?: string;
    due_date_from?: string;
    due_date_to?: string;
}
interface IssueInvoiceRequest {
    due_date?: string;
    issue_date?: string;
}
interface SendInvoiceEmailRequest {
    recipient_email: string;
    cc_emails?: string[];
    subject?: string;
    message?: string;
}
/** @deprecated Use SendInvoiceEmailRequest instead */
type SendEmailRequest = SendInvoiceEmailRequest;
type PaymentStatus = 'pending' | 'verified' | 'rejected';
type PaymentMethod = 'bank_transfer' | 'flashpay';
interface PaymentAllocation {
    id: string;
    payment_id?: string;
    invoice_id: string;
    invoice_no?: string;
    amount: number;
    created_at?: string;
}
interface Payment {
    id: string;
    amount: number;
    payment_method: PaymentMethod;
    payment_date: string;
    reference_no?: string;
    status: PaymentStatus;
    notes?: string;
    contractor_id?: string;
    subcontractor_id?: string;
    sender_account_id?: string;
    created_at: string;
    allocations?: PaymentAllocation[];
}
interface CreatePaymentRequest {
    amount: number;
    payment_method: PaymentMethod;
    payment_date: string;
    notes?: string;
    allocations: Array<{
        invoice_id: string;
        amount: number;
    }>;
    contractor_id?: string;
    subcontractor_id?: string;
    sender_account_id?: string;
}
interface UpdatePaymentRequest {
    status?: PaymentStatus;
    notes?: string;
    reference_no?: string;
}
interface ListPaymentsParams extends PaginationParams {
    contractor_id?: string;
    subcontractor_id?: string;
    sender_account_id?: string;
    invoice_id?: string;
    status?: PaymentStatus;
    payment_method?: PaymentMethod;
    from_date?: string;
    to_date?: string;
}
interface ReplaceAllocationsRequest {
    allocations: Array<{
        invoice_id: string;
        amount: number;
    }>;
}
interface BankSlip {
    id: string;
    payment_id: string;
    slip_url: string;
    bank_name: string;
    transfer_date: string;
    transfer_amount: number;
    transfer_reference?: string;
    verified?: boolean;
    verification_notes?: string;
    created_at: string;
}
interface CreateBankSlipRequest {
    slip_url: string;
    bank_name: string;
    transfer_date: string;
    transfer_amount: number;
    transfer_reference?: string;
}
interface VerifyBankSlipRequest {
    verified: boolean;
    verification_notes?: string;
}
type FlashPayType = 'qr' | 'app';
interface FlashPayRequest {
    amount: number;
    allocations: Array<{
        invoice_id: string;
        amount: number;
    }>;
    flashpay_type: FlashPayType;
    flashpay_bank_code?: string;
    description?: string;
    contractor_id?: string;
    subcontractor_id?: string;
    sender_account_id?: string;
}
interface FlashPayQRResponse {
    id: string;
    qr_image: string;
    qr_raw_data: string;
    trade_no: string;
}
interface FlashPayAppResponse {
    id: string;
    deeplink_url: string;
    trade_no: string;
}
type FlashPayResponse = FlashPayQRResponse | FlashPayAppResponse;
interface RateCard {
    id: string;
    name: string;
    unit_price: number;
    service_id: string;
    service?: {
        id: string;
        name: string;
    };
    route_id?: string;
    contractor_id?: string;
    sender_account_type?: string;
    description?: string;
    created_at: string;
}
interface CreateRateCardRequest {
    name: string;
    unit_price: number;
    service_id: string;
    route_id?: string;
    contractor_id?: string;
    sender_account_type?: string;
    description?: string;
}
interface UpdateRateCardRequest {
    name?: string;
    unit_price?: number;
    service_id?: string;
    route_id?: string;
    contractor_id?: string;
    sender_account_type?: string;
    description?: string;
}
interface ListRateCardsParams {
    service_id?: string;
    contractor_id?: string;
}
interface SenderAccount {
    id: string;
    name: string;
    company_name?: string;
    sender_code: string;
    email?: string;
    phone?: string;
    type: string;
    is_active: boolean;
    metadata?: Record<string, unknown>;
    created_at: string;
}
interface CreateSenderAccountRequest {
    name: string;
    company_name?: string;
    email?: string;
    phone?: string;
    type?: string;
    is_active?: boolean;
    sender_code?: string;
    address_id?: string;
    metadata?: Record<string, unknown>;
}
interface UpdateSenderAccountRequest {
    name?: string;
    company_name?: string;
    email?: string;
    phone?: string;
    address_id?: string;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
}
interface ListSenderAccountsParams {
    search?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
}
type AddressType = 'pickup' | 'return' | 'billing' | 'warehouse';
interface SenderAccountAddress {
    id: string;
    street_line: string;
    block_floor_room?: string;
    city?: string;
    state?: string;
    town?: string;
    zip_code?: string;
    country?: string;
    address_type: AddressType;
    is_default: boolean;
    label?: string;
    metadata?: Record<string, unknown>;
    is_active?: boolean;
    created_at?: string;
}
interface CreateSenderAccountAddressRequest {
    street_line: string;
    block_floor_room?: string;
    city?: string;
    state?: string;
    town?: string;
    zip_code?: string;
    country?: string;
    address_type?: AddressType;
    is_default?: boolean;
    label?: string;
    metadata?: Record<string, unknown>;
}
interface UpdateSenderAccountAddressRequest {
    address?: {
        street_line?: string;
        block_floor_room?: string;
        city?: string;
        state?: string;
        town?: string;
        zip_code?: string;
        country?: string;
    };
    address_type?: AddressType;
    is_default?: boolean;
    is_active?: boolean;
    label?: string;
    metadata?: Record<string, unknown>;
}
interface ListSenderAccountAddressesParams {
    address_type?: AddressType;
    is_active?: boolean;
}
type BillingType = 'consolidated' | 'transactional';
type BillingCycle = 'weekly' | 'biweekly' | 'monthly' | 'custom';
type PaymentTerms = 'due_on_receipt' | 'net_7' | 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'net_90' | 'custom';
interface BillingProfile {
    id: string;
    contractor_id?: string;
    sender_account_id?: string;
    billing_type: BillingType;
    billing_cycle: BillingCycle;
    cycle_day?: number;
    cycle_weekday?: number;
    cycle_interval_days?: number;
    cycle_anchor_date?: string;
    payment_terms: PaymentTerms;
    payment_terms_days?: number;
    default_tax_rate: number;
    default_currency: string;
    default_notes?: string;
    auto_issue: boolean;
    is_active: boolean;
    created_at: string;
}
interface CreateBillingProfileRequest {
    contractor_id?: string;
    sender_account_id?: string;
    billing_type: BillingType;
    billing_cycle?: BillingCycle;
    cycle_day?: number;
    cycle_weekday?: number;
    cycle_interval_days?: number;
    cycle_anchor_date?: string;
    payment_terms?: PaymentTerms;
    payment_terms_days?: number;
    default_tax_rate?: number;
    default_currency?: string;
    default_notes?: string;
    auto_issue?: boolean;
}
interface UpdateBillingProfileRequest {
    billing_type?: BillingType;
    billing_cycle?: BillingCycle;
    cycle_day?: number | null;
    cycle_weekday?: number | null;
    cycle_interval_days?: number | null;
    cycle_anchor_date?: string | null;
    payment_terms?: PaymentTerms;
    payment_terms_days?: number | null;
    default_tax_rate?: number;
    default_currency?: string;
    default_notes?: string | null;
    auto_issue?: boolean;
    is_active?: boolean;
}
interface ListBillingProfilesParams extends PaginationParams {
    contractor_id?: string;
    sender_account_id?: string;
    billing_type?: BillingType;
    billing_cycle?: BillingCycle;
    is_active?: boolean;
}
type CycleRunStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
interface BillingCycleRun {
    id: string;
    billing_profile_id: string;
    status: CycleRunStatus;
    period_start: string;
    period_end: string;
    invoice_id?: string;
    error_message?: string;
    created_at: string;
}
interface ListCycleRunsParams extends PaginationParams {
    status?: CycleRunStatus;
}
interface TriggerCycleRequest {
    as_of_date?: string;
}
type DeliveryEventType = 'draft' | 'created' | 'picked_up' | 'accepted' | 'delivering' | 'delivered' | 'failed' | 'exception' | 'canceled' | 'rescheduled' | 'returning' | 'returned' | 'in_transit_sorted' | 'in_transit_hub_inbound' | 'in_transit_hub_outbound';
interface DeliveryEvent {
    id: string;
    waybill_id?: string;
    package_id?: string;
    event_type: DeliveryEventType;
    event_time: string;
    coordinates?: Record<string, unknown>;
    notes?: string;
    photos?: string[];
    created_at: string;
}
interface CreateDeliveryEventRequest {
    waybill_id?: string;
    package_id?: string;
    event_type: DeliveryEventType;
    event_time?: string;
    coordinates?: Record<string, unknown>;
    notes?: string;
    photos?: string[];
}
interface ReportDateRangeParams {
    date_from: string;
    date_to: string;
    format?: 'json' | 'csv';
}
interface BillingByServiceParams extends ReportDateRangeParams {
    contractor_id?: string;
}
interface BillingByServiceReport {
    date_from: string;
    date_to: string;
    data: Array<{
        service: string;
        service_id: string;
        quantity: number;
        amount: number;
    }>;
    totals: {
        quantity: number;
        amount: number;
    };
}
interface OutstandingInvoicesParams {
    contractor_id?: string;
    status?: 'issued' | 'overdue' | 'all';
    format?: 'json' | 'csv';
}
interface OutstandingInvoicesReport {
    date_as_of: string;
    data: Array<{
        invoice_no: string;
        contractor: string;
        issue_date: string;
        due_date: string;
        amount: number;
        paid: number;
        balance: number;
        days_overdue: number;
        aging_bucket: string;
    }>;
    summary: Record<string, unknown>;
}
interface PaymentHistoryParams extends ReportDateRangeParams {
    contractor_id?: string;
    method?: PaymentMethod;
}
interface PaymentHistoryReport {
    date_from: string;
    date_to: string;
    data: Array<{
        date: string;
        reference: string;
        contractor: string;
        method: string;
        amount: number;
        invoices: string[];
        status: string;
    }>;
    summary: Record<string, unknown>;
}
type ReportPeriod = 'daily' | 'weekly' | 'monthly';
interface RevenueSummaryParams extends ReportDateRangeParams {
    contractor_id?: string;
    period?: ReportPeriod;
}
interface RevenueSummaryReport {
    period: ReportPeriod;
    date_from: string;
    date_to: string;
    data: Array<{
        period: string;
        invoiced: number;
        paid: number;
        pending: number;
    }>;
    totals: Record<string, unknown>;
}
interface TMSClientConfig {
    /**
     * Base URL of the TMS API
     * @example 'https://your-domain.com/api'
     */
    baseUrl: string;
    /**
     * API key (merchant ID) for signature authentication
     */
    apiKey: string;
    /**
     * API secret for generating request signatures
     */
    apiSecret: string;
    /**
     * Request timeout in milliseconds (default: 30000)
     */
    timeout?: number;
    /**
     * Custom headers to include in all requests
     */
    headers?: Record<string, string>;
}
interface TMSError {
    code: number;
    message: string;
    details?: unknown;
}

/**
 * Canonicalize a JSON object into a deterministic string representation.
 * Recursively sorts keys at all levels and removes whitespace.
 * Must match the server-side canonicalizeJson implementation.
 */
declare function canonicalizeJson(obj: unknown): string;
/**
 * Generate SHA-256 signature for API requests using Web Crypto API.
 * Uses canonical JSON serialization of the payload (excluding the `sign` field)
 * to match the server-side signature verification.
 */
declare function generateSignature(params: Record<string, unknown>, _apiSecret?: string): Promise<string>;
/**
 * Generate a random nonce string
 */
declare function generateNonce(length?: number): string;
/**
 * Get current Unix timestamp in seconds
 */
declare function getTimestamp(): number;
/**
 * TMS API Error class
 */
declare class TMSApiError extends Error {
    readonly code: number;
    readonly details?: unknown;
    readonly statusCode?: number;
    constructor(error: TMSError, statusCode?: number);
}
/**
 * HTTP client for making API requests
 */
declare class HttpClient {
    private readonly baseUrl;
    private readonly apiKey;
    private readonly apiSecret;
    private readonly timeout;
    private readonly headers;
    constructor(config: TMSClientConfig);
    /**
     * Sign request body with HMAC signature
     */
    private signRequest;
    /**
     * Make HTTP request
     */
    request<T>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, options?: {
        body?: Record<string, unknown>;
        query?: Record<string, unknown>;
        sign?: boolean;
    }): Promise<T>;
    /**
     * GET request
     */
    get<T>(path: string, query?: Record<string, unknown>): Promise<T>;
    /**
     * POST request
     */
    post<T>(path: string, body?: Record<string, unknown>): Promise<T>;
    /**
     * PUT request
     */
    put<T>(path: string, body?: Record<string, unknown>): Promise<T>;
    /**
     * PATCH request
     */
    patch<T>(path: string, body?: Record<string, unknown>): Promise<T>;
    /**
     * DELETE request
     */
    delete<T>(path: string, body?: Record<string, unknown>): Promise<T>;
    /**
     * GET request with signature (for authenticated GET endpoints)
     */
    getWithSignature<T>(path: string, params?: Record<string, unknown>): Promise<T>;
}

/**
 * Waybills resource for managing shipping orders
 */
declare class Waybills {
    private readonly http;
    constructor(http: HttpClient);
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
    create(data: CreateWaybillRequest): Promise<CreateWaybillResponse>;
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
    cancel(waybillNo: string): Promise<{
        message: string;
    }>;
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
    getEvents(waybillNo: string): Promise<WaybillEvents>;
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
    getLabel(waybillNo: string, params?: GetLabelParams): Promise<ArrayBuffer>;
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
    getBatchLabel(waybillNos: string[]): Promise<ArrayBuffer>;
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
    addPackage(waybillNo: string, data: AddPackageRequest): Promise<AddPackageResponse>;
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
    listAdditionalServices(waybillNo: string): Promise<AdditionalService[]>;
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
    addAdditionalServices(waybillNo: string, serviceIds: string[]): Promise<AdditionalService[]>;
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
    updateAdditionalService(waybillNo: string, serviceId: string, data: UpdateAdditionalServiceRequest): Promise<AdditionalService>;
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
    consolidate(data: ConsolidateWaybillsRequest): Promise<ConsolidateWaybillsResponse>;
    /**
     * Get tracking routes in legacy format (for Hisense integration)
     *
     * @param waybillNo - Waybill number
     * @returns Tracking routes with numeric state codes
     */
    getRoutes(waybillNo: string): Promise<WaybillEvents>;
}

/**
 * Billing resource for managing billing records
 */
declare class Billings {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * List billing records with optional filters
     *
     * @param params - Query parameters for filtering
     * @returns Paginated list of billing records
     *
     * @example
     * ```typescript
     * const billings = await client.billings.list({
     *   status: 'pending',
     *   date_from: '2024-01-01',
     *   date_to: '2024-01-31',
     *   page: 1,
     *   pageSize: 20
     * });
     * console.log(billings.data); // Array of billing records
     * console.log(billings.total); // Total count
     * ```
     */
    list(params?: ListBillingsParams): Promise<PaginatedResponse<BillingRecord>>;
    /**
     * Get a single billing record by ID
     *
     * @param id - Billing record ID
     * @returns Billing record details
     *
     * @example
     * ```typescript
     * const billing = await client.billings.get('uuid-here');
     * console.log(billing.total_amount);
     * ```
     */
    get(id: string): Promise<BillingRecord>;
    /**
     * Create a new billing record
     *
     * @param data - Billing creation data
     * @returns Created billing record
     *
     * @example
     * ```typescript
     * const billing = await client.billings.create({
     *   rate_card_id: 'rate-card-uuid',
     *   contractor_id: 'contractor-uuid',
     *   waybill_id: 'waybill-uuid',
     *   quantity: 1
     * });
     * ```
     */
    create(data: CreateBillingRequest): Promise<BillingRecord>;
    /**
     * Update a billing record
     *
     * @param id - Billing record ID
     * @param data - Fields to update (name, quantity, status)
     * @returns Updated billing record
     */
    update(id: string, data: UpdateBillingRequest): Promise<BillingRecord>;
    /**
     * Delete a billing record
     *
     * @param id - Billing record ID
     */
    delete(id: string): Promise<void>;
    /**
     * Send billing records via email as CSV attachment
     *
     * @param data - Email request with recipient and optional filters or billing IDs
     *
     * @example
     * ```typescript
     * // Send specific billings
     * await client.billings.sendEmail({
     *   recipient_email: 'finance@example.com',
     *   billing_ids: ['billing-id-1', 'billing-id-2'],
     *   subject: 'Billing Statement',
     *   message: 'Please find attached.'
     * });
     *
     * // Send filtered billings
     * await client.billings.sendEmail({
     *   recipient_email: 'finance@example.com',
     *   filter: {
     *     contractor_id: 'contractor-uuid',
     *     date_from: '2024-01-01',
     *     date_to: '2024-01-31'
     *   }
     * });
     * ```
     */
    sendEmail(data: BillingEmailRequest): Promise<{
        success: boolean;
        message: string;
        records_count: number;
        total_amount: number;
    }>;
}

/**
 * Invoices resource for managing invoices
 */
declare class Invoices {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * List invoices with optional filters
     *
     * @param params - Query parameters for filtering
     * @returns Paginated list of invoices
     *
     * @example
     * ```typescript
     * const invoices = await client.invoices.list({
     *   status: 'issued',
     *   contractor_id: 'contractor-uuid',
     *   page: 1,
     *   pageSize: 20
     * });
     * ```
     */
    list(params?: ListInvoicesParams): Promise<PaginatedResponse<Invoice>>;
    /**
     * Get a single invoice by ID
     *
     * @param id - Invoice ID
     * @returns Invoice details with line items
     *
     * @example
     * ```typescript
     * const invoice = await client.invoices.get('invoice-uuid');
     * console.log(invoice.invoice_no); // 'INV-2024-001'
     * console.log(invoice.line_items); // Array of line items
     * ```
     */
    get(id: string): Promise<Invoice>;
    /**
     * Create a new invoice
     *
     * @param data - Invoice creation data
     * @returns Created invoice
     *
     * @example
     * ```typescript
     * const invoice = await client.invoices.create({
     *   contractor_id: 'contractor-uuid',
     *   period_start: '2024-01-01',
     *   period_end: '2024-01-31',
     *   billing_ids: ['billing-1', 'billing-2'],
     *   tax_rate: 7
     * });
     * ```
     */
    create(data: CreateInvoiceRequest): Promise<Invoice>;
    /**
     * Update an invoice
     *
     * @param id - Invoice ID
     * @param data - Fields to update
     * @returns Updated invoice
     *
     * @example
     * ```typescript
     * await client.invoices.update('invoice-uuid', {
     *   status: 'canceled',
     *   notes: 'Invoice canceled due to order cancellation'
     * });
     * ```
     */
    update(id: string, data: UpdateInvoiceRequest): Promise<Invoice>;
    /**
     * Delete an invoice (only draft invoices can be deleted)
     *
     * @param id - Invoice ID
     */
    delete(id: string): Promise<void>;
    /**
     * Issue an invoice (change status from draft to issued)
     *
     * @param id - Invoice ID
     * @param data - Optional issue date and due date
     * @returns Updated invoice with issue date
     *
     * @example
     * ```typescript
     * const issued = await client.invoices.issue('invoice-uuid', {
     *   due_date: '2024-03-01'
     * });
     * console.log(issued.data.status); // 'issued'
     * ```
     */
    issue(id: string, data?: IssueInvoiceRequest): Promise<{
        success: boolean;
        message: string;
        data: Invoice;
    }>;
    /**
     * Send invoice via email as PDF attachment
     *
     * @param id - Invoice ID
     * @param data - Email details
     *
     * @example
     * ```typescript
     * await client.invoices.sendEmail('invoice-uuid', {
     *   recipient_email: 'billing@customer.com',
     *   cc_emails: ['accounts@customer.com'],
     *   subject: 'Invoice INV-2024-001',
     *   message: 'Please find your invoice attached.'
     * });
     * ```
     */
    sendEmail(id: string, data: SendInvoiceEmailRequest): Promise<{
        success: boolean;
        message: string;
        invoice_no: string;
    }>;
    /**
     * Add billing records as line items to an invoice
     *
     * @param id - Invoice ID
     * @param billingIds - Array of billing record IDs
     *
     * @example
     * ```typescript
     * await client.invoices.addLineItems('invoice-uuid', ['billing-1', 'billing-2']);
     * ```
     */
    addLineItems(id: string, billingIds: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Remove billing records from an invoice
     *
     * @param id - Invoice ID
     * @param billingIds - Array of billing record IDs to remove
     */
    removeLineItems(id: string, billingIds: string[]): Promise<{
        success: boolean;
        message: string;
    }>;
}

/**
 * Payments resource for managing payments
 */
declare class Payments {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * List payments with optional filters
     *
     * @param params - Query parameters for filtering
     * @returns Paginated list of payments
     *
     * @example
     * ```typescript
     * const payments = await client.payments.list({
     *   status: 'verified',
     *   invoice_id: 'invoice-uuid',
     *   from_date: '2024-01-01',
     *   to_date: '2024-01-31',
     *   page: 1,
     *   pageSize: 20
     * });
     * ```
     */
    list(params?: ListPaymentsParams): Promise<PaginatedResponse<Payment>>;
    /**
     * Get a single payment by ID
     *
     * @param id - Payment ID
     * @returns Payment details with allocations
     *
     * @example
     * ```typescript
     * const payment = await client.payments.get('payment-uuid');
     * console.log(payment.allocations); // Invoice allocations
     * ```
     */
    get(id: string): Promise<Payment>;
    /**
     * Create a new payment
     *
     * @param data - Payment creation data
     * @returns Created payment
     *
     * @example
     * ```typescript
     * const payment = await client.payments.create({
     *   amount: 5000,
     *   payment_method: 'bank_transfer',
     *   payment_date: '2024-02-01',
     *   contractor_id: 'contractor-uuid',
     *   allocations: [
     *     { invoice_id: 'invoice-1', amount: 3000 },
     *     { invoice_id: 'invoice-2', amount: 2000 }
     *   ]
     * });
     * ```
     */
    create(data: CreatePaymentRequest): Promise<Payment>;
    /**
     * Update a payment
     *
     * @param id - Payment ID
     * @param data - Fields to update
     * @returns Updated payment
     *
     * @example
     * ```typescript
     * await client.payments.update('payment-uuid', {
     *   status: 'verified',
     *   reference_no: 'BANK-REF-123'
     * });
     * ```
     */
    update(id: string, data: UpdatePaymentRequest): Promise<Payment>;
    /**
     * Delete a payment
     *
     * @param id - Payment ID
     */
    delete(id: string): Promise<void>;
    /**
     * Get allocations for a payment
     *
     * @param id - Payment ID
     * @returns Array of payment allocations
     */
    getAllocations(id: string): Promise<PaymentAllocation[]>;
    /**
     * Replace all allocations for a payment
     *
     * @param id - Payment ID
     * @param allocations - New allocations to set
     *
     * @example
     * ```typescript
     * await client.payments.replaceAllocations('payment-uuid', [
     *   { invoice_id: 'invoice-1', amount: 3000 },
     *   { invoice_id: 'invoice-2', amount: 2000 }
     * ]);
     * ```
     */
    replaceAllocations(id: string, allocations: Array<{
        invoice_id: string;
        amount: number;
    }>): Promise<{
        success: boolean;
    }>;
    /**
     * Create a payment allocation
     *
     * @param id - Payment ID
     * @param invoiceId - Invoice ID to allocate to
     * @param amount - Allocation amount
     * @returns Created allocation
     * @deprecated Use replaceAllocations instead
     */
    createAllocation(id: string, invoiceId: string, amount: number): Promise<PaymentAllocation>;
    /**
     * Get bank slip for a payment
     *
     * @param id - Payment ID
     * @returns Bank slip or null if none exists
     *
     * @example
     * ```typescript
     * const slip = await client.payments.getSlip('payment-uuid');
     * if (slip) {
     *   console.log(slip.slip_url);
     * }
     * ```
     */
    getSlip(id: string): Promise<BankSlip | null>;
    /**
     * Upload bank slip metadata for a payment
     *
     * @param id - Payment ID
     * @param data - Bank slip data
     * @returns Created bank slip
     *
     * @example
     * ```typescript
     * const slip = await client.payments.uploadSlip('payment-uuid', {
     *   slip_url: 'https://storage.example.com/slips/123.jpg',
     *   bank_name: 'Bangkok Bank',
     *   transfer_date: '2024-02-01',
     *   transfer_amount: 5000,
     *   transfer_reference: 'REF-123'
     * });
     * ```
     */
    uploadSlip(id: string, data: CreateBankSlipRequest): Promise<BankSlip>;
    /**
     * Verify or reject a bank slip
     *
     * @param id - Payment ID
     * @param data - Verification data
     *
     * @example
     * ```typescript
     * await client.payments.verifySlip('payment-uuid', {
     *   verified: true,
     *   verification_notes: 'Slip verified successfully'
     * });
     * ```
     */
    verifySlip(id: string, data: VerifyBankSlipRequest): Promise<{
        success: boolean;
    }>;
    /**
     * Initiate a FlashPay payment (QR code or mobile banking)
     *
     * @param data - FlashPay request data
     * @returns QR code data or deeplink URL depending on flashpay_type
     *
     * @example
     * ```typescript
     * // QR code payment
     * const qr = await client.payments.initiateFlashPay({
     *   amount: 5000,
     *   flashpay_type: 'qr',
     *   contractor_id: 'contractor-uuid',
     *   allocations: [{ invoice_id: 'invoice-1', amount: 5000 }]
     * });
     * if ('qr_image' in qr) {
     *   console.log(qr.qr_image); // Base64 QR image
     * }
     *
     * // Mobile banking payment
     * const app = await client.payments.initiateFlashPay({
     *   amount: 5000,
     *   flashpay_type: 'app',
     *   flashpay_bank_code: 'bbl',
     *   contractor_id: 'contractor-uuid',
     *   allocations: [{ invoice_id: 'invoice-1', amount: 5000 }]
     * });
     * if ('deeplink_url' in app) {
     *   console.log(app.deeplink_url);
     * }
     * ```
     */
    initiateFlashPay(data: FlashPayRequest): Promise<FlashPayResponse>;
    /**
     * Generate a FlashPay QR code for payment
     * @deprecated Use initiateFlashPay instead
     */
    generateFlashPayQR(data: FlashPayRequest): Promise<FlashPayResponse>;
}

/**
 * RateCards resource for managing rate cards
 */
declare class RateCards {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * List rate cards with optional filters
     *
     * @param params - Query parameters for filtering
     * @returns Array of rate cards
     *
     * @example
     * ```typescript
     * const rateCards = await client.rateCards.list({
     *   service_id: 'service-uuid'
     * });
     * ```
     */
    list(params?: ListRateCardsParams): Promise<RateCard[]>;
    /**
     * Get a single rate card by ID
     *
     * @param id - Rate card ID
     * @returns Rate card details
     *
     * @example
     * ```typescript
     * const rateCard = await client.rateCards.get('rate-card-uuid');
     * console.log(rateCard.unit_price); // 50.00
     * ```
     */
    get(id: string): Promise<RateCard>;
    /**
     * Create a new rate card
     *
     * @param data - Rate card creation data
     * @returns Created rate card
     *
     * @example
     * ```typescript
     * const rateCard = await client.rateCards.create({
     *   name: 'Express Delivery',
     *   unit_price: 75.00,
     *   service_id: 'service-uuid',
     *   description: 'Same-day delivery rate'
     * });
     * ```
     */
    create(data: CreateRateCardRequest): Promise<RateCard>;
    /**
     * Update a rate card
     *
     * @param id - Rate card ID
     * @param data - Fields to update
     * @returns Updated rate card
     *
     * @example
     * ```typescript
     * await client.rateCards.update('rate-card-uuid', {
     *   unit_price: 80.00,
     *   name: 'Premium Express Delivery'
     * });
     * ```
     */
    update(id: string, data: UpdateRateCardRequest): Promise<RateCard>;
    /**
     * Delete a rate card
     *
     * @param id - Rate card ID
     */
    delete(id: string): Promise<void>;
}

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
declare class SenderAccounts {
    private readonly http;
    constructor(http: HttpClient);
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
    list(params?: ListSenderAccountsParams): Promise<ListSenderAccountsResponse>;
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
    get(id: string): Promise<SenderAccount>;
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
    create(data: CreateSenderAccountRequest): Promise<SenderAccount>;
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
    update(id: string, data: UpdateSenderAccountRequest): Promise<SenderAccount>;
    /**
     * Delete a sender account
     *
     * @param id - Sender account ID
     */
    delete(id: string): Promise<void>;
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
    listAddresses(id: string, params?: ListSenderAccountAddressesParams): Promise<SenderAccountAddress[]>;
    /**
     * Get a single address linked to a sender account
     *
     * @param id - Sender account ID
     * @param addressId - Address ID
     * @returns Address details
     */
    getAddress(id: string, addressId: string): Promise<SenderAccountAddress>;
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
    createAddress(id: string, data: CreateSenderAccountAddressRequest): Promise<SenderAccountAddress>;
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
    updateAddress(id: string, addressId: string, data: UpdateSenderAccountAddressRequest): Promise<SenderAccountAddress>;
    /**
     * Remove an address from a sender account
     *
     * @param id - Sender account ID
     * @param addressId - Address ID
     */
    deleteAddress(id: string, addressId: string): Promise<void>;
}

/**
 * BillingProfiles resource for managing billing profiles and cycles
 */
declare class BillingProfiles {
    private readonly http;
    constructor(http: HttpClient);
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
    list(params?: ListBillingProfilesParams): Promise<PaginatedResponse<BillingProfile>>;
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
    get(id: string): Promise<BillingProfile>;
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
    create(data: CreateBillingProfileRequest): Promise<BillingProfile>;
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
    update(id: string, data: UpdateBillingProfileRequest): Promise<BillingProfile>;
    /**
     * Deactivate a billing profile (soft delete)
     *
     * @param id - Billing profile ID
     * @returns Deactivated billing profile
     */
    delete(id: string): Promise<BillingProfile>;
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
    listCycles(id: string, params?: ListCycleRunsParams): Promise<PaginatedResponse<BillingCycleRun>>;
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
    triggerCycle(id: string, data?: TriggerCycleRequest): Promise<BillingCycleRun>;
}

/**
 * DeliveryEvents resource for managing delivery events and POD uploads
 */
declare class DeliveryEvents {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Create a delivery event
     *
     * @param data - Event creation data
     * @returns Created delivery event
     *
     * @example
     * ```typescript
     * const event = await client.deliveryEvents.create({
     *   waybill_id: 'waybill-uuid',
     *   event_type: 'delivered',
     *   notes: 'Left at front door',
     *   photos: ['base64-encoded-image...']
     * });
     * ```
     */
    create(data: CreateDeliveryEventRequest): Promise<DeliveryEvent>;
    /**
     * Upload POD images for a delivery event via multipart form data
     *
     * Note: This method accepts File or Blob objects for browser/Node.js environments.
     * For Node.js, you can use the `File` or `Blob` class from `node:buffer`.
     *
     * @param eventId - Delivery event ID
     * @param photos - Array of File or Blob objects
     * @returns Upload result
     *
     * @example
     * ```typescript
     * // Node.js
     * import { readFileSync } from 'fs';
     * const photoBuffer = readFileSync('photo.jpg');
     * const blob = new Blob([photoBuffer], { type: 'image/jpeg' });
     *
     * await client.deliveryEvents.uploadPods('event-uuid', [blob]);
     * ```
     */
    uploadPods(eventId: string, photos: Blob[]): Promise<Record<string, unknown>>;
    /**
     * Delete a POD image from a delivery event
     *
     * @param eventId - Delivery event ID
     * @param imageUrl - The image URL to delete (URL-encoded)
     *
     * @example
     * ```typescript
     * await client.deliveryEvents.deletePod('event-uuid', 'https://storage.example.com/pods/photo.jpg');
     * ```
     */
    deletePod(eventId: string, imageUrl: string): Promise<void>;
}

/**
 * Reports resource for generating financial reports
 */
declare class Reports {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Get billing breakdown by service
     *
     * @param params - Date range and optional contractor filter
     * @returns Billing data grouped by service with totals
     *
     * @example
     * ```typescript
     * const report = await client.reports.billingByService({
     *   date_from: '2024-01-01',
     *   date_to: '2024-01-31',
     *   contractor_id: 'contractor-uuid'
     * });
     * console.log(report.totals); // { quantity: 150, amount: 7500 }
     * ```
     */
    billingByService(params: BillingByServiceParams): Promise<BillingByServiceReport>;
    /**
     * Get billing by service report as CSV
     *
     * @param params - Date range and optional contractor filter
     * @returns CSV content as string
     */
    billingByServiceCSV(params: Omit<BillingByServiceParams, 'format'>): Promise<ArrayBuffer>;
    /**
     * Get outstanding invoices report
     *
     * @param params - Optional contractor and status filters
     * @returns Outstanding invoices with aging analysis
     *
     * @example
     * ```typescript
     * const report = await client.reports.outstandingInvoices({
     *   status: 'overdue'
     * });
     * console.log(report.data); // Array of overdue invoices
     * ```
     */
    outstandingInvoices(params?: OutstandingInvoicesParams): Promise<OutstandingInvoicesReport>;
    /**
     * Get outstanding invoices report as CSV
     */
    outstandingInvoicesCSV(params?: Omit<OutstandingInvoicesParams, 'format'>): Promise<ArrayBuffer>;
    /**
     * Get payment history report
     *
     * @param params - Date range and optional filters
     * @returns Payment history with summary
     *
     * @example
     * ```typescript
     * const report = await client.reports.paymentHistory({
     *   date_from: '2024-01-01',
     *   date_to: '2024-01-31'
     * });
     * ```
     */
    paymentHistory(params: PaymentHistoryParams): Promise<PaymentHistoryReport>;
    /**
     * Get payment history report as CSV
     */
    paymentHistoryCSV(params: Omit<PaymentHistoryParams, 'format'>): Promise<ArrayBuffer>;
    /**
     * Get revenue summary report
     *
     * @param params - Date range, period, and optional contractor filter
     * @returns Revenue data grouped by time period
     *
     * @example
     * ```typescript
     * const report = await client.reports.revenueSummary({
     *   date_from: '2024-01-01',
     *   date_to: '2024-12-31',
     *   period: 'monthly'
     * });
     * ```
     */
    revenueSummary(params: RevenueSummaryParams): Promise<RevenueSummaryReport>;
    /**
     * Get revenue summary report as CSV
     */
    revenueSummaryCSV(params: Omit<RevenueSummaryParams, 'format'>): Promise<ArrayBuffer>;
    /**
     * Internal helper to fetch CSV reports
     */
    private _fetchCSV;
}

/**
 * TMS API Client
 *
 * The main entry point for interacting with the TMS API.
 *
 * @example
 * ```typescript
 * import { TMSClient } from '@alphacargo/tms-sdk';
 *
 * const client = new TMSClient({
 *   baseUrl: 'https://your-domain.com/api',
 *   apiKey: 'your-api-key',
 *   apiSecret: 'your-api-secret'
 * });
 *
 * // Create a waybill
 * const waybill = await client.waybills.create({
 *   outTradeNo: 'ORDER-001',
 *   // ... other fields
 * });
 *
 * // Get tracking events
 * const events = await client.waybills.getEvents(waybill.waybill_no);
 * ```
 */
declare class TMSClient {
    private readonly http;
    /**
     * Waybills resource for managing shipping orders
     */
    readonly waybills: Waybills;
    /**
     * Billings resource for managing billing records
     */
    readonly billings: Billings;
    /**
     * Invoices resource for managing invoices
     */
    readonly invoices: Invoices;
    /**
     * Payments resource for managing payments
     */
    readonly payments: Payments;
    /**
     * RateCards resource for managing rate cards
     */
    readonly rateCards: RateCards;
    /**
     * SenderAccounts resource for managing sender accounts
     */
    readonly senderAccounts: SenderAccounts;
    /**
     * BillingProfiles resource for managing billing profiles and cycles
     */
    readonly billingProfiles: BillingProfiles;
    /**
     * DeliveryEvents resource for managing delivery events and PODs
     */
    readonly deliveryEvents: DeliveryEvents;
    /**
     * Reports resource for generating financial reports
     */
    readonly reports: Reports;
    /**
     * Create a new TMS API client
     *
     * @param config - Client configuration
     *
     * @example
     * ```typescript
     * const client = new TMSClient({
     *   baseUrl: 'https://your-domain.com/api',
     *   apiKey: 'your-api-key',
     *   apiSecret: 'your-api-secret',
     *   timeout: 30000 // optional, defaults to 30 seconds
     * });
     * ```
     */
    constructor(config: TMSClientConfig);
}

export { type AddPackageRequest, type AddPackageResponse, type AdditionalService, type AddressType, type BankSlip, type BatchLabelRequest, type BillingByServiceParams, type BillingByServiceReport, type BillingCycle, type BillingCycleRun, type BillingEmailRequest, type BillingProfile, BillingProfiles, type BillingRecord, type BillingStatus, type BillingType, Billings, type ConsolidateWaybillsRequest, type ConsolidateWaybillsResponse, type CreateAdditionalServicesRequest, type CreateBankSlipRequest, type CreateBillingProfileRequest, type CreateBillingRequest, type CreateDeliveryEventRequest, type CreateInvoiceRequest, type CreatePaymentRequest, type CreateRateCardRequest, type CreateSenderAccountAddressRequest, type CreateSenderAccountRequest, type CreateWaybillRequest, type CreateWaybillResponse, type CycleRunStatus, type DateRangeParams, type DeliveryEvent, type DeliveryEventType, DeliveryEvents, type FlashPayAppResponse, type FlashPayQRResponse, type FlashPayRequest, type FlashPayResponse, type FlashPayType, type GetLabelParams, type Invoice, type InvoiceLineItem, type InvoiceStatus, Invoices, type IssueInvoiceRequest, type LabelFormat, type LabelSize, type ListBillingProfilesParams, type ListBillingsParams, type ListCycleRunsParams, type ListInvoicesParams, type ListPaymentsParams, type ListRateCardsParams, type ListSenderAccountAddressesParams, type ListSenderAccountsParams, type OutstandingInvoicesParams, type OutstandingInvoicesReport, type PaginatedResponse, type PaginationParams, type Parcel, type Payment, type PaymentAllocation, type PaymentHistoryParams, type PaymentHistoryReport, type PaymentMethod, type PaymentStatus, type PaymentTerms, Payments, type Product, type RateCard, RateCards, type RecipientAddress, type RecipientInput, type ReplaceAllocationsRequest, type ReportDateRangeParams, type ReportPeriod, Reports, type RevenueSummaryParams, type RevenueSummaryReport, type SendEmailRequest, type SendInvoiceEmailRequest, type SenderAccount, type SenderAccountAddress, SenderAccounts, TMSApiError, TMSClient, type TMSClientConfig, type TMSError, type TrackingRoute, type TriggerCycleRequest, type UpdateAdditionalServiceRequest, type UpdateBillingProfileRequest, type UpdateBillingRequest, type UpdateInvoiceRequest, type UpdatePaymentRequest, type UpdateRateCardRequest, type UpdateSenderAccountAddressRequest, type UpdateSenderAccountRequest, type VerifyBankSlipRequest, type WaybillEvents, type WaybillPackage, Waybills, canonicalizeJson, generateNonce, generateSignature, getTimestamp };
