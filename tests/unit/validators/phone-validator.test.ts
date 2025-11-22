import {
  validateKenyanPhoneNumber,
  isValidKenyanPhoneNumber,
  formatKenyanPhoneNumber,
} from '../../../src/validators/phone-validator';
import { ValidationError } from '../../../src/types/errors';

describe('Phone Validator', () => {
  describe('isValidKenyanPhoneNumber', () => {
    it('should return true for valid Safaricom numbers starting with 07', () => {
      expect(isValidKenyanPhoneNumber('0712345678')).toBe(true);
      expect(isValidKenyanPhoneNumber('0722345678')).toBe(true);
      expect(isValidKenyanPhoneNumber('0733345678')).toBe(true);
    });

    it('should return true for valid Safaricom numbers starting with 01', () => {
      expect(isValidKenyanPhoneNumber('0112345678')).toBe(true);
    });

    it('should return true for valid numbers with +254 prefix', () => {
      expect(isValidKenyanPhoneNumber('+254712345678')).toBe(true);
      expect(isValidKenyanPhoneNumber('+254722345678')).toBe(true);
      expect(isValidKenyanPhoneNumber('+254112345678')).toBe(true);
    });

    it('should return false for invalid formats', () => {
      expect(isValidKenyanPhoneNumber('712345678')).toBe(false); // Missing leading 0 or +254
      expect(isValidKenyanPhoneNumber('0812345678')).toBe(false); // Invalid second digit
      expect(isValidKenyanPhoneNumber('071234567')).toBe(false); // Too short
      expect(isValidKenyanPhoneNumber('07123456789')).toBe(false); // Too long
      expect(isValidKenyanPhoneNumber('+25412345678')).toBe(false); // Invalid second digit with +254
    });

    it('should return false for non-numeric characters', () => {
      expect(isValidKenyanPhoneNumber('071234567a')).toBe(false);
      expect(isValidKenyanPhoneNumber('0712-345-678')).toBe(false);
      expect(isValidKenyanPhoneNumber('0712 345 678')).toBe(false);
    });

    it('should return false for empty or null values', () => {
      expect(isValidKenyanPhoneNumber('')).toBe(false);
      expect(isValidKenyanPhoneNumber(null as any)).toBe(false);
      expect(isValidKenyanPhoneNumber(undefined as any)).toBe(false);
    });
  });

  describe('validateKenyanPhoneNumber', () => {
    it('should not throw error for valid phone numbers', () => {
      expect(() => validateKenyanPhoneNumber('0712345678')).not.toThrow();
      expect(() => validateKenyanPhoneNumber('+254712345678')).not.toThrow();
      expect(() => validateKenyanPhoneNumber('0112345678')).not.toThrow();
    });

    it('should throw ValidationError for invalid phone numbers', () => {
      expect(() => validateKenyanPhoneNumber('712345678')).toThrow(ValidationError);
      expect(() => validateKenyanPhoneNumber('0812345678')).toThrow(ValidationError);
      expect(() => validateKenyanPhoneNumber('071234567')).toThrow(ValidationError);
    });

    it('should include helpful error message', () => {
      expect(() => validateKenyanPhoneNumber('123456')).toThrow(
        'Invalid Kenyan phone number format'
      );
    });
  });

  describe('formatKenyanPhoneNumber', () => {
    it('should format numbers starting with 0 to +254 format', () => {
      expect(formatKenyanPhoneNumber('0712345678')).toBe('+254712345678');
      expect(formatKenyanPhoneNumber('0112345678')).toBe('+254112345678');
    });

    it('should keep numbers already in +254 format', () => {
      expect(formatKenyanPhoneNumber('+254712345678')).toBe('+254712345678');
      expect(formatKenyanPhoneNumber('+254112345678')).toBe('+254112345678');
    });

    it('should handle numbers starting with 254', () => {
      expect(formatKenyanPhoneNumber('254712345678')).toBe('+254712345678');
      expect(formatKenyanPhoneNumber('254112345678')).toBe('+254112345678');
    });

    it('should return as-is for other formats', () => {
      // The function doesn't validate, it just formats known patterns
      expect(formatKenyanPhoneNumber('712345678')).toBe('712345678');
    });
  });
});
