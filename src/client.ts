import { HttpClient } from './utils';
import {
  Waybills,
  Billings,
  Invoices,
  Payments,
  RateCards,
  SenderAccounts,
  BillingProfiles,
  DeliveryEvents,
  Reports,
} from './resources';
import type { TMSClientConfig } from './types';

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
export class TMSClient {
  private readonly http: HttpClient;

  /**
   * Waybills resource for managing shipping orders
   */
  public readonly waybills: Waybills;

  /**
   * Billings resource for managing billing records
   */
  public readonly billings: Billings;

  /**
   * Invoices resource for managing invoices
   */
  public readonly invoices: Invoices;

  /**
   * Payments resource for managing payments
   */
  public readonly payments: Payments;

  /**
   * RateCards resource for managing rate cards
   */
  public readonly rateCards: RateCards;

  /**
   * SenderAccounts resource for managing sender accounts
   */
  public readonly senderAccounts: SenderAccounts;

  /**
   * BillingProfiles resource for managing billing profiles and cycles
   */
  public readonly billingProfiles: BillingProfiles;

  /**
   * DeliveryEvents resource for managing delivery events and PODs
   */
  public readonly deliveryEvents: DeliveryEvents;

  /**
   * Reports resource for generating financial reports
   */
  public readonly reports: Reports;

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
  constructor(config: TMSClientConfig) {
    if (!config.baseUrl) {
      throw new Error('baseUrl is required');
    }
    if (!config.apiKey) {
      throw new Error('apiKey is required');
    }
    if (!config.apiSecret) {
      throw new Error('apiSecret is required');
    }

    this.http = new HttpClient(config);

    // Initialize resources
    this.waybills = new Waybills(this.http);
    this.billings = new Billings(this.http);
    this.invoices = new Invoices(this.http);
    this.payments = new Payments(this.http);
    this.rateCards = new RateCards(this.http);
    this.senderAccounts = new SenderAccounts(this.http);
    this.billingProfiles = new BillingProfiles(this.http);
    this.deliveryEvents = new DeliveryEvents(this.http);
    this.reports = new Reports(this.http);
  }
}
