/**
 * Webhooks Example
 * 
 * This example demonstrates how to register and handle webhooks
 * for real-time notifications about package status changes and payments.
 */

import { PickupMtaaniClient, WebhookEvent } from 'pickup-mtaani-sdk';
import express from 'express';
import bodyParser from 'body-parser';

const client = new PickupMtaaniClient({
  apiKey: process.env.PICKUP_MTAANI_API_KEY || 'your_api_key_here',
});

// =====================================
// Part 1: Register Webhook URL
// =====================================

async function registerWebhook() {
  try {
    console.log('📡 Registering webhook URL...\n');

    // Your webhook endpoint URL (must be publicly accessible)
    const webhookUrl = process.env.WEBHOOK_URL || 'https://yourdomain.com/webhooks/pickup-mtaani';
    
    console.log(`Webhook URL: ${webhookUrl}`);
    console.log('Note: URL must be HTTPS and publicly accessible\n');

    // Register the webhook
    const response = await client.webhooks.register({
      webhook_url: webhookUrl,
    });

    console.log('✅ Webhook registered successfully!');
    console.log('Response:', response.message);
    console.log('\n📝 Webhook will receive notifications for:');
    console.log('- package.created - New package created');
    console.log('- package.updated - Package details updated');
    console.log('- package.state_changed - Status changed (pending → picked_up → in_transit → delivered)');
    console.log('- package.delivered - Package successfully delivered');
    console.log('- package.cancelled - Package cancelled');
    console.log('- payment.completed - M-Pesa payment successful');
    console.log('- payment.failed - M-Pesa payment failed');

  } catch (error) {
    console.error('❌ Error registering webhook:', error);
    
    if (error.name === 'ValidationError') {
      console.error('Invalid webhook URL. Must be a valid HTTPS URL.');
    }
  }
}

// =====================================
// Part 2: Webhook Server (Express)
// =====================================

const app = express();
app.use(bodyParser.json());

/**
 * Webhook endpoint to receive notifications
 * This should match the URL you registered
 */
app.post('/webhooks/pickup-mtaani', async (req, res) => {
  try {
    const webhookEvent: WebhookEvent = req.body;

    console.log('\n📨 Webhook received:');
    console.log(`Event: ${webhookEvent.event}`);
    console.log(`Timestamp: ${webhookEvent.timestamp}`);
    console.log(`Package ID: ${webhookEvent.data.package_id}`);

    // Handle different event types
    switch (webhookEvent.event) {
      case 'package.created':
        await handlePackageCreated(webhookEvent);
        break;

      case 'package.updated':
        await handlePackageUpdated(webhookEvent);
        break;

      case 'package.state_changed':
        await handlePackageStateChanged(webhookEvent);
        break;

      case 'package.delivered':
        await handlePackageDelivered(webhookEvent);
        break;

      case 'package.cancelled':
        await handlePackageCancelled(webhookEvent);
        break;

      default:
        console.log('Unknown event type:', webhookEvent.event);
    }

    // Always respond with 200 OK
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    // Still return 200 to avoid retries
    res.status(200).json({ received: true, error: 'Processing failed' });
  }
});

// =====================================
// Part 3: Event Handlers
// =====================================

async function handlePackageCreated(event: WebhookEvent) {
  console.log('✅ New package created:');
  console.log(`- Tracking Number: ${event.data.tracking_number}`);
  console.log(`- Status: ${event.data.status}`);
  console.log(`- Recipient: ${event.data.recipient_name}`);

  // Your custom logic:
  // - Send confirmation email to customer
  // - Update your internal database
  // - Trigger notification to mobile app
  // - Log to analytics
}

async function handlePackageUpdated(event: WebhookEvent) {
  console.log('✏️ Package updated:');
  console.log(`- Tracking Number: ${event.data.tracking_number}`);
  console.log(`- Changes: Package details modified`);

  // Your custom logic:
  // - Notify customer of changes
  // - Update local database
}

async function handlePackageStateChanged(event: WebhookEvent) {
  console.log('🔄 Package status changed:');
  console.log(`- Tracking Number: ${event.data.tracking_number}`);
  console.log(`- Old Status: ${event.data.old_status}`);
  console.log(`- New Status: ${event.data.status}`);

  // Your custom logic based on status:
  switch (event.data.status) {
    case 'picked_up':
      console.log('📦 Package picked up by rider');
      // Send SMS: "Your package has been picked up"
      break;

    case 'in_transit':
      console.log('🚚 Package in transit');
      // Send push notification with tracking link
      break;

    case 'out_for_delivery':
      console.log('🏠 Package out for delivery');
      // Send SMS: "Your package will arrive soon"
      break;

    case 'delivered':
      console.log('✅ Package delivered');
      // This will also trigger 'package.delivered' event
      break;

    case 'failed':
      console.log('❌ Delivery failed');
      // Alert customer service team
      break;
  }
}

async function handlePackageDelivered(event: WebhookEvent) {
  console.log('🎉 Package successfully delivered:');
  console.log(`- Tracking Number: ${event.data.tracking_number}`);
  console.log(`- Delivered at: ${event.data.delivered_at}`);
  console.log(`- Recipient: ${event.data.recipient_name}`);

  // Your custom logic:
  // - Send delivery confirmation email
  // - Request customer feedback/rating
  // - Update order status to completed
  // - Trigger invoice generation
  // - Award loyalty points
}

async function handlePackageCancelled(event: WebhookEvent) {
  console.log('🚫 Package cancelled:');
  console.log(`- Tracking Number: ${event.data.tracking_number}`);
  console.log(`- Reason: ${event.data.cancellation_reason || 'Not provided'}`);

  // Your custom logic:
  // - Process refund if applicable
  // - Notify customer
  // - Update inventory if product delivery
}

// =====================================
// Part 4: Webhook Security
// =====================================

/**
 * Best practices for webhook security
 */
function validateWebhook(req: express.Request): boolean {
  // 1. Verify webhook signature (if API provides it)
  const signature = req.headers['x-pickup-mtaani-signature'];
  if (signature) {
    // Implement signature verification
    // const isValid = verifySignature(req.body, signature, SECRET_KEY);
    // return isValid;
  }

  // 2. Check webhook IP whitelist
  const clientIp = req.ip;
  // const allowedIPs = ['API_SERVER_IP'];
  // if (!allowedIPs.includes(clientIp)) {
  //   return false;
  // }

  // 3. Validate event structure
  const event = req.body as WebhookEvent;
  if (!event.event || !event.data || !event.timestamp) {
    return false;
  }

  return true;
}

// =====================================
// Part 5: Webhook Testing
// =====================================

/**
 * Test webhook locally using ngrok or similar service
 * 
 * Steps:
 * 1. Install ngrok: npm install -g ngrok
 * 2. Start your server: node webhooks.js
 * 3. Expose local server: ngrok http 3000
 * 4. Copy the HTTPS URL from ngrok
 * 5. Register that URL as your webhook
 * 6. Create a test package to trigger webhooks
 */

async function testWebhook() {
  console.log('\n🧪 Testing webhook setup...\n');

  try {
    // Get business ID
    const business = await client.business.get();
    const businessId = business.id;

    // Create a test package to trigger webhooks
    console.log('Creating test package...');
    const areas = await client.locations.getAreas();
    const locations = await client.locations.getLocations({ areaId: areas[0].id });

    const testPackage = await client.agentPackages.create(businessId, {
      originLocationId: locations[0].id,
      destinationLocationId: locations[1].id,
      recipientName: 'Webhook Test',
      recipientPhone: '0712345678',
      packageDescription: 'Test package for webhooks',
      packageValue: 1000,
    });

    console.log('✅ Test package created!');
    console.log(`Tracking: ${testPackage.tracking_number}`);
    console.log('\nCheck your webhook endpoint for the "package.created" event');

    // Update package to trigger more webhooks
    setTimeout(async () => {
      console.log('\nUpdating package...');
      await client.agentPackages.update(testPackage.id, businessId, {
        packageDescription: 'Updated description',
      });
      console.log('Check for "package.updated" event');
    }, 2000);

  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

// =====================================
// Part 6: Start Server
// =====================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`\n🚀 Webhook server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhooks/pickup-mtaani\n`);

  // Register webhook on startup
  await registerWebhook();

  // Optionally run test
  if (process.env.RUN_WEBHOOK_TEST === 'true') {
    await testWebhook();
  }

  console.log('\n📋 Webhook server ready to receive events!');
  console.log('Waiting for webhook notifications...\n');
});

// =====================================
// Part 7: Error Handling
// =====================================

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

/**
 * Production Deployment Checklist:
 * 
 * ✓ Use HTTPS for webhook endpoint
 * ✓ Implement webhook signature verification
 * ✓ Add IP whitelist for security
 * ✓ Handle webhook retries (idempotency)
 * ✓ Log all webhook events
 * ✓ Monitor webhook health
 * ✓ Set up alerting for failures
 * ✓ Implement circuit breaker for downstream services
 * ✓ Use queue for async processing
 * ✓ Add rate limiting
 */
