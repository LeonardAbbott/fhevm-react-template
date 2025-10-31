/**
 * Security Utilities
 * Security-related helper functions
 */

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sanitize hex string
 */
export function sanitizeHex(hex: string): string {
  return hex.startsWith('0x') ? hex : `0x${hex}`;
}

/**
 * Validate hex string
 */
export function isValidHex(hex: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(hex);
}

/**
 * Convert bytes to hex
 */
export function bytesToHex(bytes: Uint8Array): string {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleaned = hex.replace('0x', '');
  const bytes = new Uint8Array(cleaned.length / 2);

  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }

  return bytes;
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (!isValidAddress(address)) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Validate encrypted data
 */
export function isValidEncryptedData(data: Uint8Array): boolean {
  return data && data.length > 0;
}
