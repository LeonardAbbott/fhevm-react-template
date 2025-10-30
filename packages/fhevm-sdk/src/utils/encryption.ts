import type { FhevmInstance } from '../types';

/**
 * Utility functions for encryption operations
 */

/**
 * Convert encrypted data to hex string
 */
export function encryptedToHex(encrypted: Uint8Array): string {
  return '0x' + Array.from(encrypted)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToUint8Array(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Create input proof from encrypted values
 */
export function createInputProof(
  instance: FhevmInstance,
  contractAddress: string,
  userAddress: string,
  values: { type: string; value: any }[]
): { handles: Uint8Array[]; inputProof: string } {
  const input = instance.createEncryptedInput(contractAddress, userAddress);

  // Add each value to the input
  for (const { type, value } of values) {
    switch (type) {
      case 'bool':
        input.addBool(value);
        break;
      case 'uint8':
        input.add8(value);
        break;
      case 'uint16':
        input.add16(value);
        break;
      case 'uint32':
        input.add32(value);
        break;
      case 'uint64':
        input.add64(value);
        break;
      case 'address':
        input.addAddress(value);
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  return input.encrypt();
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate encrypted data
 */
export function isValidEncryptedData(data: Uint8Array): boolean {
  return data instanceof Uint8Array && data.length > 0;
}
