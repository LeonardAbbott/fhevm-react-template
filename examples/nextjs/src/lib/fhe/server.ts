/**
 * Server-side FHE Operations
 * Handles FHE operations on the backend/API routes
 */

import { FhevmClient } from 'fhevm-sdk';
import { JsonRpcProvider } from 'ethers';
import type { EncryptionRequest, EncryptionResult } from './types';

/**
 * Initialize FHE client for server environment
 */
export async function initializeServerFheClient(
  networkUrl: string,
  contractAddress: string
): Promise<FhevmClient> {
  const provider = new JsonRpcProvider(networkUrl);
  const client = new FhevmClient({
    provider,
    contractAddress,
  });

  await client.initialize();
  return client;
}

/**
 * Encrypt a value on the server
 */
export async function serverEncryptValue(
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
 * Batch encrypt on server
 */
export async function serverBatchEncrypt(
  client: FhevmClient,
  requests: EncryptionRequest[]
): Promise<EncryptionResult[]> {
  const results: EncryptionResult[] = [];

  for (const request of requests) {
    const result = await serverEncryptValue(client, request);
    results.push(result);
  }

  return results;
}

/**
 * Public decrypt (for revealed values)
 */
export async function serverPublicDecrypt(
  client: FhevmClient,
  contractAddress: string,
  ciphertext: Uint8Array | string
): Promise<bigint> {
  const cipher =
    typeof ciphertext === 'string'
      ? new Uint8Array(Buffer.from(ciphertext.replace('0x', ''), 'hex'))
      : ciphertext;

  return await client.publicDecrypt(contractAddress, cipher);
}
