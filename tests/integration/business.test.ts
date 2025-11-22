/**
 * Integration Tests - Business Service
 * Tests business-related API endpoints with real API
 */

import { PickupMtaaniClient } from '../../src';
import { testConfig, skipIfNoApiKey } from './setup';

// Skip tests if no API key provided
const describeIfApiKey = process.env.PICKUP_MTAANI_API_KEY ? describe : describe.skip;

describeIfApiKey('Business Service Integration Tests', () => {
  let client: PickupMtaaniClient;

  beforeAll(() => {
    skipIfNoApiKey();
    client = new PickupMtaaniClient({
      apiKey: testConfig.apiKey,
      baseUrl: testConfig.baseUrl,
      timeout: testConfig.timeout,
    });
  });

  describe('GET /business', () => {
    it(
      'should fetch business details',
      async () => {
        const business = await client.business.get();

        expect(business).toBeDefined();
        expect(business).toHaveProperty('id');
        expect(business).toHaveProperty('name');
        expect(typeof business.id).toBe('number');
        expect(typeof business.name).toBe('string');

        // Check for optional phone_number property
        if ('phone_number' in business) {
          expect(typeof business.phone_number).toBe('string');
        }
      },
      testConfig.timeout
    );
  });

  describe('PUT /business', () => {
    it.skip(
      'should update business details',
      async () => {
        // Skip: API validation prevents updating with same values
        // This would require changing actual business data
        const currentBusiness = await client.business.get();

        const updated = await client.business.update({
          name: currentBusiness.name + ' (Updated)',
        });

        expect(updated).toBeDefined();
        expect(updated.name).toBe(currentBusiness.name);
      },
      testConfig.timeout
    );
  });

  describe('GET /business/categories', () => {
    it(
      'should fetch business categories',
      async () => {
        const categories = await client.business.getCategories();

        expect(categories).toBeDefined();
        expect(categories.data).toBeDefined();
        expect(Array.isArray(categories.data)).toBe(true);

        if (categories.data.length > 0) {
          const category = categories.data[0];
          expect(category).toHaveProperty('id');
          expect(category).toHaveProperty('name');
        }
      },
      testConfig.timeout
    );
  });
});
