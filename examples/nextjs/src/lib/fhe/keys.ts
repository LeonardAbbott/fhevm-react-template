/**
 * Key Management
 * Handles generation, storage, and retrieval of encryption keys
 */

import type { KeyPair } from './types';

/**
 * Generate a new key pair
 */
export function generateKeyPair(): KeyPair {
  // In a real implementation, this would use proper cryptographic key generation
  // For FHE, keys are typically managed by the FHEVM instance
  return {
    publicKey: '',
    timestamp: Date.now(),
  };
}

/**
 * Store key pair in local storage
 */
export function storeKeyPair(keyPair: KeyPair): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('fhevm_keypair', JSON.stringify(keyPair));
  } catch (error) {
    console.error('Failed to store key pair:', error);
  }
}

/**
 * Retrieve key pair from local storage
 */
export function retrieveKeyPair(): KeyPair | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('fhevm_keypair');
    if (!stored) return null;

    return JSON.parse(stored) as KeyPair;
  } catch (error) {
    console.error('Failed to retrieve key pair:', error);
    return null;
  }
}

/**
 * Clear stored key pair
 */
export function clearKeyPair(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('fhevm_keypair');
  } catch (error) {
    console.error('Failed to clear key pair:', error);
  }
}

/**
 * Check if key pair is expired
 */
export function isKeyPairExpired(keyPair: KeyPair, expiryMs: number = 24 * 60 * 60 * 1000): boolean {
  const now = Date.now();
  return now - keyPair.timestamp > expiryMs;
}

/**
 * Store public key
 */
export function storePublicKey(publicKey: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('fhevm_public_key', publicKey);
  } catch (error) {
    console.error('Failed to store public key:', error);
  }
}

/**
 * Retrieve public key
 */
export function retrievePublicKey(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem('fhevm_public_key');
  } catch (error) {
    console.error('Failed to retrieve public key:', error);
    return null;
  }
}
