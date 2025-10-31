/**
 * useFHE Hook
 * Main hook for accessing FHE functionality
 */

'use client';

import { useFhevm } from 'fhevm-sdk/react';
import { useCallback, useState } from 'react';
import type { FhevmClient } from 'fhevm-sdk';

export interface UseFHEReturn {
  client: FhevmClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  publicKey: string | null;
  error: Error | null;
  reinitialize: () => Promise<void>;
}

/**
 * Access FHE client and initialization state
 */
export function useFHE(): UseFHEReturn {
  const { client, instance, publicKey, isInitialized, isInitializing } = useFhevm();
  const [error, setError] = useState<Error | null>(null);

  const reinitialize = useCallback(async () => {
    if (!client) {
      setError(new Error('Client not available'));
      return;
    }

    try {
      setError(null);
      await client.initialize();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reinitialize'));
    }
  }, [client]);

  return {
    client,
    isInitialized,
    isInitializing,
    publicKey,
    error,
    reinitialize,
  };
}
