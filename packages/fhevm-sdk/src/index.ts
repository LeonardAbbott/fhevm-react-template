/**
 * FHEVM SDK - Universal framework-agnostic SDK for confidential frontends
 *
 * This SDK provides a simple, consistent interface for building applications
 * with Fully Homomorphic Encryption on EVM chains.
 *
 * @packageDocumentation
 */

export { FhevmClient } from './core/FhevmClient';

export type {
  FhevmConfig,
  FhevmInstance,
  InitializeResult,
  DecryptRequest,
  DecryptionResult,
  EIP712Domain,
  EncryptedInputBuilder,
  GatewayDecryptResponse,
} from './types';

export {
  encryptedToHex,
  hexToUint8Array,
  createInputProof,
  isValidAddress,
  isValidEncryptedData,
} from './utils/encryption';

export {
  createContractInstance,
  getSigner,
  getContractWithSigner,
  waitForTransaction,
  estimateGas,
} from './utils/contract';

// Re-export React hooks if in React environment
export * from './react';
