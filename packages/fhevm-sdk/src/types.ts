import type { BrowserProvider, Eip1193Provider } from 'ethers';

/**
 * Configuration for initializing the FHEVM SDK
 */
export interface FhevmConfig {
  provider: BrowserProvider | Eip1193Provider;
  contractAddress: string;
  aclAddress?: string;
  network?: 'localhost' | 'sepolia' | 'mainnet';
  gatewayUrl?: string;
}

/**
 * Instance object containing FHE utilities
 */
export interface FhevmInstance {
  encrypt_bool(value: boolean): Uint8Array;
  encrypt_uint8(value: number): Uint8Array;
  encrypt_uint16(value: number): Uint8Array;
  encrypt_uint32(value: number): Uint8Array;
  encrypt_uint64(value: bigint): Uint8Array;
  encrypt_address(value: string): Uint8Array;
  getPublicKey(contractAddress: string): { publicKey: string; signature: string };
  createEncryptedInput(contractAddress: string, userAddress: string): EncryptedInputBuilder;
}

/**
 * Builder for creating encrypted inputs
 */
export interface EncryptedInputBuilder {
  add8(value: number): EncryptedInputBuilder;
  add16(value: number): EncryptedInputBuilder;
  add32(value: number): EncryptedInputBuilder;
  add64(value: bigint): EncryptedInputBuilder;
  addBool(value: boolean): EncryptedInputBuilder;
  addAddress(value: string): EncryptedInputBuilder;
  encrypt(): { handles: Uint8Array[]; inputProof: string };
}

/**
 * Result of user decryption request
 */
export interface DecryptionResult {
  value: bigint | number | boolean | string;
  success: boolean;
}

/**
 * EIP-712 domain for signing
 */
export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

/**
 * Decryption request parameters
 */
export interface DecryptRequest {
  ciphertext: Uint8Array;
  contractAddress: string;
  userAddress: string;
}

/**
 * SDK initialization result
 */
export interface InitializeResult {
  instance: FhevmInstance;
  publicKey: string;
  signature: string;
}

/**
 * Gateway response for decryption
 */
export interface GatewayDecryptResponse {
  decryptedValue: string;
  signature: string;
}
