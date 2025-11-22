/**
 * Common types used across the Pickup Mtaani SDK
 */

/**
 * Base API response wrapper
 */
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/**
 * Pagination parameters for list queries
 */
export interface PaginationParams {
  /**
   * Page number (starts from 0)
   */
  pageNumber?: number;
  /**
   * Number of items per page
   */
  pageSize?: number;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  /**
   * Total number of items matching the criteria
   */
  totalCount: number;
  /**
   * Current page number (if provided in request)
   */
  pageNumber?: number;
  /**
   * Number of items per page (if provided in request)
   */
  pageSize?: number;
  /**
   * Array of items in the current page
   */
  data: T[];
}

/**
 * Common ID types for type safety
 */
export type BusinessId = number;
export type AgentId = number;
export type PackageId = number;
export type LocationId = number;
export type AreaId = number;
export type ZoneId = number;
export type DoorstepDestinationId = number;
export type CategoryId = number;
export type RiderTypeId = number;

/**
 * Kenyan phone number type (for validation)
 * Must match pattern: /^(\+254|0)(1|7)[0-9]{8}$/
 */
export type KenyanPhoneNumber = string;

/**
 * ISO date-time string
 */
export type ISODateString = string;

/**
 * GeoJSON coordinate: [longitude, latitude]
 */
export type Coordinate = [number, number];
