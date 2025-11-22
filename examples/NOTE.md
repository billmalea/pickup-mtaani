# Important Note About Examples

## Current Status

The example files in this directory (`basic-usage.ts`, `agent-packages.ts`, etc.) are **conceptual demonstrations** based on the OpenAPI specification. They contain TypeScript errors because:

1. **Placeholder API Responses**: The examples assume API response structures that may not match the actual implementation
2. **Missing Type Properties**: Some properties used in examples (like `wallet_balance`, `tracking_number`) may be named differently in the actual API
3. **Parameter Mismatches**: Method signatures in examples may differ from the actual service implementations

## Purpose

These examples are provided to:
- Demonstrate the **intended usage patterns** of the SDK
- Show best practices for error handling
- Illustrate complete workflows for different scenarios
- Serve as templates for actual implementation

## To Use These Examples

1. **Test with Real API**: The examples should be tested against the actual Pickup Mtaani API
2. **Update Type Definitions**: Correct the type definitions in `src/types/` to match actual API responses
3. **Fix Examples**: Update examples to use correct property names and method signatures
4. **Run Integration Tests**: Validate all examples work with the real API

## Recommended Approach

Instead of running these examples directly, use them as **reference guides** while writing your own integration code:

```typescript
import { PickupMtaaniClient } from '../src';

const client = new PickupMtaaniClient({
  apiKey: process.env.PICKUP_MTAANI_API_KEY!,
});

// Start with a simple operation
async function test() {
  try {
    // Test your actual endpoint
    const business = await client.business.get();
    console.log('Success:', business);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
```

## Contributing

If you have access to the Pickup Mtaani API and can fix these examples:

1. Test each example with the real API
2. Update type definitions to match actual responses
3. Fix property names and method signatures
4. Submit a pull request with working examples

Thank you for your understanding!
