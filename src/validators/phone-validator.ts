import { ValidationError } from '../types/errors';
import { KenyanPhoneNumber } from '../types/common';

/**
 * Kenyan phone number regex pattern
 * Matches: +254... or 0... for lines starting with 1 or 7
 * Examples: +254712345678, 0712345678, +254112345678, 0112345678
 */
const KENYAN_PHONE_PATTERN = /^(\+254|0)(1|7)[0-9]{8}$/;

/**
 * Validate a Kenyan phone number
 * @param phone - Phone number to validate
 * @throws {ValidationError} If phone number is invalid
 * @example
 * ```typescript
 * validateKenyanPhoneNumber('0712345678'); // Valid
 * validateKenyanPhoneNumber('+254712345678'); // Valid
 * validateKenyanPhoneNumber('0612345678'); // Throws ValidationError
 * ```
 */
export function validateKenyanPhoneNumber(phone: KenyanPhoneNumber): void {
  if (!KENYAN_PHONE_PATTERN.test(phone)) {
    throw new ValidationError(
      'Invalid Kenyan phone number format. Must match pattern: /^(\\+254|0)(1|7)[0-9]{8}$/',
      [`phone: "${phone}" does not match the required format`]
    );
  }
}

/**
 * Check if a phone number is valid without throwing an error
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidKenyanPhoneNumber(phone: string): boolean {
  return KENYAN_PHONE_PATTERN.test(phone);
}

/**
 * Format a Kenyan phone number to international format (+254...)
 * @param phone - Phone number to format
 * @returns Formatted phone number
 * @example
 * ```typescript
 * formatKenyanPhoneNumber('0712345678'); // '+254712345678'
 * formatKenyanPhoneNumber('+254712345678'); // '+254712345678'
 * ```
 */
export function formatKenyanPhoneNumber(phone: string): string {
  // Remove any spaces or dashes
  const cleaned = phone.replace(/[\s-]/g, '');

  // If starts with 0, replace with +254
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.substring(1);
  }

  // If starts with 254 (without +), add +
  if (cleaned.startsWith('254')) {
    return '+' + cleaned;
  }

  // Already in correct format
  return cleaned;
}
