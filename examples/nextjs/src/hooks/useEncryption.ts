/**
 * useEncryption Hook
 * Simplified encryption operations
 */

'use client';

import { useFhevmEncrypt } from 'fhevm-sdk/react';
import { useCallback, useState } from 'react';
import type { EncryptedType } from '../lib/fhe/types';

export interface UseEncryptionReturn {
  encrypt: (type: EncryptedType, value: number | boolean | string | bigint) => Promise<Uint8Array | null>;
  encryptBatch: (items: Array<{ type: EncryptedType; value: number | boolean | string | bigint }>) => Promise<Uint8Array[]>;
  isEncrypting: boolean;
  encrypted: Uint8Array | null;
  encryptedHex: string | null;
  error: Error | null;
  reset: () => void;
}

/**
 * Hook for encrypting values
 */
export function useEncryption(): UseEncryptionReturn {
  const { encrypt: sdkEncrypt, isEncrypting, encrypted, encryptedHex, error: sdkError, reset } = useFhevmEncrypt();
  const [batchError, setBatchError] = useState<Error | null>(null);
  const [isBatchEncrypting, setIsBatchEncrypting] = useState(false);

  const encrypt = useCallback(
    async (type: EncryptedType, value: number | boolean | string | bigint) => {
      try {
        return await sdkEncrypt(type, value);
      } catch (err) {
        console.error('Encryption failed:', err);
        return null;
      }
    },
    [sdkEncrypt]
  );

  const encryptBatch = useCallback(
    async (items: Array<{ type: EncryptedType; value: number | boolean | string | bigint }>) => {
      setIsBatchEncrypting(true);
      setBatchError(null);
      const results: Uint8Array[] = [];

      try {
        for (const item of items) {
          const result = await sdkEncrypt(item.type, item.value);
          if (result) {
            results.push(result);
          }
        }
        return results;
      } catch (err) {
        setBatchError(err instanceof Error ? err : new Error('Batch encryption failed'));
        return [];
      } finally {
        setIsBatchEncrypting(false);
      }
    },
    [sdkEncrypt]
  );

  return {
    encrypt,
    encryptBatch,
    isEncrypting: isEncrypting || isBatchEncrypting,
    encrypted,
    encryptedHex,
    error: sdkError || batchError,
    reset,
  };
}
