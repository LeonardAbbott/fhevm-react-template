import { useState, useCallback } from 'react';
import { useFhevm } from './FhevmProvider';
import type { DecryptRequest } from '../types';

/**
 * Hook for decrypting values with FHEVM
 *
 * @example
 * ```tsx
 * const { decrypt, isDecrypting, decrypted, error } = useFhevmDecrypt();
 * const handleDecrypt = () => decrypt({ ciphertext, contractAddress, userAddress });
 * ```
 */
export function useFhevmDecrypt() {
  const { client, isInitialized } = useFhevm();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decrypted, setDecrypted] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const decrypt = useCallback(
    async (request: DecryptRequest) => {
      if (!isInitialized || !client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const result = await client.userDecrypt(request);
        setDecrypted(result.value);
        return result.value;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  const reset = useCallback(() => {
    setDecrypted(null);
    setError(null);
  }, []);

  return {
    decrypt,
    isDecrypting,
    decrypted,
    error,
    reset,
  };
}
