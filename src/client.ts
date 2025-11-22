import { HttpClient } from './http/http-client';
import { PickupMtaaniConfig } from './config';
import { BusinessService } from './services/business.service';
import { LocationsService } from './services/locations.service';
import { AgentsService } from './services/agents.service';
import { DeliveryChargeService } from './services/delivery-charge.service';
import { AgentPackagesService } from './services/agent-packages.service';
import { DoorstepPackagesService } from './services/doorstep-packages.service';
import { ExpressDeliveriesService } from './services/express-deliveries.service';
import { PaymentsService } from './services/payments.service';
import { WebhooksService } from './services/webhooks.service';

/**
 * Main client for interacting with the Pickup Mtaani API
 *
 * @example
 * ```typescript
 * import { PickupMtaaniClient } from 'pickup-mtaani-sdk';
 *
 * const client = new PickupMtaaniClient({
 *   apiKey: 'your-api-key-here',
 *   timeout: 30000,
 *   debug: false
 * });
 *
 * // Use the client
 * const business = await client.business.get();
 * const zones = await client.locations.getZones();
 * ```
 */
export class PickupMtaaniClient {
  private httpClient: HttpClient;

  /**
   * Business management service
   */
  public readonly business: BusinessService;

  /**
   * Location services (zones, areas, locations, destinations)
   */
  public readonly locations: LocationsService;

  /**
   * Agent discovery service
   */
  public readonly agents: AgentsService;

  /**
   * Delivery charge calculation service
   */
  public readonly deliveryCharge: DeliveryChargeService;

  /**
   * Agent-to-agent package management service
   */
  public readonly agentPackages: AgentPackagesService;

  /**
   * Doorstep delivery package management service
   */
  public readonly doorstepPackages: DoorstepPackagesService;

  /**
   * Express delivery service with rider matching
   */
  public readonly expressDeliveries: ExpressDeliveriesService;

  /**
   * M-Pesa payment service
   */
  public readonly payments: PaymentsService;

  /**
   * Webhook registration service
   */
  public readonly webhooks: WebhooksService;

  /**
   * Create a new Pickup Mtaani client instance
   * @param config - Client configuration including API key
   * @throws {Error} If API key is not provided
   */
  constructor(config: PickupMtaaniConfig) {
    this.httpClient = new HttpClient(config);

    // Initialize all services
    this.business = new BusinessService(this.httpClient);
    this.locations = new LocationsService(this.httpClient);
    this.agents = new AgentsService(this.httpClient);
    this.deliveryCharge = new DeliveryChargeService(this.httpClient);
    this.agentPackages = new AgentPackagesService(this.httpClient);
    this.doorstepPackages = new DoorstepPackagesService(this.httpClient);
    this.expressDeliveries = new ExpressDeliveriesService(this.httpClient);
    this.payments = new PaymentsService(this.httpClient);
    this.webhooks = new WebhooksService(this.httpClient);
  }
}
