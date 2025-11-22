/**
 * Basic Usage Example
 * 
 * This example demonstrates how to initialize the SDK client
 * and perform basic operations.
 */

import { PickupMtaaniClient } from '../src';

// Initialize the client
const client = new PickupMtaaniClient({
  apiKey: process.env.PICKUP_MTAANI_API_KEY || 'your_api_key_here',
  // Optional: custom base URL (defaults to production)
  baseURL: 'https://api.pickupmtaani.com/api/v1',
  // Optional: request timeout in milliseconds
  timeout: 30000,
});

async function basicExample() {
  try {
    // 1. Get business details
    console.log('Fetching business details...');
    const business = await client.business.get();
    console.log('Business:', {
      id: business.id,
      name: business.name,
      email: business.email,
      balance: business.wallet_balance,
    });

    const businessId = business.id;

    // Get available zones
    console.log('\nFetching delivery zones...');
    const zones = await client.locations.getZones();
    console.log(`Found ${zones.length} zones:`, zones.map((z) => z.name));

    // 3. Get areas in a zone
    if (zones.length > 0) {
      console.log('\nFetching areas...');
      const areas = await client.locations.getAreas();
      console.log(`Found ${areas.length} areas:`, areas.slice(0, 5).map((a) => a.name));
    }

    // 4. Get business categories
    console.log('\nFetching business categories...');
    const categories = await client.business.getCategories();
    console.log('Available categories:', categories.map((c) => c.name));

    // 5. List agents (with pagination)
    console.log('\nFetching available agents...');
    const agentsResponse = await client.agents.list({ page: 1, perPage: 5 });
    console.log(`Found ${agentsResponse.total} total agents (showing first 5):`);
    agentsResponse.data.forEach((agent) => {
      console.log(`- ${agent.name} at ${agent.location_name} (Available: ${agent.is_available})`);
    });

    // 6. Update business details
    console.log('\nUpdating business details...');
    const updatedBusiness = await client.business.update({
      name: business.name, // Keep same name or update
      phone: business.phone,
    });
    console.log('Business updated successfully');

    console.log('\n✅ Basic operations completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AuthenticationError') {
        console.error('Authentication failed. Please check your API key.');
      } else if (error.name === 'ValidationError') {
        console.error('Validation failed:', error.message);
      } else if (error.name === 'NotFoundError') {
        console.error('Resource not found:', error.message);
      }
    }
  }
}

// Run the example
basicExample();

// Export for use in other examples
export { client };
