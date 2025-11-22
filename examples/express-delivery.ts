/**
 * Express Delivery Example
 * 
 * This example demonstrates how to create express deliveries with real-time tracking.
 * Express deliveries use GPS coordinates for pickup and delivery locations.
 */

import { PickupMtaaniClient } from '../src';

const client = new PickupMtaaniClient({
  apiKey: process.env.PICKUP_MTAANI_API_KEY || 'your_api_key_here',
});

async function expressDeliveryExample() {
  try {
    // Get business ID
    const business = await client.business.get();
    const businessId = business.id;
    console.log(`Business: ${business.name}`);
    console.log(`Balance: KES ${business.wallet_balance}\n`);

    // 1. Get available delivery modes
    console.log('🚚 Fetching delivery modes...');
    const deliveryModes = await client.expressDeliveries.getDeliveryModes();
    console.log('Available delivery modes:');
    deliveryModes.forEach((mode) => {
      console.log(`- ${mode.name}: ${mode.description}`);
      console.log(`  Base rate: KES ${mode.base_rate}, Per km: KES ${mode.per_km_rate}`);
    });

    const bikeMode = deliveryModes.find(m => m.name.toLowerCase().includes('bike'));
    const selectedMode = bikeMode?.id || deliveryModes[0].id;
    console.log(`\nSelected mode: ${bikeMode?.name || deliveryModes[0].name}`);

    // 2. Define pickup and delivery locations (GPS coordinates)
    const pickupLocation = {
      latitude: -1.286389, // Westlands, Nairobi
      longitude: 36.817223,
      address: 'Sarit Centre, Westlands, Nairobi',
    };

    const deliveryLocation = {
      latitude: -1.292066, // Kilimani, Nairobi
      longitude: 36.821945,
      address: 'Yaya Centre, Kilimani, Nairobi',
    };

    console.log('\n📍 Locations:');
    console.log(`Pickup: ${pickupLocation.address}`);
    console.log(`Delivery: ${deliveryLocation.address}`);

    // 3. Get route directions and cost estimate
    console.log('\n🗺️ Calculating route and cost...');
    const directions = await client.expressDeliveries.getDirections(businessId, {
      pickupLatitude: pickupLocation.latitude,
      pickupLongitude: pickupLocation.longitude,
      deliveryLatitude: deliveryLocation.latitude,
      deliveryLongitude: deliveryLocation.longitude,
      riderTypeId: selectedMode,
    });

    console.log('Route Details:');
    console.log(`Distance: ${directions.distance_km} km`);
    console.log(`Estimated duration: ${directions.duration_minutes} minutes`);
    console.log(`Estimated cost: KES ${directions.delivery_cost}`);

    // 4. Validate recipient phone number
    console.log('\n📞 Validating recipient details...');
    const recipientPhone = '0755667788';
    if (!client.validators.isValidKenyanPhoneNumber(recipientPhone)) {
      throw new Error('Invalid phone number');
    }
    console.log('Phone number is valid');

    // 5. Create express delivery
    console.log('\n📦 Creating express delivery...');
    const newDelivery = await client.expressDeliveries.create(businessId, {
      pickupLatitude: pickupLocation.latitude,
      pickupLongitude: pickupLocation.longitude,
      pickupAddress: pickupLocation.address,
      deliveryLatitude: deliveryLocation.latitude,
      deliveryLongitude: deliveryLocation.longitude,
      deliveryAddress: deliveryLocation.address,
      recipientName: 'Bob Wilson',
      recipientPhone: recipientPhone,
      packageDescription: 'Urgent Documents',
      packageValue: 2000,
      riderTypeId: selectedMode,
      deliveryInstructions: 'Handle with care. Call on arrival.',
      pickupInstructions: 'Reception desk, ask for John',
    });

    console.log('✅ Express delivery created successfully!');
    console.log(`Tracking Number: ${newDelivery.tracking_number}`);
    console.log(`Delivery ID: ${newDelivery.id}`);
    console.log(`Status: ${newDelivery.status}`);
    console.log(`Cost: KES ${newDelivery.delivery_charge}`);

    // 6. Find a rider for the delivery
    console.log('\n🏍️ Finding available rider...');
    try {
      const riderMatch = await client.expressDeliveries.findRider(businessId, {
        packageId: newDelivery.id,
      });
      
      console.log('✅ Rider found!');
      console.log(`Rider: ${riderMatch.rider_name}`);
      console.log(`Phone: ${riderMatch.rider_phone}`);
      console.log(`ETA for pickup: ${riderMatch.estimated_pickup_time}`);
    } catch (error) {
      console.log('No riders currently available. Will be assigned soon.');
    }

    // 7. Track delivery status
    console.log('\n🔍 Tracking delivery...');
    const deliveryDetails = await client.expressDeliveries.get(newDelivery.id, businessId);
    console.log('Delivery Status:', {
      trackingNumber: deliveryDetails.tracking_number,
      status: deliveryDetails.status,
      recipient: deliveryDetails.recipient_name,
      deliveryAddress: deliveryDetails.delivery_address,
      riderName: deliveryDetails.rider_name || 'Not assigned yet',
      riderPhone: deliveryDetails.rider_phone || 'N/A',
    });

    // 8. Update delivery instructions (if still pending)
    if (deliveryDetails.status === 'pending') {
      console.log('\n✏️ Updating delivery instructions...');
      const updated = await client.expressDeliveries.update(newDelivery.id, businessId, {
        deliveryInstructions: 'URGENT: Call 5 minutes before arrival',
      });
      console.log(`Updated instructions: ${updated.delivery_instructions}`);
    }

    // 9. List recent express deliveries
    console.log('\n📋 Listing recent express deliveries...');
    const deliveriesResponse = await client.expressDeliveries.list(businessId, {
      page: 1,
      perPage: 5,
    });
    console.log(`Total deliveries: ${deliveriesResponse.total}`);
    console.log('Recent deliveries:');
    deliveriesResponse.data.forEach((delivery) => {
      console.log(`- ${delivery.tracking_number}: ${delivery.status} (${delivery.recipient_name})`);
    });

    // 10. Check updated balance
    const updatedBusiness = await client.business.get();
    console.log(`\n💰 Remaining balance: KES ${updatedBusiness.wallet_balance}`);

    console.log('\n✅ Express delivery workflow completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        console.error('Validation error:', error.message);
      } else if (error.name === 'InsufficientBalanceError') {
        console.error('Insufficient balance for express delivery');
      } else if (error.name === 'RateLimitError') {
        console.error('Too many requests. Please wait and try again.');
      }
    }
  }
}

// Run the example
expressDeliveryExample();
