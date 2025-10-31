/**
 * useComputation Hook
 * Homomorphic computation operations
 */

'use client';

import { useState, useCallback } from 'react';
import { useFHE } from './useFHE';

export type ComputationOperation = 'add' | 'subtract' | 'multiply' | 'compare';

export interface ComputationRequest {
  operation: ComputationOperation;
  operands: Uint8Array[];
}

export interface UseComputationReturn {
  compute: (request: ComputationRequest) => Promise<Uint8Array | null>;
  isComputing: boolean;
  result: Uint8Array | null;
  error: Error | null;
  reset: () => void;
}

/**
 * Hook for homomorphic computations
 */
export function useComputation(): UseComputationReturn {
  const { client, isInitialized } = useFHE();
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const compute = useCallback(
    async (request: ComputationRequest): Promise<Uint8Array | null> => {
      if (!isInitialized || !client) {
        setError(new Error('FHE client not initialized'));
        return null;
      }

      setIsComputing(true);
      setError(null);

      try {
        // Note: Actual homomorphic computation would be done on-chain
        // This is a placeholder for client-side preparation
        // The actual computation happens in the smart contract

        console.log('Preparing computation:', request.operation);
        console.log('Operands:', request.operands.length);

        // For demonstration, we'll just return the first operand
        // In a real implementation, you would prepare the transaction data
        // and send it to the contract for computation

        const computationResult = request.operands[0];
        setResult(computationResult);
        return computationResult;
      } catch (err) {
        const errorMsg = err instanceof Error ? err : new Error('Computation failed');
        setError(errorMsg);
        return null;
      } finally {
        setIsComputing(false);
      }
    },
    [client, isInitialized]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    compute,
    isComputing,
    result,
    error,
    reset,
  };
}
