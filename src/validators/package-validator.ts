import { ValidationError } from '../types/errors';

/**
 * Default package value limit (can be configured)
 */
const DEFAULT_PACKAGE_VALUE_LIMIT = 1000000;

/**
 * Validate package value against a limit
 * @param value - Package value to validate
 * @param limit - Maximum allowed value (default: 1000000)
 * @throws {ValidationError} If package value exceeds the limit
 * @example
 * ```typescript
 * validatePackageValue(5000); // Valid
 * validatePackageValue(2000000); // Throws ValidationError
 * validatePackageValue(5000, 10000); // Valid with custom limit
 * ```
 */
export function validatePackageValue(
  value: number,
  limit: number = DEFAULT_PACKAGE_VALUE_LIMIT
): void {
  if (value > limit) {
    throw new ValidationError(`Package value ${value} exceeds the limit of ${limit}`, [
      `packageValue: must not exceed ${limit}`,
    ]);
  }

  if (value < 0) {
    throw new ValidationError('Package value must be a positive number', [
      'packageValue: must be greater than or equal to 0',
    ]);
  }
}

/**
 * Check if package value is valid without throwing an error
 * @param value - Package value to validate
 * @param limit - Maximum allowed value (default: 1000000)
 * @returns true if valid, false otherwise
 */
export function isValidPackageValue(
  value: number,
  limit: number = DEFAULT_PACKAGE_VALUE_LIMIT
): boolean {
  return value >= 0 && value <= limit;
}

/**
 * Validate delivery balance
 * @param balance - Balance to be paid on delivery
 * @throws {ValidationError} If balance is negative
 */
export function validateDeliveryBalance(balance: number): void {
  if (balance < 0) {
    throw new ValidationError('Delivery balance must be a positive number', [
      'on_delivery_balance: must be greater than or equal to 0',
    ]);
  }
}
