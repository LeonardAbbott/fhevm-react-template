import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FhevmClient } from '../core/FhevmClient';
import type { FhevmConfig, FhevmInstance } from '../types';

interface FhevmContextValue {
  client: FhevmClient | null;
  instance: FhevmInstance | null;
  publicKey: string | null;
  signature: string | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
}

const FhevmContext = createContext<FhevmContextValue | undefined>(undefined);

interface FhevmProviderProps {
  config: FhevmConfig;
  children: ReactNode;
  autoInitialize?: boolean;
}

/**
 * Provider component for FHEVM SDK
 * Wrap your app with this to enable FHEVM hooks
 *
 * @example
 * ```tsx
 * <FhevmProvider config={{ provider, contractAddress }}>
 *   <App />
 * </FhevmProvider>
 * ```
 */
export function FhevmProvider({ config, children, autoInitialize = true }: FhevmProviderProps) {
  const [client] = useState(() => new FhevmClient(config));
  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialize = async () => {
    if (isInitializing || isInitialized) return;

    setIsInitializing(true);
    setError(null);

    try {
      const result = await client.initialize();
      setInstance(result.instance);
      setPublicKey(result.publicKey);
      setSignature(result.signature);
      setIsInitialized(true);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to initialize FHEVM:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (autoInitialize) {
      initialize();
    }
  }, [autoInitialize]);

  const value: FhevmContextValue = {
    client,
    instance,
    publicKey,
    signature,
    isInitialized,
    isInitializing,
    error,
    initialize,
  };

  return <FhevmContext.Provider value={value}>{children}</FhevmContext.Provider>;
}

/**
 * Hook to access FHEVM context
 * Must be used within FhevmProvider
 *
 * @example
 * ```tsx
 * const { instance, isInitialized } = useFhevm();
 * ```
 */
export function useFhevm(): FhevmContextValue {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error('useFhevm must be used within FhevmProvider');
  }
  return context;
}
