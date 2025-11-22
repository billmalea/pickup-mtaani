import { LocationId, AreaId, ZoneId, DoorstepDestinationId } from './common';

/**
 * Zone entity
 */
export interface Zone {
  /**
   * Zone ID
   */
  id: ZoneId;
  /**
   * Zone name (e.g., "Nairobi")
   */
  name: string;
}

/**
 * Area entity
 */
export interface Area {
  /**
   * Area ID
   */
  id: AreaId;
  /**
   * Area name
   */
  name: string;
}

/**
 * Agent location
 */
export interface Location {
  /**
   * Location ID
   */
  id: LocationId;
  /**
   * Location name
   */
  name: string;
  /**
   * Associated zone ID
   */
  zone_id: ZoneId;
}

/**
 * Doorstep destination
 */
export interface DoorstepDestination {
  /**
   * Destination ID
   */
  id: DoorstepDestinationId;
  /**
   * Destination name
   */
  name: string;
}

/**
 * Query parameters for locations endpoint
 */
export interface LocationsQueryParams {
  /**
   * Filter by area ID
   */
  areaId?: AreaId;
  /**
   * Filter by zone ID
   */
  zoneId?: ZoneId;
  /**
   * Search key to filter locations by name
   */
  searchKey?: string;
}

/**
 * Query parameters for doorstep destinations endpoint
 */
export interface DoorstepDestinationsQueryParams {
  /**
   * Filter by area ID
   */
  areaId?: AreaId;
  /**
   * Search key to filter destinations by name
   */
  searchKey?: string;
}
