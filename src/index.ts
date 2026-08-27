// Main client
export { TMSClient } from './client';

// Utilities
export { TMSApiError, generateSignature, generateNonce, getTimestamp, canonicalizeJson, verifyWebhookSignature } from './utils';

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
  Organizations,
  OrganizationUnits,
  ProductCategories,
  Wallets,
  Quotes,
  Address,
  ShippingFee,
} from './resources';

// Types
export type {
  // Configuration
  TMSClientConfig,
  TMSLanguage,
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
  AllocateWaybillNumberResponse,
  SplitPart,
  SplitPackageRequest,
  SplitPackageResponse,
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
  WaybillServiceCountParams,
  WaybillServiceCount,
  WaybillDetails,
  WaybillAddress,
  WaybillRecipient,
  WaybillPackageSummary,
  WaybillDelegation,

  // Billing
  BillingStatus,
  BillingRecord,
  WaybillBillingRecord,
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

  // Wallet
  WalletTransactionType,
  WalletBalance,
  WalletTransaction,
  TopUpWalletRequest,
  WalletTopUpResponse,
  WalletTopUpQRResponse,
  WalletTopUpAppResponse,
  PayInvoiceWithWalletRequest,
  PayInvoiceWithWalletResponse,
  ListWalletTransactionsParams,
  WalletTransactionsResponse,

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
  SenderAccountOwnershipRequest,
  SenderAccountOwnershipResponse,

  // Package Label OCR
  PackageLabelOcrParams,
  PackageLabelOcrResult,
  PackageLabelOcrResponse,

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
  WaybillRouteWithLegs,
  WaybillRouteLeg,
  ListWaybillRoutesParams,

  // Regions
  RegionDistrict,
  RegionCity,
  RegionProvince,
  RegionHierarchy,
  ListRegionsParams,

  // Address Resolution
  GeocodeSource,
  AddressResolveOptions,
  AddressResolveByText,
  AddressResolveByUrl,
  AddressResolveByCoords,
  AddressResolveRequest,
  ResolvedAddress,

  // Organization
  Organization,
  UpdateOrganizationRequest,

  // Organization Unit
  OrganizationUnitType,
  OrganizationUnit,
  OrganizationUnitAddress,
  CreateOrganizationUnitRequest,
  UpdateOrganizationUnitRequest,
  ListOrganizationUnitsParams,

  // Product Category
  ProductCategory,
  ProductCategoryTreeNode,
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
  ListProductCategoriesParams,

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

  // Quotes
  QuoteAddress,
  QuoteItem,
  QuoteAggregates,
  QuoteServiceType,
  QuoteBreakdownLine,
  CreateQuoteRequest,
  CreateQuoteResponse,

  // Shipping Fee
  ShippingFeeDimensions,
  ShippingFeeBreakdownLine,
  CreateShippingFeeRequest,
  ShippingFeeResponse,
} from './types';
