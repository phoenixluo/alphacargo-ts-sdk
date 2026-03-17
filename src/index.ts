// Main client
export { TMSClient } from './client';

// Utilities
export { TMSApiError, generateSignature, generateNonce, getTimestamp, canonicalizeJson } from './utils';

// Resources (for advanced usage)
export {
  Waybills,
  Billings,
  Invoices,
  Payments,
  RateCards,
  SenderAccounts,
  BillingProfiles,
  DeliveryEvents,
  Reports,
  Regions,
  WaybillRoutes,
} from './resources';

// Types
export type {
  // Configuration
  TMSClientConfig,
  TMSError,

  // Common
  PaginationParams,
  PaginatedResponse,
  DateRangeParams,

  // Waybills
  Product,
  Parcel,
  CreateWaybillRequest,
  CreateWaybillResponse,
  WaybillPackage,
  WaybillEvents,
  TrackingRoute,
  LabelFormat,
  LabelSize,
  GetLabelParams,
  AddPackageRequest,
  AddPackageResponse,
  AdditionalService,
  CreateAdditionalServicesRequest,
  UpdateAdditionalServiceRequest,
  BatchLabelRequest,
  RecipientAddress,
  RecipientInput,
  ConsolidateWaybillsRequest,
  ConsolidateWaybillsResponse,
  WaybillListParams,
  WaybillSummary,
  WaybillDetails,
  WaybillAddress,
  WaybillRecipient,
  WaybillPackageSummary,
  WaybillDelegation,

  // Billing
  BillingStatus,
  BillingRecord,
  CreateBillingRequest,
  UpdateBillingRequest,
  ListBillingsParams,
  BillingEmailRequest,

  // Invoice
  InvoiceStatus,
  Invoice,
  InvoiceLineItem,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  ListInvoicesParams,
  IssueInvoiceRequest,
  SendInvoiceEmailRequest,
  SendEmailRequest,

  // Payment
  PaymentStatus,
  PaymentMethod,
  Payment,
  PaymentAllocation,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  ListPaymentsParams,
  ReplaceAllocationsRequest,
  BankSlip,
  CreateBankSlipRequest,
  VerifyBankSlipRequest,
  FlashPayType,
  FlashPayRequest,
  FlashPayResponse,
  FlashPayQRResponse,
  FlashPayAppResponse,

  // Rate Card
  RateCard,
  CreateRateCardRequest,
  UpdateRateCardRequest,
  ListRateCardsParams,

  // Sender Account
  SenderAccount,
  CreateSenderAccountRequest,
  UpdateSenderAccountRequest,
  ListSenderAccountsParams,
  SenderAccountRecipient,
  CreateSenderAccountRecipientAddress,
  CreateSenderAccountRecipientRequest,
  UpdateSenderAccountRecipientRequest,
  ListSenderAccountRecipientsParams,
  AddressType,

  // Billing Profile
  BillingType,
  BillingCycle,
  PaymentTerms,
  BillingProfile,
  CreateBillingProfileRequest,
  UpdateBillingProfileRequest,
  ListBillingProfilesParams,
  CycleRunStatus,
  BillingCycleRun,
  ListCycleRunsParams,
  TriggerCycleRequest,

  // Waybill Routes
  WaybillRouteUnitAddress,
  WaybillRouteUnit,
  WaybillRoute,
  WaybillRouteLeg,
  ListWaybillRoutesParams,

  // Regions
  RegionDistrict,
  RegionCity,
  RegionProvince,
  RegionHierarchy,
  ListRegionsParams,

  // Delivery Events
  DeliveryEventType,
  DeliveryEvent,
  CreateDeliveryEventRequest,

  // Reports
  ReportDateRangeParams,
  BillingByServiceParams,
  BillingByServiceReport,
  OutstandingInvoicesParams,
  OutstandingInvoicesReport,
  PaymentHistoryParams,
  PaymentHistoryReport,
  ReportPeriod,
  RevenueSummaryParams,
  RevenueSummaryReport,
} from './types';
