/**
 * FHE Type Definitions
 * Comprehensive type definitions for FHEVM SDK integration
 */

import { BrowserProvider, JsonRpcProvider } from 'ethers';

/**
 * Supported encrypted data types
 */
export type EncryptedType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';

/**
 * FHE configuration
 */
export interface FhevmConfig {
  provider: BrowserProvider | JsonRpcProvider;
  contractAddress: string;
  networkUrl?: string;
}

/**
 * Encryption request
 */
export interface EncryptionRequest {
  type: EncryptedType;
  value: number | boolean | string | bigint;
}

/**
 * Encryption result
 */
export interface EncryptionResult {
  ciphertext: Uint8Array;
  hex: string;
  type: EncryptedType;
}

/**
 * Decryption request
 */
export interface DecryptionRequest {
  ciphertext: Uint8Array | string;
  contractAddress: string;
  userAddress: string;
}

/**
 * Decryption result
 */
export interface DecryptionResult {
  value: number | boolean | string | bigint;
  type: EncryptedType;
}

/**
 * Computation request for homomorphic operations
 */
export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'compare';
  operands: Uint8Array[];
  type: EncryptedType;
}

/**
 * Key pair for encryption
 */
export interface KeyPair {
  publicKey: string;
  privateKey?: string;
  timestamp: number;
}

/**
 * FHE instance state
 */
export interface FhevmState {
  isInitialized: boolean;
  isInitializing: boolean;
  publicKey: string | null;
  error: Error | null;
}
