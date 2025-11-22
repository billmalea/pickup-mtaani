# Pickup Mtaani SDK Examples

This directory contains comprehensive examples demonstrating how to use the Pickup Mtaani SDK.

## Available Examples

### 1. Basic Usage (`basic-usage.ts`)
Getting started with the SDK - initialization, business details, locations, and categories.

**What you'll learn:**
- Initialize the SDK client
- Fetch business details
- List zones, areas, and locations
- Get business categories
- List available agents
- Update business information
- Handle errors

**Run:**
```bash
npx ts-node examples/basic-usage.ts
```

### 2. Agent Packages (`agent-packages.ts`)
Create and manage packages delivered between agent locations.

**What you'll learn:**
- Calculate delivery charges
- Validate package values
- Create agent packages
- Track package status
- Update package details
- List packages with pagination
- Get unpaid packages
- Delete packages

**Run:**
```bash
npx ts-node examples/agent-packages.ts
```

### 3. Doorstep Delivery (`doorstep-delivery.ts`)
Create doorstep deliveries to specific addresses.

**What you'll learn:**
- Get doorstep destinations
- Calculate doorstep delivery fees
- Validate phone numbers
- Create doorstep packages
- Track deliveries
- Update delivery addresses
- Filter packages by status

**Run:**
```bash
npx ts-node examples/doorstep-delivery.ts
```

### 4. Express Delivery (`express-delivery.ts`)
Create real-time express deliveries using GPS coordinates.

**What you'll learn:**
- Get available delivery modes
- Calculate routes and costs
- Create express deliveries with GPS
- Find available riders
- Track real-time delivery status
- Update delivery instructions
- Handle GPS-based deliveries

**Run:**
```bash
npx ts-node examples/express-delivery.ts
```

### 5. M-Pesa Payments (`payments.ts`)
Integrate M-Pesa payments for package charges.

**What you'll learn:**
- Initiate M-Pesa STK Push
- Validate payment phone numbers
- Verify payment status
- Handle payment webhooks
- Check wallet balance
- Process payment failures

**Run:**
```bash
npx ts-node examples/payments.ts
```

### 6. Webhooks (`webhooks.ts`)
Set up and handle real-time webhook notifications.

**What you'll learn:**
- Register webhook URLs
- Create webhook server with Express
- Handle different event types
- Process package status changes
- Implement webhook security
- Test webhooks locally

**Run:**
```bash
npx ts-node examples/webhooks.ts
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env` file in the root directory:

```env
# Required
PICKUP_MTAANI_API_KEY=your_api_key_here

# Optional (for webhooks example)
WEBHOOK_URL=https://yourdomain.com/webhooks/pickup-mtaani
PORT=3000
RUN_WEBHOOK_TEST=false
```

### 3. For Webhook Example Only

Install additional dependencies:

```bash
npm install express body-parser
npm install --save-dev @types/express @types/body-parser
```

## Running Examples

### Run Individual Example

```bash
# Using ts-node (recommended for development)
npx ts-node examples/basic-usage.ts

# Or compile and run
npm run build
node dist/examples/basic-usage.js
```

### Run All Examples Sequentially

```bash
# Create a script to run all examples
for file in examples/*.ts; do
  echo "Running $file..."
  npx ts-node "$file"
  echo "---"
done
```

## Example Output

Each example produces detailed console output showing:
- ✅ Successful operations
- 📦 Package tracking information  
- 💰 Cost calculations and wallet balance
- 📍 Location details
- ❌ Error handling demonstrations

## Testing with Sandbox

If you're using a sandbox/test environment:

1. Update the base URL in your `.env`:
   ```env
   PICKUP_MTAANI_API_KEY=sandbox_api_key
   PICKUP_MTAANI_BASE_URL=https://sandbox.api.pickupmtaani.com/api/v1
   ```

2. Use test M-Pesa numbers for payment examples

3. Webhook testing with ngrok:
   ```bash
   # Install ngrok
   npm install -g ngrok

   # Start webhook server
   npx ts-node examples/webhooks.ts

   # In another terminal, expose it
   ngrok http 3000

   # Use the ngrok HTTPS URL as your WEBHOOK_URL
   ```

## Common Patterns

### Error Handling

All examples demonstrate proper error handling:

```typescript
try {
  // SDK operations
} catch (error) {
  if (error.name === 'ValidationError') {
    // Handle validation errors
  } else if (error.name === 'AuthenticationError') {
    // Handle auth errors
  } else if (error.name === 'InsufficientBalanceError') {
    // Handle balance errors
  }
}
```

### Pagination

```typescript
const response = await client.agentPackages.list(businessId, {
  page: 1,
  perPage: 20,
});

console.log(`Total: ${response.total}`);
console.log(`Page: ${response.current_page} of ${response.last_page}`);
```

### Validation

```typescript
// Phone validation
client.validators.validateKenyanPhoneNumber('0712345678');
const formatted = client.validators.formatKenyanPhoneNumber('0712345678');

// Package value validation
client.validators.validatePackageValue(5000, 1000000);
```

## Next Steps

1. **Read the Documentation**: Check the main [README.md](../README.md) for complete API reference

2. **Run Tests**: See [TESTING.md](../TESTING.md) for testing guidelines

3. **Integration**: Integrate the SDK into your application:
   ```typescript
   import { PickupMtaaniClient } from 'pickup-mtaani-sdk';

   const client = new PickupMtaaniClient({
     apiKey: process.env.PICKUP_MTAANI_API_KEY,
   });
   ```

4. **Production Checklist**:
   - ✓ Use environment variables for API keys
   - ✓ Implement error handling
   - ✓ Set up webhook endpoints
   - ✓ Monitor API rate limits
   - ✓ Log important operations
   - ✓ Handle payment failures gracefully

## Troubleshooting

### "Cannot find module 'pickup-mtaani-sdk'"

The examples use relative imports from '../src' for local development:

```typescript
// For local development (current setup)
import { PickupMtaaniClient } from '../src';

// After npm publish
import { PickupMtaaniClient } from 'pickup-mtaani-sdk';
```

**Note**: The examples contain TypeScript errors because they use placeholder API responses that don't match the actual API structure. These examples serve as **conceptual guides** and should be updated with actual API responses once you have access to the real API.

### "Authentication Error"

- Verify your API key is correct
- Check if API key is active
- Ensure you're using the correct environment (production/sandbox)

### "Insufficient Balance"

- Check your wallet balance: `await client.business.get()`
- Top up your account
- Use the payments example to add funds via M-Pesa

### Webhook Not Receiving Events

- Ensure URL is HTTPS and publicly accessible
- Check webhook is registered: Run `examples/webhooks.ts`
- Verify your server is running
- Check firewall settings

## Contributing

Found an issue or want to add more examples? Please open an issue or submit a pull request!

## License

These examples are part of the Pickup Mtaani SDK and are provided under the same license.
