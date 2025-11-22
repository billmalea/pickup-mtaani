/**
 * Integration Test Setup
 * Loads environment variables from .env.local
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

// Validate required environment variables
export function validateTestEnv(): void {
  const requiredVars = ['PICKUP_MTAANI_API_KEY'];
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please create a .env.local file with your API credentials.\n' +
      'See .env.example for the template.'
    );
  }
}

// Test configuration
export const testConfig = {
  apiKey: process.env.PICKUP_MTAANI_API_KEY!,
  baseUrl: process.env.PICKUP_MTAANI_BASE_URL || 'https://api.pickupmtaani.com/api/v1',
  testPhone: process.env.TEST_PHONE_NUMBER || '0712345678',
  timeout: 30000, // 30 seconds for API calls
};

// Helper to skip tests if no API key
export function skipIfNoApiKey(): void {
  if (!process.env.PICKUP_MTAANI_API_KEY) {
    console.warn('⚠️  Skipping integration tests: PICKUP_MTAANI_API_KEY not set');
    console.warn('   Create .env.local file with your API key to run integration tests');
  }
}
