import { HttpClient } from '../http/http-client';
import { ApiResponse } from '../types/common';
import {
  Zone,
  Area,
  Location,
  DoorstepDestination,
  LocationsQueryParams,
  DoorstepDestinationsQueryParams,
} from '../types/locations';

/**
 * Service for managing location operations
 */
export class LocationsService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieve a list of zones
   * @returns List of zones
   * @throws {InternalServerError} If server error occurs
   */
  async getZones(): Promise<Zone[]> {
    const response = await this.http.get<ApiResponse<Zone[]>>('/locations/zones');
    return response.data || [];
  }

  /**
   * Retrieve a list of areas
   * @returns List of areas
   * @throws {InternalServerError} If server error occurs
   */
  async getAreas(): Promise<Area[]> {
    const response = await this.http.get<ApiResponse<Area[]>>('/locations/areas');
    return response.data || [];
  }

  /**
   * Retrieve a list of agent locations with optional filtering
   * @param params - Query parameters for filtering (areaId, zoneId, searchKey)
   * @returns List of locations
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   */
  async getLocations(params?: LocationsQueryParams): Promise<Location[]> {
    const response = await this.http.get<ApiResponse<Location[]>>(
      '/locations',
      params as Record<string, unknown>
    );
    return response.data || [];
  }

  /**
   * Retrieve a list of doorstep destinations with optional filtering
   * @param params - Query parameters for filtering (areaId, searchKey)
   * @returns List of doorstep destinations
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   */
  async getDoorstepDestinations(
    params?: DoorstepDestinationsQueryParams
  ): Promise<DoorstepDestination[]> {
    const response = await this.http.get<ApiResponse<DoorstepDestination[]>>(
      '/locations/doorstep-destinations',
      params as Record<string, unknown>
    );
    return response.data || [];
  }
}
