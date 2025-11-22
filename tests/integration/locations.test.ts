/**
 * Integration Tests - Locations Service
 * Tests location-related API endpoints with real API
 */

import { PickupMtaaniClient } from '../../src';
import { testConfig, skipIfNoApiKey } from './setup';

const describeIfApiKey = process.env.PICKUP_MTAANI_API_KEY ? describe : describe.skip;

describeIfApiKey('Locations Service Integration Tests', () => {
  let client: PickupMtaaniClient;

  beforeAll(() => {
    skipIfNoApiKey();
    client = new PickupMtaaniClient({
      apiKey: testConfig.apiKey,
      baseUrl: testConfig.baseUrl,
      timeout: testConfig.timeout,
    });
  });

  describe('GET /locations/zones', () => {
    it('should fetch all zones', async () => {
      const zones = await client.locations.getZones();

      expect(zones).toBeDefined();
      expect(Array.isArray(zones)).toBe(true);
      expect(zones.length).toBeGreaterThan(0);

      const zone = zones[0];
      expect(zone).toBeDefined();
      expect(zone).toHaveProperty('id');
      expect(zone).toHaveProperty('name');
      expect(typeof zone!.id).toBe('number');
      expect(typeof zone!.name).toBe('string');
    }, testConfig.timeout);
  });

  describe('GET /locations/areas', () => {
    it('should fetch all areas', async () => {
      const areas = await client.locations.getAreas();

      expect(areas).toBeDefined();
      expect(Array.isArray(areas)).toBe(true);
      expect(areas.length).toBeGreaterThan(0);

      const area = areas[0];
      expect(area).toHaveProperty('id');
      expect(area).toHaveProperty('name');
      // Note: API response doesn't include zone_id in area objects
    }, testConfig.timeout);
  });

  describe('GET /locations', () => {
    it('should fetch locations for a specific area', async () => {
      // First get an area
      const areas = await client.locations.getAreas();
      expect(areas.length).toBeGreaterThan(0);

      const firstArea = areas[0];
      expect(firstArea).toBeDefined();
      const locations = await client.locations.getLocations({
        areaId: firstArea!.id,
      });

      expect(locations).toBeDefined();
      expect(Array.isArray(locations)).toBe(true);

      if (locations.length > 0) {
        const location = locations[0];
        expect(location).toHaveProperty('id');
        expect(location).toHaveProperty('name');
        expect(location).toHaveProperty('zone_id');
        // Note: Location has zone_id, not area_id
      }
    }, testConfig.timeout);
  });

  describe('GET /locations/doorstep-destinations', () => {
    it('should fetch doorstep destinations for an area', async () => {
      // First get an area
      const areas = await client.locations.getAreas();
      expect(areas.length).toBeGreaterThan(0);

      const firstArea = areas[0];
      expect(firstArea).toBeDefined();
      const destinations = await client.locations.getDoorstepDestinations({
        areaId: firstArea!.id,
      });

      expect(destinations).toBeDefined();
      expect(Array.isArray(destinations)).toBe(true);

      if (destinations.length > 0) {
        const destination = destinations[0];
        expect(destination).toHaveProperty('id');
        expect(destination).toHaveProperty('name');
        // Note: API may not return area_id in destination response
      }
    }, testConfig.timeout);
  });

  describe('Location hierarchy', () => {
    it('should verify zones and areas are available', async () => {
      const zones = await client.locations.getZones();
      const areas = await client.locations.getAreas();

      // Verify we have zones and areas
      expect(zones.length).toBeGreaterThan(0);
      expect(areas.length).toBeGreaterThan(0);

      console.log(`Found ${zones.length} zones and ${areas.length} areas`);
    }, testConfig.timeout);
  });
});
