import { HttpClient } from '../http/http-client';
import { ApiResponse, BusinessId, PackageId } from '../types/common';
import {
  ExpressPackage,
  CreateExpressPackageRequest,
  UpdateExpressPackageRequest,
  ExpressDirectionsRequest,
  ExpressDirectionsResponse,
  DeliveryMode,
  NearbyRider,
} from '../types/packages';

/**
 * Service for managing express delivery packages
 */
export class ExpressDeliveriesService {
  constructor(private http: HttpClient) {}

  /**
   * Get delivery directions and pricing for express delivery
   * @param businessId - Business ID
   * @param data - Coordinates and rider type
   * @returns Distance, duration, and pricing information
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * const directions = await client.expressDeliveries.getDirections(750, {
   *   coordinates: [
   *     [36.81443, -1.27365],  // departure [lng, lat]
   *     [36.84224, -1.29124]   // destination [lng, lat]
   *   ],
   *   rider_type_id: 2
   * });
   * console.log(directions.price); // 560
   * ```
   */
  async getDirections(
    businessId: BusinessId,
    data: ExpressDirectionsRequest
  ): Promise<ExpressDirectionsResponse> {
    const response = await this.http.post<ApiResponse<ExpressDirectionsResponse>>(
      '/packages/express/directions',
      data,
      { params: { b_id: businessId } }
    );
    if (!response.data) {
      throw new Error('No directions data returned');
    }
    return response.data;
  }

  /**
   * Create a new express delivery order
   * @param businessId - Business ID
   * @param data - Express delivery data
   * @returns Created express package
   * @throws {ValidationError} If validation fails or package value exceeds limit
   * @throws {NotFoundError} If business not found
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * const express = await client.expressDeliveries.create(750, {
   *   customer_name: 'Alice Johnson',
   *   customer_phone_number: '0745678901',
   *   package_value: 2000,
   *   package_name: 'Electronics',
   *   departure: [36.8219, -1.2921],
   *   destination: [36.8422, -1.2912],
   *   exact_location: 'Burma Market',
   *   payment_option: 'vendor',
   *   from: 'Westlands',
   *   to: 'CBD'
   * });
   * ```
   */
  async create(businessId: BusinessId, data: CreateExpressPackageRequest): Promise<ExpressPackage> {
    const response = await this.http.post<ApiResponse<ExpressPackage>>(
      '/packages/express',
      data,
      { params: { b_id: businessId } }
    );
    if (!response.data) {
      throw new Error('No package data returned');
    }
    return response.data;
  }

  /**
   * Get details of a single express package
   * @param id - Package ID
   * @returns Express package details
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If package not found
   * @throws {InternalServerError} If server error occurs
   */
  async get(id: PackageId): Promise<ExpressPackage> {
    const response = await this.http.get<ApiResponse<ExpressPackage>>('/packages/express', {
      id,
    });
    if (!response.data) {
      throw new Error('No package data returned');
    }
    return response.data;
  }

  /**
   * Update an express package
   * @param id - Package ID
   * @param businessId - Business ID
   * @param data - Updated package data
   * @returns Updated express package
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If business or package not found
   * @throws {InternalServerError} If server error occurs
   */
  async update(
    id: PackageId,
    businessId: BusinessId,
    data: UpdateExpressPackageRequest
  ): Promise<ExpressPackage> {
    const response = await this.http.put<ApiResponse<ExpressPackage>>(
      '/packages/express',
      data,
      { params: { id, b_id: businessId } }
    );
    if (!response.data) {
      throw new Error('No package data returned');
    }
    return response.data;
  }

  /**
   * Find a nearby rider for a package
   * @param id - Package ID
   * @returns List of nearby riders
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If no nearby riders found
   * @throws {ConflictError} If package is in invalid state
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * const riders = await client.expressDeliveries.findRider(packageId);
   * console.log(riders[0].name); // "Brian Rider"
   * ```
   */
  async findRider(id: PackageId): Promise<NearbyRider[]> {
    const response = await this.http.put<ApiResponse<NearbyRider[]>>(
      '/packages/express/find-rider',
      undefined,
      { params: { id } }
    );
    return response.data || [];
  }

  /**
   * Get available delivery modes (bike, car, etc.)
   * @returns List of delivery modes
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * const modes = await client.expressDeliveries.getDeliveryModes();
   * // [{ id: 1, name: "Motorbike", description: "Two-wheeled..." }]
   * ```
   */
  async getDeliveryModes(): Promise<DeliveryMode[]> {
    const response = await this.http.get<ApiResponse<DeliveryMode[]>>(
      '/packages/express/delivery-modes'
    );
    return response.data || [];
  }
}
