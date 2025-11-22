import { HttpClient } from '../http/http-client';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '../types/common';
import { Business, BusinessCategory, UpdateBusinessRequest } from '../types/business';

/**
 * Service for managing business operations
 */
export class BusinessService {
  constructor(private http: HttpClient) {}

  /**
   * Retrieves details of the business tied to the current API key
   * @returns Business details
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   */
  async get(): Promise<Business> {
    const response = await this.http.get<ApiResponse<Business>>('/business');
    if (!response.data) {
      throw new Error('No business data returned');
    }
    return response.data;
  }

  /**
   * Update the business tied to the current API key
   * @param data - Updated business information
   * @returns Updated business details
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   */
  async update(data: UpdateBusinessRequest): Promise<Business> {
    const response = await this.http.put<ApiResponse<Business>>('/business/update', data);
    if (!response.data) {
      throw new Error('No business data returned');
    }
    return response.data;
  }

  /**
   * Delete the business tied to the current API key
   * @returns Success message
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   */
  async delete(): Promise<string> {
    const response = await this.http.delete<ApiResponse<void>>('/business/remove');
    return response.message || 'Business deleted successfully';
  }

  /**
   * Get a list of business categories with pagination support
   * @param params - Pagination parameters (pageNumber, pageSize)
   * @returns Paginated list of categories
   * @throws {ValidationError} If validation fails
   * @throws {InternalServerError} If server error occurs
   */
  async getCategories(
    params?: PaginationParams
  ): Promise<PaginatedResponse<BusinessCategory>> {
    return this.http.get<PaginatedResponse<BusinessCategory>>(
      '/business/categories',
      params
    );
  }
}
