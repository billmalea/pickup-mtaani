import { HttpClient } from '../http/http-client';
import { ApiResponse, PaginatedResponse, BusinessId, PackageId } from '../types/common';
import {
  AgentPackage,
  CreateAgentPackageRequest,
  UpdateAgentPackageRequest,
  PackageQueryParams,
} from '../types/packages';
import { PaymentPackage } from '../types/payments';

/**
 * Service for managing agent-to-agent packages
 */
export class AgentPackagesService {
  constructor(private http: HttpClient) {}

  /**
   * Create a new agent-to-agent package
   * @param businessId - ID of the business creating the package
   * @param data - Package creation data
   * @returns Created package details
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If business or agents not found
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * const package = await client.agentPackages.create(505, {
   *   senderAgentId: 362,
   *   receiverAgentId: 454,
   *   customerName: 'John Doe',
   *   customerPhoneNumber: '0712345678',
   *   packageName: 'Electronics',
   *   packageValue: 5000,
   *   paymentOption: 'vendor',
   *   on_delivery_balance: 500
   * });
   * ```
   */
  async create(businessId: BusinessId, data: CreateAgentPackageRequest): Promise<AgentPackage> {
    const response = await this.http.post<ApiResponse<AgentPackage>>(
      '/packages/agent-agent',
      data,
      { params: { b_id: businessId } }
    );
    if (!response.data) {
      throw new Error('No package data returned');
    }
    return response.data;
  }

  /**
   * Get details of an agent package
   * @param id - Package ID
   * @param businessId - Business ID associated with the package
   * @returns Package details
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If package not found
   * @throws {InternalServerError} If server error occurs
   */
  async get(id: PackageId, businessId: BusinessId): Promise<AgentPackage> {
    const response = await this.http.get<ApiResponse<AgentPackage>>('/packages/agent-agent', {
      id,
      b_id: businessId,
    });
    if (!response.data) {
      throw new Error('No package data returned');
    }
    return response.data;
  }

  /**
   * Update an agent package
   * @param id - Package ID to update
   * @param data - Updated package data
   * @returns Updated package details
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If package not found
   * @throws {InternalServerError} If server error occurs
   */
  async update(id: PackageId, data: UpdateAgentPackageRequest): Promise<AgentPackage> {
    const response = await this.http.put<ApiResponse<AgentPackage>>(
      '/packages/agent-update',
      data,
      { params: { id } }
    );
    if (!response.data) {
      throw new Error('No package data returned');
    }
    return response.data;
  }

  /**
   * Get list of user's agent packages for a business
   * @param businessId - Business ID
   * @param filters - Optional filters (state, receipt_no, phoneNumber, customerName, pagination)
   * @returns Paginated list of packages
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   * @example
   * ```typescript
   * // Get all packages
   * const packages = await client.agentPackages.list(505);
   *
   * // Filter by state
   * const inTransit = await client.agentPackages.list(505, { state: 'in_transit' });
   *
   * // With pagination
   * const page1 = await client.agentPackages.list(505, { pageNumber: 0, pageSize: 10 });
   * ```
   */
  async list(
    businessId: BusinessId,
    filters?: PackageQueryParams
  ): Promise<PaginatedResponse<AgentPackage>> {
    return this.http.get<PaginatedResponse<AgentPackage>>('/packages/agent-agent/mine', {
      b_id: businessId,
      ...filters,
    });
  }

  /**
   * Delete an agent package
   * @param id - Package ID to delete
   * @returns Success message
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If package not found
   * @throws {InternalServerError} If server error occurs
   */
  async delete(id: PackageId): Promise<string> {
    const response = await this.http.delete<ApiResponse<void>>('/packages/agent-package', { id });
    return response.message || 'Package deleted successfully';
  }

  /**
   * Get list of unpaid agent packages for a business
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
