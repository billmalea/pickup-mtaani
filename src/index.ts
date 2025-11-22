/**
 * Pickup Mtaani Node.js SDK
 * Official TypeScript/JavaScript SDK for the Pickup Mtaani API
 * 
 * @packageDocumentation
 */

// Main client
export { PickupMtaaniClient } from './client';

// Configuration
export { PickupMtaaniConfig, DEFAULT_CONFIG } from './config';

// All types
export * from './types';

// Validators
export {
  validateKenyanPhoneNumber,
  isValidKenyanPhoneNumber,
  formatKenyanPhoneNumber,
} from './validators/phone-validator';

export {
  validatePackageValue,
  isValidPackageValue,
  validateDeliveryBalance,
} from './validators/package-validator';

// Services (for advanced use cases)
export { BusinessService } from './services/business.service';
export { LocationsService } from './services/locations.service';
export { AgentsService } from './services/agents.service';
export { DeliveryChargeService } from './services/delivery-charge.service';
export { AgentPackagesService } from './services/agent-packages.service';
export { DoorstepPackagesService } from './services/doorstep-packages.service';
export { ExpressDeliveriesService } from './services/express-deliveries.service';
export { PaymentsService } from './services/payments.service';
export { WebhooksService } from './services/webhooks.service';
