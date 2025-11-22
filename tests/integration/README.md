/**
 * Integration Tests - README
 * 
 * This directory contains integration tests that interact with the real Pickup Mtaani API.
 */

# Integration Tests

## Setup

1. **Create `.env.local` file** in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your API credentials** to `.env.local`:
   ```env
   PICKUP_MTAANI_API_KEY=your_actual_api_key_here
   PICKUP_MTAANI_BASE_URL=https://api.pickupmtaani.com/api/v1
   TEST_PHONE_NUMBER=0712345678
   ```

3. **Run integration tests**:
   ```bash
   # Run all integration tests
   npm run test:integration

   # Run specific test file
   npm test tests/integration/business.test.ts

   # Run with coverage
   npm test -- --coverage tests/integration/
   ```

## Test Files

- `setup.ts` - Test configuration and environment validation
- `business.test.ts` - Business service tests (GET, PUT)
- `locations.test.ts` - Locations service tests (zones, areas, locations, destinations)
- `agent-packages.test.ts` - Package lifecycle tests (create, get, update, list, delete)
- `validators.test.ts` - Validator function tests

## Important Notes

⚠️ **Security**
- `.env.local` is gitignored and will **never** be committed
- Never hardcode API keys in test files
- Always use environment variables for sensitive data

⚠️ **Test Data**
- Integration tests create real data in your account
- Tests include cleanup to delete created packages
- Monitor your API usage during testing

⚠️ **Rate Limits**
- Be mindful of API rate limits
- Add delays between tests if needed
- Don't run integration tests in parallel

## Skipping Tests

If `.env.local` doesn't exist or `PICKUP_MTAANI_API_KEY` is not set, integration tests will be automatically skipped with a warning message.

## CI/CD

For GitHub Actions, add secrets to your repository:
1. Go to Settings → Secrets and variables → Actions
2. Add `PICKUP_MTAANI_API_KEY`
3. Tests will run automatically on push/PR
