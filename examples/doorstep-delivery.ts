/**
 * Doorstep Delivery Example
 * 
 * This example demonstrates how to create doorstep deliveries.
 * Doorstep packages are delivered from an agent location to a specific address.
 */

import { PickupMtaaniClient } from 'pickup-mtaani-sdk';

const client = new PickupMtaaniClient({
  apiKey: process.env.PICKUP_MTAANI_API_KEY || 'your_api_key_here',
});

async function doorstepDeliveryExample() {
  try {
    // Get business ID
    const business = await client.business.get();
    const businessId = business.id;
    console.log(`Business: ${business.name}`);
    console.log(`Available Balance: KES ${business.wallet_balance}\n`);

    // 1. Get available locations and destinations
    console.log('📍 Fetching locations...');
    const areas = await client.locations.getAreas();
    const firstArea = areas[0];
    
    const locations = await client.locations.getLocations({ areaId: firstArea.id });
    const originLocation = locations[0];
    console.log(`Origin Location: ${originLocation.name}`);

    // Get doorstep destinations
    const destinations = await client.locations.getDoorstepDestinations({ areaId: firstArea.id });
    if (destinations.length === 0) {
      console.log('No doorstep destinations available');
      return;
    }
    
    const destination = destinations[0];
    console.log(`Destination: ${destination.name}`);
    console.log(`Base delivery fee: KES ${destination.delivery_fee}`);

    // 2. Calculate delivery charge
    console.log('\n💰 Calculating delivery charge...');
    const deliveryCharge = await client.deliveryCharge.getDoorstepPackageFee({
      originLocationId: originLocation.id,
      doorstepDestinationId: destination.id,
      packageValue: 3000,
    });
    console.log(`Total delivery charge: KES ${deliveryCharge.delivery_fee}`);
    console.log(`From: ${deliveryCharge.origin_name}`);
    console.log(`To: ${deliveryCharge.destination_name}`);

    // 3. Validate phone number
    console.log('\n📞 Validating recipient phone...');
    const recipientPhone = '0722345678';
    client.validators.validateKenyanPhoneNumber(recipientPhone);
    const formattedPhone = client.validators.formatKenyanPhoneNumber(recipientPhone);
    console.log(`Formatted phone: ${formattedPhone}`);

    // 4. Create doorstep package
    console.log('\n📦 Creating doorstep package...');
    const newPackage = await client.doorstepPackages.create(businessId, {
      originLocationId: originLocation.id,
      doorstepDestinationId: destination.id,
      recipientName: 'Alice Johnson',
      recipientPhone: recipientPhone,
      recipientAlternativePhone: '0733456789',
      deliveryAddress: 'Apartment 5B, Westlands Tower, Waiyaki Way',
      packageDescription: 'Groceries - Fruits and vegetables',
      packageValue: 3000,
      senderName: 'Green Market',
      senderPhone: '0744556677',
      deliveryNotes: 'Call on arrival. Gate code: 1234',
    });

    console.log('✅ Doorstep package created successfully!');
    console.log(`Tracking Number: ${newPackage.tracking_number}`);
    console.log(`Package ID: ${newPackage.id}`);
    console.log(`Status: ${newPackage.status}`);
    console.log(`Delivery Charge: KES ${newPackage.delivery_charge}`);

    // 5. Retrieve and track package
    console.log('\n🔍 Tracking package...');
    const packageDetails = await client.doorstepPackages.get(newPackage.id, businessId);
    console.log('Package Status:', {
      trackingNumber: packageDetails.tracking_number,
      status: packageDetails.status,
      recipient: packageDetails.recipient_name,
      address: packageDetails.delivery_address,
      deliveryCharge: packageDetails.delivery_charge,
    });

    // 6. Update delivery address (if still pending)
    if (packageDetails.status === 'pending') {
      console.log('\n✏️ Updating delivery address...');
      const updatedPackage = await client.doorstepPackages.update(newPackage.id, businessId, {
        deliveryAddress: 'Apartment 7C, Westlands Tower, Waiyaki Way (Updated)',
        deliveryNotes: 'New apartment. Call on arrival. Gate code: 1234',
      });
      console.log(`Updated address: ${updatedPackage.delivery_address}`);
    }

    // 7. List all doorstep packages with filters
    console.log('\n📋 Listing doorstep packages...');
    const packagesResponse = await client.doorstepPackages.list(businessId, {
      status: 'pending',
      page: 1,
      perPage: 10,
    });
    console.log(`Pending packages: ${packagesResponse.total}`);
    console.log(`Showing page ${packagesResponse.current_page} of ${packagesResponse.last_page}`);

    // 8. Get unpaid doorstep packages
    console.log('\n💳 Checking unpaid packages...');
    const unpaidPackages = await client.doorstepPackages.getUnpaid(businessId);
    console.log(`Unpaid doorstep packages: ${unpaidPackages.length}`);

    if (unpaidPackages.length > 0) {
      console.log('Unpaid package IDs:', unpaidPackages.map(p => p.id));
    }

    // 9. Check wallet balance
    const updatedBusiness = await client.business.get();
    console.log(`\n💰 Remaining balance: KES ${updatedBusiness.wallet_balance}`);

    console.log('\n✅ Doorstep delivery workflow completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error.name === 'ValidationError') {
      console.error('Validation error:', error.message);
    } else if (error.name === 'InsufficientBalanceError') {
      console.error('Please top up your wallet to create more packages');
    } else if (error.name === 'NotFoundError') {
      console.error('Resource not found:', error.message);
    }
  }
}

// Run the example
doorstepDeliveryExample();
