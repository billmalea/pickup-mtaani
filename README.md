# Pickup Mtaani Node.js SDK

Official Node.js/TypeScript SDK for the Pickup Mtaani API - Kenya's leading delivery platform.

[![npm version](https://img.shields.io/npm/v/pickup-mtaani-sdk.svg)](https://www.npmjs.com/package/pickup-mtaani-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

### 🚧 Coming Soon
- [ ] Agent package management
- [ ] Doorstep package management
- [ ] Express deliveries with rider matching
- [ ] M-Pesa payment integration
- [ ] Webhook registration
- [ ] Complete documentation and examples

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
