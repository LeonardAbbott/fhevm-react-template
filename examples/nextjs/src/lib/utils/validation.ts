/**
 * Validation Utilities
 * Input validation helper functions
 */

import type { EncryptedType } from '../fhe/types';

/**
 * Validate value for encryption type
 */
export function validateEncryptionValue(
  type: EncryptedType,
  value: number | boolean | string | bigint
): { valid: boolean; error?: string } {
  switch (type) {
    case 'bool':
      if (typeof value !== 'boolean') {
        return { valid: false, error: 'Value must be a boolean' };
      }
      return { valid: true };

    case 'uint8':
      const uint8Val = Number(value);
      if (!Number.isInteger(uint8Val) || uint8Val < 0 || uint8Val > 255) {
        return { valid: false, error: 'Value must be an integer between 0 and 255' };
      }
      return { valid: true };

    case 'uint16':
      const uint16Val = Number(value);
      if (!Number.isInteger(uint16Val) || uint16Val < 0 || uint16Val > 65535) {
        return { valid: false, error: 'Value must be an integer between 0 and 65535' };
      }
      return { valid: true };

    case 'uint32':
      const uint32Val = Number(value);
      if (!Number.isInteger(uint32Val) || uint32Val < 0 || uint32Val > 4294967295) {
        return { valid: false, error: 'Value must be an integer between 0 and 4294967295' };
      }
      return { valid: true };

    case 'uint64':
      try {
        const uint64Val = BigInt(value);
        if (uint64Val < 0n || uint64Val > 18446744073709551615n) {
          return { valid: false, error: 'Value must be between 0 and 2^64-1' };
        }
        return { valid: true };
      } catch {
        return { valid: false, error: 'Value must be a valid BigInt' };
      }

    case 'address':
      const addressStr = String(value);
      if (!/^0x[a-fA-F0-9]{40}$/.test(addressStr)) {
        return { valid: false, error: 'Value must be a valid Ethereum address' };
      }
      return { valid: true };

    default:
      return { valid: false, error: `Unsupported type: ${type}` };
  }
}

/**
 * Parse value to appropriate type
 */
export function parseValueForType(
  type: EncryptedType,
  value: string
): number | boolean | string | bigint | null {
  try {
    switch (type) {
      case 'bool':
        return value.toLowerCase() === 'true';
      case 'uint8':
      case 'uint16':
      case 'uint32':
        return parseInt(value, 10);
      case 'uint64':
        return BigInt(value);
      case 'address':
        return value;
      default:
        return null;
    }
  } catch {
    return null;
  }
}

/**
 * Validate contract address
 */
export function validateContractAddress(address: string): { valid: boolean; error?: string } {
  if (!address) {
    return { valid: false, error: 'Contract address is required' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: 'Invalid contract address format' };
  }

  return { valid: true };
}
