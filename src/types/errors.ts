/**
 * Custom error classes for Pickup Mtaani SDK
 */

/**
 * Base error class for all Pickup Mtaani errors
 */
export class PickupMtaaniError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public validationErrors?: string[]
  ) {
    super(message);
    this.name = 'PickupMtaaniError';
    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when request validation fails (400)
 */
export class ValidationError extends PickupMtaaniError {
  constructor(message: string, validationErrors?: string[]) {
    super(message, 400, validationErrors);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when requested resource is not found (404)
 */
export class NotFoundError extends PickupMtaaniError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Error thrown when authentication fails (401)
 */
export class AuthenticationError extends PickupMtaaniError {
  constructor(message: string = 'Invalid API key or authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error thrown when user doesn't have permission (403)
 */
export class AuthorizationError extends PickupMtaaniError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Error thrown when operation conflicts with current state (409)
 */
export class ConflictError extends PickupMtaaniError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * Error thrown when server returns 500 error
 */
export class InternalServerError extends PickupMtaaniError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

/**
 * Error thrown when request times out
 */
export class TimeoutError extends PickupMtaaniError {
  constructor(message: string = 'Request timed out') {
    super(message, 408);
    this.name = 'TimeoutError';
  }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends PickupMtaaniError {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Error response structure from API
 */
export interface ApiErrorResponse {
  message: string;
  validationErrors?: string[];
  success?: boolean;
}
