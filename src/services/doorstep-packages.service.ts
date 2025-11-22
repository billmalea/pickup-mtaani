import { HttpClient } from '../http/http-client';
import {
  ApiResponse,
  PaginatedResponse,
  BusinessId,
  PackageId,
} from '../types/common';
import {
  DoorstepPackage,
  CreateDoorstepPackageRequest,
  UpdateDoorstepPackageRequest,
  PackageQueryParams,
} from '../types/packages';
import { PaymentPackage } from '../types/payments';

/**
 * Service for managing doorstep delivery packages
 */
export class DoorstepPackagesService {
  constructor(private http: HttpClient) {}

  /**
   * Create a new doorstep delivery package
   * @param businessId - ID of the business creating the package
   * @param data - Package creation data
   * @returns Created package details
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If business or agent not found
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * const package = await client.doorstepPackages.create(505, {
   *   senderAgentID_id: 517,
   *   customerName: 'Jane Doe',
   *   customerPhoneNumber: '0723456789',
   *   packageName: 'Groceries',
   *   packageValue: 3000,
   *   paymentOption: 'vendor',
   *   doorstepDestinationId: 541,
   *   locationDescription: 'Near the supermarket',
   *   lat: -1.2921,
   *   lng: 36.8219
   * });
   * ```
   */
  async create(
    businessId: BusinessId,
    data: CreateDoorstepPackageRequest
  ): Promise<DoorstepPackage> {
    const response = await this.http.post<ApiResponse<DoorstepPackage>>(
      '/packages/doorstep',
      data,
      { params: { b_id: businessId } }
    );
    if (!response.data) {
      throw new Error('No package data returned');
    }
    return response.data;
  }

  /**
   * Get details of a doorstep package
   * @param id - Package ID
   * @param businessId - Business ID associated with the package
   * @returns Package details
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If package not found
   * @throws {InternalServerError} If server error occurs
   */
  async get(id: PackageId, businessId: BusinessId): Promise<DoorstepPackage> {
    const response = await this.http.get<ApiResponse<DoorstepPackage>>('/packages/doorstep', {
      id,
      b_id: businessId,
    });
    if (!response.data) {
      throw new Error('No package data returned');
    }
    return response.data;
  }

  /**
   * Update a doorstep package
   * @param id - Package ID to update
   * @param data - Updated package data
   * @returns Updated package details
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If package not found
   * @throws {InternalServerError} If server error occurs
   */
  async update(id: PackageId, data: UpdateDoorstepPackageRequest): Promise<DoorstepPackage> {
    const response = await this.http.put<ApiResponse<DoorstepPackage>>(
      '/packages/doorstep-update',
      data,
      { params: { id } }
    );
    if (!response.data) {
      throw new Error('No package data returned');
    }
    return response.data;
  }

  /**
   * Get list of user's doorstep packages for a business
   * @param businessId - Business ID
   * @param filters - Optional filters (state, receipt_no, phoneNumber, customerName, pagination)
   * @returns Paginated list of packages
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * // Get all packages
   * const packages = await client.doorstepPackages.list(505);
   * 
   * // Filter by customer name
   * const results = await client.doorstepPackages.list(505, { customerName: 'Jane' });
   * 
   * // With pagination
   * const page1 = await client.doorstepPackages.list(505, { pageNumber: 0, pageSize: 20 });
   * ```
   */
  async list(
    businessId: BusinessId,
    filters?: PackageQueryParams
  ): Promise<PaginatedResponse<DoorstepPackage>> {
    return this.http.get<PaginatedResponse<DoorstepPackage>>('/packages/doorstep/mine', {
      b_id: businessId,
      ...filters,
    });
  }

  /**
   * Delete a doorstep package
   * @param id - Package ID to delete
   * @returns Success message
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If package not found
   * @throws {InternalServerError} If server error occurs
   */
  async delete(id: PackageId): Promise<string> {
    const response = await this.http.delete<ApiResponse<void>>('/packages/doorstep-package', {
      id,
    });
    return response.message || 'Package deleted successfully';
  }

  /**
   * Get list of unpaid doorstep packages for a business
   * @param businessId - Business ID
   * @returns List of unpaid packages
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If business not found
   * @throws {InternalServerError} If server error occurs
   */
  async getUnpaid(businessId: BusinessId): Promise<PaymentPackage[]> {
    const response = await this.http.get<ApiResponse<PaymentPackage[]>>(
      '/packages/my-unpaid-packages',
      { b_id: businessId }
    );
    return response.data || [];
  }
}
