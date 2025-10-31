/**
 * Client-side FHE Operations
 * Handles encryption, decryption, and FHE operations in the browser
 */

import { FhevmClient } from 'fhevm-sdk';
import type { BrowserProvider } from 'ethers';
import type {
  FhevmConfig,
  EncryptionRequest,
  EncryptionResult,
  DecryptionRequest,
  DecryptionResult,
  EncryptedType,
} from './types';

/**
 * Initialize FHE client for browser environment
 */
export async function initializeFheClient(config: FhevmConfig): Promise<FhevmClient> {
  const client = new FhevmClient({
    provider: config.provider as BrowserProvider,
    contractAddress: config.contractAddress,
  });

  await client.initialize();
  return client;
}

/**
 * Encrypt a value using the FHE client
 */
export async function encryptValue(
  client: FhevmClient,
  request: EncryptionRequest
): Promise<EncryptionResult> {
  let ciphertext: Uint8Array;

  switch (request.type) {
    case 'bool':
      ciphertext = client.encryptBool(Boolean(request.value));
      break;
    case 'uint8':
      ciphertext = client.encryptUint8(Number(request.value));
      break;
    case 'uint16':
      ciphertext = client.encryptUint16(Number(request.value));
      break;
    case 'uint32':
      ciphertext = client.encryptUint32(Number(request.value));
      break;
    case 'uint64':
      ciphertext = client.encryptUint64(BigInt(request.value));
      break;
    case 'address':
      ciphertext = client.encryptAddress(String(request.value));
      break;
    default:
      throw new Error(`Unsupported encryption type: ${request.type}`);
  }

  return {
    ciphertext,
    hex: '0x' + Buffer.from(ciphertext).toString('hex'),
    type: request.type,
  };
}

/**
 * Decrypt a value using user signature
 */
export async function decryptValue(
  client: FhevmClient,
  request: DecryptionRequest
): Promise<DecryptionResult> {
  const ciphertext =
    typeof request.ciphertext === 'string'
      ? new Uint8Array(Buffer.from(request.ciphertext.replace('0x', ''), 'hex'))
      : request.ciphertext;

  const result = await client.userDecrypt({
    ciphertext,
    contractAddress: request.contractAddress,
    userAddress: request.userAddress,
  });

  return {
    value: result,
    type: 'uint32', // Default type, should be inferred from context
  };
}

/**
 * Create encrypted input for multiple values
 */
export function createEncryptedInput(client: FhevmClient, userAddress: string) {
  return client.createEncryptedInput(userAddress);
}

/**
 * Get public key from client
 */
export function getPublicKey(client: FhevmClient): string {
  return client.getPublicKey();
}

/**
 * Encrypt multiple values at once
 */
export async function batchEncrypt(
  client: FhevmClient,
  requests: EncryptionRequest[]
): Promise<EncryptionResult[]> {
  const results: EncryptionResult[] = [];

  for (const request of requests) {
    const result = await encryptValue(client, request);
    results.push(result);
  }

  return results;
}
