# Pickup Mtaani Node.js SDK

Official Node.js/TypeScript SDK for the Pickup Mtaani API - Kenya's leading delivery platform.

[![npm version](https://img.shields.io/npm/v/pickup-mtaani-sdk.svg)](https://www.npmjs.com/package/pickup-mtaani-sdk)
[![CI](https://github.com/billmalea/pickup-mtaani/actions/workflows/ci.yml/badge.svg)](https://github.com/billmalea/pickup-mtaani/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)

## Features

✅ Full TypeScript support with complete type definitions  
✅ Promise-based API with async/await  
✅ Comprehensive error handling  
✅ Built-in request validation  
✅ Automatic retries and timeouts  
✅ M-Pesa payment integration  
✅ Real-time webhook support  
✅ Complete test coverage  
✅ Detailed documentation and examples  

## Installation

```bash
npm install pickup-mtaani-sdk
# or
yarn add pickup-mtaani-sdk
# or
pnpm add pickup-mtaani-sdk
```

## Quick Start

```typescript
import { PickupMtaaniClient } from 'pickup-mtaani-sdk';

const client = new PickupMtaaniClient({
  apiKey: 'your-api-key-here'
});

// Get your business details
const business = await client.business.get();
console.log('Business:', business.name);
```

## Authentication

Get your API key from [Pickup Mtaani API Portal](https://new.pickupmtaani.com/api)

```typescript
const client = new PickupMtaaniClient({
  apiKey: 'your-api-key',
  timeout: 30000,  // Optional: request timeout in ms (default: 30000)
  debug: false     // Optional: enable debug logging (default: false)
});
```

## Core Services

### Business Management

```typescript
// Get business information
const business = await client.business.get();

// Update business
await client.business.update({
  name: 'New Business Name',
  phone_number: '0712345678',
  category_id: 5
});

// Get categories with pagination
const categories = await client.business.getCategories({
  pageNumber: 0,
  pageSize: 20
});

// Delete business
await client.business.delete();
```

### Locations

```typescript
// Get all zones
const zones = await client.locations.getZones();

// Get all areas
const areas = await client.locations.getAreas();

// Search for locations
const locations = await client.locations.getLocations({
  searchKey: 'westlands',
  zoneId: 1,
  areaId: 2
});

// Get doorstep destinations
const destinations = await client.locations.getDoorstepDestinations({
  areaId: 2,
  searchKey: 'cbd'
});
```

### Agents

```typescript
// Get all agents
const agents = await client.agents.list();

// Filter agents by location
const localAgents = await client.agents.list({
  locationId: 245
});

// Search agents by business name
const results = await client.agents.list({
  searchKey: 'kikuyu'
});
```

### Delivery Charges

```typescript
// Calculate agent-to-agent delivery fee
const agentFee = await client.deliveryCharge.getAgentPackageFee({
  senderAgentID: 362,
  receiverAgentID: 454
});
console.log('Agent delivery fee:', agentFee.price);

// Calculate doorstep delivery fee
const doorstepFee = await client.deliveryCharge.getDoorstepPackageFee({
  senderAgentID: 517,
  doorstepDestinationID: 541
});
console.log('Doorstep delivery fee:', doorstepFee.price);
```

## Error Handling

The SDK provides comprehensive error types for different scenarios:

```typescript
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  InternalServerError
} from 'pickup-mtaani-sdk';

try {
  const business = await client.business.get();
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.validationErrors);
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found:', error.message);
  } else if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof InternalServerError) {
    console.error('Server error:', error.message);
  }
}
```

## TypeScript Support

The SDK is fully typed for excellent IDE support:

```typescript
import { Business, Zone, Agent } from 'pickup-mtaani-sdk';

const business: Business = await client.business.get();
const zones: Zone[] = await client.locations.getZones();
const agents: Agent[] = await client.agents.list();
```

## Development Status

### ✅ Implemented
- [x] Business management
- [x] Location services
- [x] Agent discovery
- [x] Delivery charge calculation
- [x] Core types and error handling
- [x] HTTP client with interceptors

### ✅ Complete Implementation
- [x] Agent package management (CRUD operations)
- [x] Doorstep package management (CRUD operations)
- [x] Express deliveries with rider matching
- [x] M-Pesa payment integration
- [x] Webhook registration
- [x] Input validation (phone numbers, package values)
- [x] Complete TypeScript definitions

## Package Management

### Agent Packages

```typescript
// Create agent-to-agent package
const package = await client.agentPackages.create(businessId, {
  senderAgentId: 362,
  receiverAgentId: 454,
  customerName: 'John Doe',
  customerPhoneNumber: '0712345678',
  packageName: 'Electronics',
  packageValue: 5000,
  paymentOption: 'vendor',
  on_delivery_balance: 500
});

// Get package details
const details = await client.agentPackages.get(package.id, businessId);

// Update package
await client.agentPackages.update(package.id, {
  customerName: 'Jane Smith',
  packageValue: 6000
});

// List packages with filters
const packages = await client.agentPackages.list(businessId, {
  state: 'in_transit',
  pageNumber: 0,
  pageSize: 10
});

// Delete package
await client.agentPackages.delete(package.id);

// Get unpaid packages
const unpaid = await client.agentPackages.getUnpaid(businessId);
```

### Doorstep Packages

```typescript
// Create doorstep delivery
const package = await client.doorstepPackages.create(businessId, {
  senderAgentID_id: 517,
  customerName: 'Jane Doe',
  customerPhoneNumber: '0723456789',
  packageName: 'Groceries',
  packageValue: 3000,
  paymentOption: 'vendor',
  doorstepDestinationId: 541,
  locationDescription: 'Near the supermarket',
  lat: -1.2921,
  lng: 36.8219
});

// Get, update, list, delete operations similar to agent packages
const details = await client.doorstepPackages.get(package.id, businessId);
await client.doorstepPackages.update(package.id, { packageValue: 3500 });
const packages = await client.doorstepPackages.list(businessId);
await client.doorstepPackages.delete(package.id);
```

### Express Deliveries

```typescript
// Get directions and pricing
const directions = await client.expressDeliveries.getDirections(businessId, {
  coordinates: [
    [36.81443, -1.27365],  // departure [lng, lat]
    [36.84224, -1.29124]   // destination [lng, lat]
  ],
  rider_type_id: 2
});
console.log(directions.price); // 560

// Create express delivery
const express = await client.expressDeliveries.create(businessId, {
  customer_name: 'Alice Johnson',
  customer_phone_number: '0745678901',
  package_value: 2000,
  package_name: 'Electronics',
  departure: [36.8219, -1.2921],
  destination: [36.8422, -1.2912],
  exact_location: 'Burma Market',
  payment_option: 'vendor',
  from: 'Westlands',
  to: 'CBD'
});

// Find nearby rider
const riders = await client.expressDeliveries.findRider(express.id);
console.log(riders[0].name); // "Brian Rider"

// Get delivery modes
const modes = await client.expressDeliveries.getDeliveryModes();
// [{ id: 1, name: "Motorbike", description: "..." }]
```

## Payments with M-Pesa

```typescript
// Get unpaid packages
const unpaidPackages = await client.agentPackages.getUnpaid(businessId);

// Initiate STK Push payment
const paymentResult = await client.payments.payWithSTK(businessId, {
  packages: unpaidPackages.map(pkg => ({
    id: pkg.id,
    type: pkg.type
  })),
  phone: '0712345678'
});
console.log(paymentResult.message); // "Payment initiated"

// Verify payment
const verification = await client.payments.verifyPayment(businessId, {
  packages: unpaidPackages.map(pkg => ({
    id: pkg.id,
    type: pkg.type
  })),
  transcode: 'SH123XYZ789'  // M-Pesa transaction code
});
console.log(verification.message); // "Payment verified"
```

## Webhooks

```typescript
// Register webhook URL
await client.webhooks.register({
  webhook_url: 'https://yourdomain.com/webhooks/pickup-mtaani'
});

// Handle webhook events in your server
import { WebhookEvent } from 'pickup-mtaani-sdk';

app.post('/webhooks/pickup-mtaani', (req, res) => {
  const event: WebhookEvent = req.body;
  
  switch(event.event_type) {
    case 'package.created':
      console.log('New package:', event.data.receipt_no);
      break;
    case 'package.state_changed':
      console.log('Package state:', event.data.state);
      break;
    case 'package.delivered':
      console.log('Package delivered:', event.data.track_id);
      break;
  }
  
  res.status(200).send('OK');
});
```

## Validation

The SDK includes built-in validators:

```typescript
import {
  validateKenyanPhoneNumber,
  validatePackageValue,
  formatKenyanPhoneNumber
} from 'pickup-mtaani-sdk';

// Validate phone number
try {
  validateKenyanPhoneNumber('0712345678'); // Valid
  validateKenyanPhoneNumber('0612345678'); // Throws ValidationError
} catch (error) {
  console.error(error.message);
}

// Format phone number
const formatted = formatKenyanPhoneNumber('0712345678');
console.log(formatted); // "+254712345678"

// Validate package value
validatePackageValue(5000); // Valid
validatePackageValue(2000000); // Throws ValidationError
```

## Testing

This SDK includes comprehensive test coverage with both unit and integration tests.

### Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests (requires API credentials)
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Integration Tests Setup

Integration tests require actual API credentials. To run them:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your credentials to `.env.local`:
   ```env
   PICKUP_MTAANI_API_KEY=your_actual_api_key
   PICKUP_MTAANI_BUSINESS_ID=your_business_id
   TEST_PHONE=0712345678
   ```

3. Run integration tests:
   ```bash
   npm run test:integration
   ```

**Note:** `.env.local` is gitignored and will never be committed to version control. Integration tests will automatically skip if credentials are not configured.

For detailed testing documentation, see [TESTING.md](./TESTING.md) and [tests/integration/README.md](./tests/integration/README.md).

## API Reference

See [API Documentation](https://api.pickupmtaani.com/api/v1/docs/) for complete API reference.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

- Documentation: [API Docs](https://api.pickupmtaani.com/api/v1/docs/)
- Issues: [GitHub Issues](https://github.com/billmalea/pickup-mtaani/issues)
- Website: [pickupmtaani.com](https://pickupmtaani.com)
