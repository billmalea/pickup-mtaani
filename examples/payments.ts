/**
 * M-Pesa Payment Example
 * 
 * This example demonstrates how to integrate M-Pesa payments
 * for paying package delivery charges.
 */

import { PickupMtaaniClient } from '../src';

const client = new PickupMtaaniClient({
  apiKey: process.env.PICKUP_MTAANI_API_KEY || 'your_api_key_here',
});

async function mpesaPaymentExample() {
  try {
    // Get business ID
    const business = await client.business.get();
    const businessId = business.id;
    console.log(`Business: ${business.name}`);
    console.log(`Current Balance: KES ${business.wallet_balance}\n`);

    // 1. Get unpaid packages
    console.log('💳 Fetching unpaid packages...');
    const unpaidAgentPackages = await client.agentPackages.getUnpaid(businessId);
    const unpaidDoorstepPackages = await client.doorstepPackages.getUnpaid(businessId);
    
    const allUnpaidPackages = [
      ...unpaidAgentPackages.map(p => ({ id: p.id, type: 'agent' as const })),
      ...unpaidDoorstepPackages.map(p => ({ id: p.id, type: 'doorstep' as const })),
    ];

    if (allUnpaidPackages.length === 0) {
      console.log('No unpaid packages found. Creating a test package...');
      
      // Create a test package for demonstration
      const areas = await client.locations.getAreas();
      const locations = await client.locations.getLocations({ areaId: areas[0].id });
      
      const testPackage = await client.agentPackages.create(businessId, {
        originLocationId: locations[0].id,
        destinationLocationId: locations[1].id,
        recipientName: 'Test Recipient',
        recipientPhone: '0712345678',
        packageDescription: 'Test Package for Payment',
        packageValue: 1000,
      });
      
      allUnpaidPackages.push({ id: testPackage.id, type: 'agent' });
      console.log(`Created test package: ${testPackage.tracking_number}`);
    }

    console.log(`Found ${allUnpaidPackages.length} unpaid package(s)`);
    console.log('Package IDs:', allUnpaidPackages.map((p) => `${p.id} (${p.type})`).join(', '));

    // 2. Validate phone number for payment
    console.log('\n📞 Validating M-Pesa phone number...');
    const mpesaPhone = '0712345678'; // Replace with actual phone number
    
    if (!client.validators.isValidKenyanPhoneNumber(mpesaPhone)) {
      throw new Error('Invalid Kenyan phone number');
    }
    
    const formattedPhone = client.validators.formatKenyanPhoneNumber(mpesaPhone);
    console.log(`Payment phone: ${formattedPhone}`);

    // 3. Initiate M-Pesa STK Push
    console.log('\n💰 Initiating M-Pesa payment...');
    console.log('Please check your phone for the M-Pesa prompt...');
    
    const paymentResponse = await client.payments.payWithSTK(businessId, {
      packages: allUnpaidPackages,
      phone: mpesaPhone,
    });

    if (paymentResponse.success) {
      console.log('✅ Payment request sent successfully!');
      console.log('Message:', paymentResponse.message);
    } else {
      console.log('❌ Payment request failed');
      console.log('Message:', paymentResponse.message);
      return;
    }

    // 4. Wait for user to complete payment
    console.log('\n⏳ Waiting for payment completion...');
    console.log('Enter your M-Pesa PIN on your phone to complete the payment.');
    
    // In a real application, you would:
    // - Poll the verification endpoint
    // - Or receive a webhook notification when payment is completed
    // For this example, we'll wait a few seconds
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

    // 5. Verify payment (would typically be done via webhook)
    console.log('\n🔍 Verifying payment status...');
    console.log('Note: In production, use webhooks instead of polling');
    
    // Get M-Pesa transaction code from user (or webhook)
    // For demo purposes, we'll show how to verify
    console.log('\nTo verify payment, you need the M-Pesa transaction code.');
    console.log('You would typically get this from:');
    console.log('1. Webhook notification (recommended)');
    console.log('2. M-Pesa SMS sent to customer');
    console.log('3. M-Pesa statement');

    // Example verification (replace with actual transaction code)
    try {
      const verificationResult = await client.payments.verifyPayment(businessId, {
        packages: allUnpaidPackages,
        transcode: 'QGR12345ABC', // Replace with actual M-Pesa code
      });

      if (verificationResult.success) {
        console.log('\n✅ Payment verified successfully!');
        console.log('Message:', verificationResult.message);
      } else {
        console.log('\n❌ Payment verification failed');
        console.log('Message:', verificationResult.message);
      }
    } catch (error) {
      console.log('\n⚠️ Could not verify payment automatically');
      console.log('Please check your M-Pesa statement or wait for webhook confirmation');
    }

    // 6. Check updated balance
    console.log('\n💰 Checking updated wallet balance...');
    const updatedBusiness = await client.business.get();
    console.log(`Previous balance: KES ${business.wallet_balance}`);
    console.log(`Current balance: KES ${updatedBusiness.wallet_balance}`);
    const difference = updatedBusiness.wallet_balance - business.wallet_balance;
    if (difference > 0) {
      console.log(`✅ Balance increased by: KES ${difference}`);
    }

    // 7. Verify packages are now paid
    console.log('\n📦 Checking package payment status...');
    const stillUnpaid = await client.agentPackages.getUnpaid(businessId);
    if (stillUnpaid.length < unpaidAgentPackages.length) {
      console.log('✅ Some packages have been marked as paid!');
    } else {
      console.log('⏳ Payment processing. Status will update shortly.');
    }

    console.log('\n✅ Payment workflow completed!');
    console.log('\n📝 Best Practices:');
    console.log('1. Always validate phone numbers before initiating payment');
    console.log('2. Use webhooks to receive real-time payment updates');
    console.log('3. Implement retry logic for failed payments');
    console.log('4. Store transaction codes for reconciliation');
    console.log('5. Handle timeout scenarios gracefully');

  } catch (error) {
    console.error('\n❌ Error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        console.error('Validation error:', error.message);
        console.error('Please check phone number format and package details');
      } else if (error.name === 'PaymentError') {
        console.error('Payment error:', error.message);
        console.error('Common causes:');
        console.error('- Insufficient M-Pesa balance');
        console.error('- Wrong PIN entered');
        console.error('- Transaction cancelled by user');
        console.error('- M-Pesa service temporarily unavailable');
      } else if (error.name === 'RateLimitError') {
        console.error('Too many payment requests. Please wait before retrying.');
      }
    }
  }
}

// Run the example
mpesaPaymentExample();

/**
 * Expected M-Pesa Flow:
 * 
 * 1. STK Push Initiated
 *    - User receives pop-up on phone
 *    - Shows amount and merchant details
 * 
 * 2. User Action
 *    - Enters M-Pesa PIN
 *    - Confirms or cancels
 * 
 * 3. M-Pesa Processing
 *    - Validates PIN
 *    - Checks balance
 *    - Processes transaction
 * 
 * 4. Response
 *    - Success: Sends confirmation SMS with code
 *    - Failure: Sends error message
 * 
 * 5. Webhook Notification (if configured)
 *    - Your server receives payment status
 *    - Updates package status automatically
 * 
 * 6. Balance Update
 *    - Wallet balance increases
 *    - Packages marked as paid
 */
