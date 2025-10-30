import { useState, useCallback } from 'react';
import { useFhevm } from './FhevmProvider';
import { encryptedToHex } from '../utils/encryption';

/**
 * Hook for encrypting values with FHEVM
 *
 * @example
 * ```tsx
 * const { encrypt, isEncrypting, encrypted, error } = useFhevmEncrypt();
 * const handleEncrypt = () => encrypt('uint32', 42);
 * ```
 */
export function useFhevmEncrypt() {
  const { client, isInitialized } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encrypted, setEncrypted] = useState<Uint8Array | null>(null);
  const [encryptedHex, setEncryptedHex] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (type: string, value: any) => {
      if (!isInitialized || !client) {
        setError(new Error('FHEVM client not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        let result: Uint8Array;

        switch (type) {
          case 'bool':
            result = client.encryptBool(value);
            break;
          case 'uint8':
            result = client.encryptUint8(value);
            break;
          case 'uint16':
            result = client.encryptUint16(value);
            break;
          case 'uint32':
            result = client.encryptUint32(value);
            break;
          case 'uint64':
            result = client.encryptUint64(value);
            break;
          case 'address':
            result = client.encryptAddress(value);
            break;
          default:
            throw new Error(`Unsupported type: ${type}`);
        }

        setEncrypted(result);
        setEncryptedHex(encryptedToHex(result));
        return result;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  const reset = useCallback(() => {
    setEncrypted(null);
    setEncryptedHex(null);
    setError(null);
  }, []);

  return {
    encrypt,
    isEncrypting,
    encrypted,
    encryptedHex,
    error,
    reset,
  };
}
