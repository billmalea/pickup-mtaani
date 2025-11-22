/**
 * Integration Tests - Agent Packages
 * Tests complete package lifecycle with real API
 */

import { PickupMtaaniClient } from '../../src';
import { testConfig, skipIfNoApiKey } from './setup';

const describeIfApiKey = process.env.PICKUP_MTAANI_API_KEY ? describe : describe.skip;

describeIfApiKey('Agent Packages Integration Tests', () => {
  let client: PickupMtaaniClient;
  let businessId: number;
  let createdPackageId: number | null = null;

  beforeAll(async () => {
    skipIfNoApiKey();
    client = new PickupMtaaniClient({
      apiKey: testConfig.apiKey,
      baseUrl: testConfig.baseUrl,
      timeout: testConfig.timeout,
    });

    // Get business ID for package operations
    const business = await client.business.get();
    businessId = business.id;
  });

  afterAll(async () => {
    // Cleanup: delete test package if created
    if (createdPackageId) {
      try {
        await client.agentPackages.delete(createdPackageId);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  describe('Package Lifecycle', () => {
    it('should create an agent package', async () => {
      // Get zones and agents for package creation
      const zones = await client.locations.getZones();
      expect(zones.length).toBeGreaterThanOrEqual(1);

      const agents = await client.agents.list();
      expect(agents.length).toBeGreaterThanOrEqual(2);

      // Create package
      const newPackage = await client.agentPackages.create(businessId, {
        senderAgentId: agents[0].id,
        receiverAgentId: agents[1].id,
        customerName: 'Integration Test Customer',
        customerPhoneNumber: testConfig.testPhone,
        packageName: 'Test package for integration tests',
        packageValue: 1000,
        paymentOption: 'vendor',
        on_delivery_balance: 500,
      });

      expect(newPackage).toBeDefined();
      expect(newPackage).toHaveProperty('id');
      expect(typeof newPackage.id).toBe('number');

      // Store for cleanup
      createdPackageId = newPackage.id;
    }, testConfig.timeout);

    it('should retrieve the created package', async () => {
      expect(createdPackageId).not.toBeNull();

      const package_ = await client.agentPackages.get(createdPackageId!, businessId);

      expect(package_).toBeDefined();
      expect(package_.id).toBe(createdPackageId);
    }, testConfig.timeout);

    it('should list agent packages', async () => {
      const response = await client.agentPackages.list(businessId);

      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    }, testConfig.timeout);

    it('should update package details', async () => {
      expect(createdPackageId).not.toBeNull();

      const updated = await client.agentPackages.update(createdPackageId!, {
        packageName: 'Updated test package description',
        packageValue: 1500,
      });

      expect(updated).toBeDefined();
      expect(updated.id).toBe(createdPackageId);
    }, testConfig.timeout);
  });

  describe('GET /packages/agent/unpaid', () => {
    it('should fetch unpaid packages', async () => {
      const unpaidPackages = await client.agentPackages.getUnpaid(businessId);

      expect(unpaidPackages).toBeDefined();
      expect(Array.isArray(unpaidPackages)).toBe(true);
    }, testConfig.timeout);
  });
});
