/**
 * Integration Tests - Validators
 * Tests validator functions
 */

import {
  validateKenyanPhoneNumber,
  isValidKenyanPhoneNumber,
  formatKenyanPhoneNumber,
} from '../../src/validators/phone-validator';
import {
  validatePackageValue,
  isValidPackageValue,
} from '../../src/validators/package-validator';
import { ValidationError } from '../../src/types/errors';

describe('Phone Validator Integration', () => {
  describe('Real-world phone numbers', () => {
    const validNumbers = [
      '0712345678', // Safaricom
      '0722345678', // Safaricom
      '0733345678', // Safaricom
      '0112345678', // Safaricom 01x
      '+254712345678', // International format
      '+254112345678', // International 01x
    ];

    validNumbers.forEach(phone => {
      it(`should validate ${phone} as valid`, () => {
        expect(isValidKenyanPhoneNumber(phone)).toBe(true);
        expect(() => validateKenyanPhoneNumber(phone)).not.toThrow();
      });
    });

    it('should format all valid numbers to international format', () => {
      expect(formatKenyanPhoneNumber('0712345678')).toBe('+254712345678');
      expect(formatKenyanPhoneNumber('0112345678')).toBe('+254112345678');
      expect(formatKenyanPhoneNumber('+254712345678')).toBe('+254712345678');
      expect(formatKenyanPhoneNumber('254712345678')).toBe('+254712345678');
    });
  });

  describe('Invalid phone numbers', () => {
    const invalidNumbers = [
      '712345678', // Missing leading 0 or +254
      '0812345678', // Invalid second digit
      '071234567', // Too short
      '07123456789', // Too long
      '0000000000', // All zeros
      '1234567890', // Random digits
      '+2551234567', // Wrong country code
    ];

    invalidNumbers.forEach(phone => {
      it(`should reject ${phone} as invalid`, () => {
        expect(isValidKenyanPhoneNumber(phone)).toBe(false);
        expect(() => validateKenyanPhoneNumber(phone)).toThrow(ValidationError);
      });
    });
  });
});

describe('Package Validator Integration', () => {
  describe('Package value validation', () => {
    it('should validate typical package values', () => {
      const validValues = [100, 500, 1000, 5000, 50000, 100000, 500000, 1000000];

      validValues.forEach(value => {
        expect(isValidPackageValue(value)).toBe(true);
        expect(() => validatePackageValue(value)).not.toThrow();
      });
    });

    it('should reject invalid package values', () => {
      const invalidValues = [-100, -1, 1000001, 2000000, 10000000];

      invalidValues.forEach(value => {
        expect(isValidPackageValue(value)).toBe(false);
        expect(() => validatePackageValue(value)).toThrow(ValidationError);
      });
    });

    it('should handle edge cases', () => {
      // Minimum value (0)
      expect(isValidPackageValue(0)).toBe(true);
      expect(() => validatePackageValue(0)).not.toThrow();

      // Maximum value (1000000)
      expect(isValidPackageValue(1000000)).toBe(true);
      expect(() => validatePackageValue(1000000)).not.toThrow();

      // Just above maximum
      expect(isValidPackageValue(1000001)).toBe(false);
      expect(() => validatePackageValue(1000001)).toThrow(ValidationError);

      // Negative values
      expect(isValidPackageValue(-1)).toBe(false);
      expect(() => validatePackageValue(-1)).toThrow(ValidationError);
    });

    it('should validate with custom limits', () => {
      // Custom limit of 50000
      expect(isValidPackageValue(40000, 50000)).toBe(true);
      expect(isValidPackageValue(60000, 50000)).toBe(false);

      expect(() => validatePackageValue(40000, 50000)).not.toThrow();
      expect(() => validatePackageValue(60000, 50000)).toThrow(ValidationError);
    });
  });
});
