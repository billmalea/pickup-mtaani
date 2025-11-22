# Testing Guide

This document provides guidance on testing the Pickup Mtaani SDK.

## Current Test Coverage

### Unit Tests

Currently, the SDK includes unit tests for:
- ✅ Phone Validator (`tests/unit/validators/phone-validator.test.ts`)

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Integration Testing

Due to the SDK's architecture requiring a `businessId` parameter for most operations (which is obtained from the Business service after authentication), full service testing requires integration with the actual Pickup Mtaani API.

### Setting Up Integration Tests

To test the SDK with a real API:

1. **Get API Credentials**
   - Register for a Pickup Mtaani account
   - Obtain your API key from the dashboard

2. **Create Test Environment File**
   ```bash
   # Create .env.test
   echo "PICKUP_MTAANI_API_KEY=your_api_key_here" > .env.test
   echo "PICKUP_MTAANI_BASE_URL=https://api.pickupmtaani.com/api/v1" >> .env.test
   ```

3. **Create Integration Test**
   ```typescript
   // tests/integration/client.integration.test.ts
   import { PickupMtaaniClient } from '../../src';
   import dotenv from 'dotenv';

   dotenv.config({ path: '.env.test' });

   describe('PickupMtaaniClient Integration Tests', () => {
     let client: PickupMtaaniClient;
     let businessId: number;

     beforeAll(async () => {
       client = new PickupMtaaniClient({
         apiKey: process.env.PICKUP_MTAANI_API_KEY!,
         baseURL: process.env.PICKUP_MTAANI_BASE_URL,
       });

       // Get business ID
       const business = await client.business.get();
       businessId = business.id;
     });

     it('should fetch business details', async () => {
       const business = await client.business.get();
       expect(business).toHaveProperty('id');
       expect(business).toHaveProperty('name');
       expect(business).toHaveProperty('email');
     });

     it('should list zones', async () => {
       const zones = await client.locations.getZones();
       expect(Array.isArray(zones)).toBe(true);
       expect(zones.length).toBeGreaterThan(0);
     });

     it('should create and retrieve an agent package', async () => {
       // Get locations first
       const zones = await client.locations.getZones();
       const areas = await client.locations.getAreas();
       const locations = await client.locations.getLocations({ areaId: areas[0].id });

       // Create package
       const newPackage = await client.agentPackages.create(businessId, {
         originLocationId: locations[0].id,
         destinationLocationId: locations[1].id,
         recipientName: 'Test Recipient',
         recipientPhone: '0712345678',
         packageDescription: 'Test package',
         packageValue: 1000,
       });

       expect(newPackage).toHaveProperty('id');
       expect(newPackage).toHaveProperty('tracking_number');

       // Retrieve the package
       const retrievedPackage = await client.agentPackages.get(newPackage.id, businessId);
       expect(retrievedPackage.id).toBe(newPackage.id);
     });

     it('should handle validation errors', () => {
       expect(() => {
         client.validators.validateKenyanPhoneNumber('invalid');
       }).toThrow();
     });
   });
   ```

4. **Add Test Scripts**
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:unit": "jest tests/unit",
       "test:integration": "jest tests/integration",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage"
     }
   }
   ```

### Manual Testing

For manual testing without automated tests:

```typescript
import { PickupMtaaniClient } from 'pickup-mtaani-sdk';

const client = new PickupMtaaniClient({
  apiKey: 'your_api_key_here',
});

// Test business endpoint
async function testBusiness() {
  try {
    const business = await client.business.get();
    console.log('Business:', business);
    return business.id;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test locations
async function testLocations() {
  try {
    const zones = await client.locations.getZones();
    console.log('Zones:', zones);

    const areas = await client.locations.getAreas();
    console.log('Areas:', areas);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test agent packages
async function testAgentPackages(businessId: number) {
  try {
    const packages = await client.agentPackages.list(businessId);
    console.log('Packages:', packages);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run tests
(async () => {
  const businessId = await testBusiness();
  if (businessId) {
    await testLocations();
    await testAgentPackages(businessId);
  }
})();
```

## Test Best Practices

1. **Environment Variables**
   - Never commit API keys to version control
   - Use `.env.test` for test credentials
   - Add `.env*` to `.gitignore`

2. **Test Data Cleanup**
   - Clean up test packages after integration tests
   - Use the `delete` methods to remove created entities

3. **Error Testing**
   - Test both success and error scenarios
   - Verify custom error types are thrown correctly
   - Test validation before API calls

4. **Mocking**
   - For unit tests, mock the HTTP client
   - Use `jest.mock()` for external dependencies
   - Test service logic independently of API calls

## Known Testing Limitations

1. **Business ID Requirement**: Most endpoints require a `businessId` that can only be obtained from the Business service after authentication. This makes isolated unit testing challenging.

2. **API-Dependent Operations**: Operations like creating packages, processing payments, and webhook registration require actual API interaction and cannot be fully tested with mocks.

3. **M-Pesa Integration**: Payment testing requires access to M-Pesa sandbox environment and valid test credentials.

## Future Improvements

- [ ] Add comprehensive integration test suite
- [ ] Set up CI/CD with test API credentials (using GitHub Secrets)
- [ ] Add E2E tests for complete workflows
- [ ] Mock HTTP client for true unit tests
- [ ] Add performance benchmarking tests
- [ ] Set up test coverage reporting
- [ ] Add snapshot testing for API responses

## Contributing

When contributing new features:
1. Add unit tests for validators and utility functions
2. Add integration tests for new service methods
3. Update this guide with new test patterns
4. Ensure tests pass before submitting PR

```

