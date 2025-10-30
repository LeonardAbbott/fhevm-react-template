import { useState, useEffect } from 'react';
import { FhevmClient } from '../core/FhevmClient';
import type { FhevmConfig } from '../types';

/**
 * Hook for managing FHEVM client instance
 *
 * @example
 * ```tsx
 * const { client, isReady, error } = useFhevmClient({ provider, contractAddress });
 * ```
 */
export function useFhevmClient(config: FhevmConfig) {
  const [client] = useState(() => new FhevmClient(config));
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        await client.initialize();
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
      }
    };

    initClient();
  }, [client]);

  return {
    client,
    isReady,
    error,
  };
}
