/**
 * TMS API SDK Types
 */

// ============================================================================
// Common Types
// ============================================================================

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DateRangeParams {
  date_from?: string;
  date_to?: string;
}

// ============================================================================
// Waybill Types
// ============================================================================

export interface Product {
  sku: string;
  name: string;
  quantity?: number;
  number?: number;
  weight?: number;
  width?: number;
  length?: number;
  height?: number;
}

export interface Parcel {
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

export interface CreateWaybillRequest {
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
  sender_account?: { code?: string; id?: string };
}

export interface WaybillPackage {
  package_no: string;
  external_package_no: string;
}

export interface CreateWaybillResponse {
  waybill_no: string;
  external_waybill_no: string;
  status: string;
  packages: WaybillPackage[];
}

export interface TrackingRoute {
  state: string;
  stateText: string;
  message: string;
  createdAt: number;
}

export interface WaybillEvents {
  trackingNo: string;
  state: string;
  stateText: string;
  licensePlate?: string;
  courierPhone?: string;
  podImages: string[];
  returnedItems: string[];
  routes: TrackingRoute[];
}

export type LabelFormat = 'pdf' | 'png' | 'zpl';
export type LabelSize = 'a4' | 'a6' | '4x6';

export interface GetLabelParams {
  packageId?: string;
}

export interface AddPackageRequest {
  external_package_no: string;
  weight?: number;
  width?: number;
  length?: number;
  height?: number;
  notes?: string;
  products?: Product[];
}

export interface AddPackageResponse {
  package_no: string;
  external_package_no: string;
  waybill_id: string;
}

// --- Additional Services ---

export interface AdditionalService {
  id: string;
  service_id: string;
  waybill_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  result?: Record<string, unknown>;
  service?: { id: string; name: string };
  created_at: string;
}

export interface CreateAdditionalServicesRequest {
  service_ids: string[];
}

export interface UpdateAdditionalServiceRequest {
  status: 'completed' | 'skipped' | 'in_progress';
  result?: Record<string, unknown>;
}

// --- Batch Label ---

export interface BatchLabelRequest {
  waybill_nos: string[];
}

// --- Consolidated Waybills ---

export interface RecipientAddress {
  street_line: string;
  block_floor_room?: string;
  city: string;
  state: string;
  town?: string;
  zip_code: string;
  country?: string;
}

export interface RecipientInput {
  name: string;
  phone: string;
  email?: string;
  address: RecipientAddress;
}

export interface ConsolidateWaybillsRequest {
  waybill_ids: string[];
  external_waybill_no: string;
  sender: { id: string };
  recipient: RecipientInput;
  service_id: string;
  route_id?: string;
  notes?: string;
  tags?: string[];
}

export interface ConsolidateWaybillsResponse {
  masterWaybill: { id: string; waybill_no: string };
  subWaybills: Array<{ id: string; waybill_no: string }>;
}

// ============================================================================
// Billing Types
// ============================================================================

export type BillingStatus = 'pending' | 'draft' | 'invoiced' | 'paid' | 'canceled';

export interface BillingRecord {
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

export interface CreateBillingRequest {
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

export interface UpdateBillingRequest {
  name?: string;
  quantity?: number;
  status?: BillingStatus;
}

export interface ListBillingsParams extends PaginationParams, DateRangeParams {
  contractor_id?: string;
  subcontractor_id?: string;
  rate_card_id?: string;
  status?: BillingStatus;
  invoice_id?: string;
}

export interface BillingEmailRequest {
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

// ============================================================================
// Invoice Types
// ============================================================================

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partial' | 'overdue' | 'canceled';

export interface InvoiceLineItem {
  id: string;
  billing_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  amount: number;
  waybill_no?: string;
}

export interface Invoice {
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

export interface CreateInvoiceRequest {
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

export interface UpdateInvoiceRequest {
  status?: InvoiceStatus;
  notes?: string;
  payment_terms?: string;
  tax_rate?: number;
  discount_amount?: number;
}

export interface ListInvoicesParams extends PaginationParams {
  contractor_id?: string;
  subcontractor_id?: string;
  status?: InvoiceStatus;
  issue_date_from?: string;
  issue_date_to?: string;
  due_date_from?: string;
  due_date_to?: string;
}

export interface IssueInvoiceRequest {
  due_date?: string;
  issue_date?: string;
}

export interface SendInvoiceEmailRequest {
  recipient_email: string;
  cc_emails?: string[];
  subject?: string;
  message?: string;
}

/** @deprecated Use SendInvoiceEmailRequest instead */
export type SendEmailRequest = SendInvoiceEmailRequest;

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentStatus = 'pending' | 'verified' | 'rejected';
export type PaymentMethod = 'bank_transfer' | 'flashpay';

export interface PaymentAllocation {
  id: string;
  payment_id?: string;
  invoice_id: string;
  invoice_no?: string;
  amount: number;
  created_at?: string;
}

export interface Payment {
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

export interface CreatePaymentRequest {
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  notes?: string;
  allocations: Array<{ invoice_id: string; amount: number }>;
  contractor_id?: string;
  subcontractor_id?: string;
  sender_account_id?: string;
}

export interface UpdatePaymentRequest {
  status?: PaymentStatus;
  notes?: string;
  reference_no?: string;
}

export interface ListPaymentsParams extends PaginationParams {
  contractor_id?: string;
  subcontractor_id?: string;
  sender_account_id?: string;
  invoice_id?: string;
  status?: PaymentStatus;
  payment_method?: PaymentMethod;
  from_date?: string;
  to_date?: string;
}

export interface ReplaceAllocationsRequest {
  allocations: Array<{ invoice_id: string; amount: number }>;
}

// --- Bank Slip ---

export interface BankSlip {
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

export interface CreateBankSlipRequest {
  slip_url: string;
  bank_name: string;
  transfer_date: string;
  transfer_amount: number;
  transfer_reference?: string;
}

export interface VerifyBankSlipRequest {
  verified: boolean;
  verification_notes?: string;
}

// --- FlashPay ---

export type FlashPayType = 'qr' | 'app';

export interface FlashPayRequest {
  amount: number;
  allocations: Array<{ invoice_id: string; amount: number }>;
  flashpay_type: FlashPayType;
  flashpay_bank_code?: string;
  description?: string;
  contractor_id?: string;
  subcontractor_id?: string;
  sender_account_id?: string;
}

export interface FlashPayQRResponse {
  id: string;
  qr_image: string;
  qr_raw_data: string;
  trade_no: string;
}

export interface FlashPayAppResponse {
  id: string;
  deeplink_url: string;
  trade_no: string;
}

export type FlashPayResponse = FlashPayQRResponse | FlashPayAppResponse;

// ============================================================================
// Rate Card Types
// ============================================================================

export interface RateCard {
  id: string;
  name: string;
  unit_price: number;
  service_id: string;
  service?: { id: string; name: string };
  route_id?: string;
  contractor_id?: string;
  sender_account_type?: string;
  description?: string;
  created_at: string;
}

export interface CreateRateCardRequest {
  name: string;
  unit_price: number;
  service_id: string;
  route_id?: string;
  contractor_id?: string;
  sender_account_type?: string;
  description?: string;
}

export interface UpdateRateCardRequest {
  name?: string;
  unit_price?: number;
  service_id?: string;
  route_id?: string;
  contractor_id?: string;
  sender_account_type?: string;
  description?: string;
}

export interface ListRateCardsParams {
  service_id?: string;
  contractor_id?: string;
}

// ============================================================================
// Sender Account Types
// ============================================================================

export interface SenderAccount {
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

export interface CreateSenderAccountRequest {
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

export interface UpdateSenderAccountRequest {
  name?: string;
  company_name?: string;
  email?: string;
  phone?: string;
  address_id?: string;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ListSenderAccountsParams {
  search?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

// --- Sender Account Addresses ---

export type AddressType = 'pickup' | 'return' | 'billing' | 'warehouse';

export interface SenderAccountAddress {
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

export interface CreateSenderAccountAddressRequest {
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

export interface UpdateSenderAccountAddressRequest {
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

export interface ListSenderAccountAddressesParams {
  address_type?: AddressType;
  is_active?: boolean;
}

// ============================================================================
// Billing Profile Types
// ============================================================================

export type BillingType = 'consolidated' | 'transactional';
export type BillingCycle = 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type PaymentTerms =
  | 'due_on_receipt'
  | 'net_7'
  | 'net_15'
  | 'net_30'
  | 'net_45'
  | 'net_60'
  | 'net_90'
  | 'custom';

export interface BillingProfile {
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

export interface CreateBillingProfileRequest {
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

export interface UpdateBillingProfileRequest {
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

export interface ListBillingProfilesParams extends PaginationParams {
  contractor_id?: string;
  sender_account_id?: string;
  billing_type?: BillingType;
  billing_cycle?: BillingCycle;
  is_active?: boolean;
}

export type CycleRunStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';

export interface BillingCycleRun {
  id: string;
  billing_profile_id: string;
  status: CycleRunStatus;
  period_start: string;
  period_end: string;
  invoice_id?: string;
  error_message?: string;
  created_at: string;
}

export interface ListCycleRunsParams extends PaginationParams {
  status?: CycleRunStatus;
}

export interface TriggerCycleRequest {
  as_of_date?: string;
}

// ============================================================================
// Delivery Event Types
// ============================================================================

export type DeliveryEventType =
  | 'draft'
  | 'created'
  | 'picked_up'
  | 'accepted'
  | 'delivering'
  | 'delivered'
  | 'failed'
  | 'exception'
  | 'canceled'
  | 'rescheduled'
  | 'returning'
  | 'returned'
  | 'in_transit_sorted'
  | 'in_transit_hub_inbound'
  | 'in_transit_hub_outbound';

export interface DeliveryEvent {
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

export interface CreateDeliveryEventRequest {
  waybill_id?: string;
  package_id?: string;
  event_type: DeliveryEventType;
  event_time?: string;
  coordinates?: Record<string, unknown>;
  notes?: string;
  photos?: string[];
}

// ============================================================================
// Report Types
// ============================================================================

export interface ReportDateRangeParams {
  date_from: string;
  date_to: string;
  format?: 'json' | 'csv';
}

export interface BillingByServiceParams extends ReportDateRangeParams {
  contractor_id?: string;
}

export interface BillingByServiceReport {
  date_from: string;
  date_to: string;
  data: Array<{
    service: string;
    service_id: string;
    quantity: number;
    amount: number;
  }>;
  totals: { quantity: number; amount: number };
}

export interface OutstandingInvoicesParams {
  contractor_id?: string;
  status?: 'issued' | 'overdue' | 'all';
  format?: 'json' | 'csv';
}

export interface OutstandingInvoicesReport {
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

export interface PaymentHistoryParams extends ReportDateRangeParams {
  contractor_id?: string;
  method?: PaymentMethod;
}

export interface PaymentHistoryReport {
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

export type ReportPeriod = 'daily' | 'weekly' | 'monthly';

export interface RevenueSummaryParams extends ReportDateRangeParams {
  contractor_id?: string;
  period?: ReportPeriod;
}

export interface RevenueSummaryReport {
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

// ============================================================================
// SDK Configuration Types
// ============================================================================

export interface TMSClientConfig {
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

export interface TMSError {
  code: number;
  message: string;
  details?: unknown;
}
