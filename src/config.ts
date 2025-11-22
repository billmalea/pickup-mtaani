/**
 * Configuration options for the Pickup Mtaani client
 */
export interface PickupMtaaniConfig {
  /**
   * API key for authentication (required)
   * Get your API key from https://new.pickupmtaani.com/api
   */
  apiKey: string;

  /**
   * Base URL for the API
   * @default 'https://api.pickupmtaani.com/api/v1'
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Number of retry attempts for failed requests
   * @default 3
   */
  retries?: number;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<PickupMtaaniConfig> = {
  baseUrl: 'https://api.pickupmtaani.com/api/v1',
  timeout: 30000,
  retries: 3,
  debug: false,
};
