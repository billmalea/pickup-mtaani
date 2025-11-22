/**
 * Agent Package Example
 * 
 * This example demonstrates how to create and manage agent packages.
 * Agent packages are delivered between two agent locations.
 */

import { PickupMtaaniClient } from '../src';

const client = new PickupMtaaniClient({
  apiKey: process.env.PICKUP_MTAANI_API_KEY || 'your_api_key_here',
});

async function agentPackageExample() {
  try {
    // Get business ID
    const business = await client.business.get();
    const businessId = business.id;
    console.log(`Business: ${business.name} (Balance: KES ${business.wallet_balance})`);

    // 1. Get available locations
    console.log('\n📍 Fetching locations...');
    const areas = await client.locations.getAreas();
    const firstArea = areas[0];
    const locations = await client.locations.getLocations({ areaId: firstArea.id });
    
    if (locations.length < 2) {
      console.log('Not enough locations available for demo');
      return;
    }

    const originLocation = locations[0];
    const destinationLocation = locations[1];
    console.log(`Origin: ${originLocation.name}`);
    console.log(`Destination: ${destinationLocation.name}`);

    // 2. Calculate delivery charge
    console.log('\n💰 Calculating delivery charge...');
    const deliveryCharge = await client.deliveryCharge.getAgentPackageFee({
      originLocationId: originLocation.id,
      destinationLocationId: destinationLocation.id,
      packageValue: 5000,
    });
    console.log(`Delivery charge: KES ${deliveryCharge.delivery_fee}`);
    console.log(`From: ${deliveryCharge.origin_name}`);
    console.log(`To: ${deliveryCharge.destination_name}`);

    // 3. Validate package value
    console.log('\n✅ Validating package...');
    client.validators.validatePackageValue(5000, 1000000);
    console.log('Package value is valid');

    // 4. Create agent package
    console.log('\n📦 Creating agent package...');
    const newPackage = await client.agentPackages.create(businessId, {
      originLocationId: originLocation.id,
      destinationLocationId: destinationLocation.id,
      recipientName: 'John Doe',
      recipientPhone: '0712345678',
      packageDescription: 'Electronics - Laptop',
      packageValue: 5000,
      senderName: 'Jane Smith',
      senderPhone: '0722334455',
    });

    console.log('✅ Package created successfully!');
    console.log(`Tracking Number: ${newPackage.tracking_number}`);
    console.log(`Package ID: ${newPackage.id}`);
    console.log(`Status: ${newPackage.status}`);
    console.log(`Delivery Charge: KES ${newPackage.delivery_charge}`);

    // 5. Retrieve package details
    console.log('\n🔍 Retrieving package details...');
    const packageDetails = await client.agentPackages.get(newPackage.id, businessId);
    console.log('Package Details:', {
      trackingNumber: packageDetails.tracking_number,
      status: packageDetails.status,
      recipient: packageDetails.recipient_name,
      deliveryCharge: packageDetails.delivery_charge,
    });

    // 6. Update package
    console.log('\n✏️ Updating package...');
    const updatedPackage = await client.agentPackages.update(newPackage.id, businessId, {
      packageDescription: 'Electronics - Laptop (Fragile)',
    });
    console.log(`Updated description: ${updatedPackage.package_description}`);

    // 7. List all packages
    console.log('\n📋 Listing all packages...');
    const packagesResponse = await client.agentPackages.list(businessId, {
      page: 1,
      perPage: 10,
    });
    console.log(`Total packages: ${packagesResponse.total}`);
    console.log(`Current page: ${packagesResponse.current_page} of ${packagesResponse.last_page}`);

    // 8. Get unpaid packages
    console.log('\n💳 Fetching unpaid packages...');
    const unpaidPackages = await client.agentPackages.getUnpaid(businessId);
    console.log(`Unpaid packages: ${unpaidPackages.length}`);
    
    if (unpaidPackages.length > 0) {
      const totalOwed = unpaidPackages.reduce((sum, pkg) => sum + pkg.id, 0);
      console.log(`Total payment needed for package IDs: ${totalOwed}`);
    }

    // 9. Optional: Delete package (if in pending status)
    if (newPackage.status === 'pending') {
      console.log('\n🗑️ Deleting package...');
      await client.agentPackages.delete(newPackage.id, businessId);
      console.log('Package deleted successfully');
    }

    console.log('\n✅ Agent package workflow completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        console.error('Validation error:', error.message);
      } else if (error.name === 'InsufficientBalanceError') {
        console.error('Insufficient balance to create package');
      }
    }
  }
}

// Run the example
agentPackageExample();
