import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { PickupMtaaniConfig, DEFAULT_CONFIG } from '../config';
import {
  PickupMtaaniError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  InternalServerError,
  TimeoutError,
  NetworkError,
  ApiErrorResponse,
} from '../types/errors';

/**
 * HTTP client for making requests to the Pickup Mtaani API
 */
export class HttpClient {
  private axios: AxiosInstance;
  private config: PickupMtaaniConfig;

  constructor(config: PickupMtaaniConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    if (!this.config.apiKey) {
      throw new Error('API key is required');
    }

    this.axios = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        apiKey: this.config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axios.interceptors.request.use(
      (config) => {
        if (this.config.debug) {
          console.log('[Pickup Mtaani SDK] Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            params: config.params,
            data: config.data,
          });
        }
        return config;
      },
      (error) => {
        if (this.config.debug) {
          console.error('[Pickup Mtaani SDK] Request error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        if (this.config.debug) {
          console.log('[Pickup Mtaani SDK] Response:', {
            status: response.status,
            data: response.data,
          });
        }
        return response;
      },
      (error) => {
        if (this.config.debug) {
          console.error('[Pickup Mtaani SDK] Response error:', error);
        }
        throw this.transformError(error);
      }
    );
  }

  /**
   * Transform axios errors into custom error types
   */
  private transformError(error: AxiosError<ApiErrorResponse>): PickupMtaaniError {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new TimeoutError(error.message);
    }

    // Handle network errors
    if (!error.response) {
      return new NetworkError(error.message || 'Network error occurred');
    }

    const { status, data } = error.response;
    const message = data?.message || error.message || 'An error occurred';
    const validationErrors = data?.validationErrors;

    // Map status codes to error types
    switch (status) {
      case 400:
        return new ValidationError(message, validationErrors);
      case 401:
        return new AuthenticationError(message);
      case 403:
        return new AuthorizationError(message);
      case 404:
        return new NotFoundError(message);
      case 409:
        return new ConflictError(message);
      case 500:
      case 502:
      case 503:
      case 504:
        return new InternalServerError(message);
      default:
        return new PickupMtaaniError(message, status, validationErrors);
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.axios.get<T>(url, { params });
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: { params?: Record<string, any> }
  ): Promise<T> {
    const response = await this.axios.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: { params?: Record<string, any> }
  ): Promise<T> {
    const response = await this.axios.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.axios.delete<T>(url, { params });
    return response.data;
  }

  /**
   * Make a custom request with full axios config
   */
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.request<T>(config);
    return response.data;
  }
}
