/**
 * Computation Demo Component
 * Demo for homomorphic computation operations
 */

'use client';

import React, { useState } from 'react';
import { useComputation, type ComputationOperation } from '@/hooks/useComputation';
import { useEncryption } from '@/hooks/useEncryption';
import { useFHE } from '@/hooks/useFHE';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { bytesToHex } from '@/lib/utils/security';

export const ComputationDemo: React.FC = () => {
  const { isInitialized } = useFHE();
  const { encrypt } = useEncryption();
  const { compute, isComputing, result, error, reset } = useComputation();

  const [operation, setOperation] = useState<ComputationOperation>('add');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operands, setOperands] = useState<Uint8Array[]>([]);

  const handlePrepareOperands = async () => {
    const num1 = parseInt(value1, 10);
    const num2 = parseInt(value2, 10);

    if (isNaN(num1) || isNaN(num2)) {
      alert('Please enter valid numbers');
      return;
    }

    const encrypted1 = await encrypt('uint32', num1);
    const encrypted2 = await encrypt('uint32', num2);

    if (encrypted1 && encrypted2) {
      setOperands([encrypted1, encrypted2]);
    }
  };

  const handleCompute = async () => {
    if (operands.length < 2) {
      alert('Please prepare operands first');
      return;
    }

    await compute({ operation, operands });
  };

  const handleReset = () => {
    reset();
    setValue1('');
    setValue2('');
    setOperands([]);
  };

  if (!isInitialized) {
    return (
      <Card title="Computation Demo">
        <p className="text-gray-600">Initializing FHE client...</p>
      </Card>
    );
  }

  return (
    <Card title="Homomorphic Computation" subtitle="Perform computations on encrypted data">
      <div className="space-y-4">
        {/* Operation Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as ComputationOperation)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="add">Addition (+)</option>
            <option value="subtract">Subtraction (-)</option>
            <option value="multiply">Multiplication (×)</option>
            <option value="compare">Comparison (==)</option>
          </select>
        </div>

        {/* Input Values */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Value 1"
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder="e.g., 10"
          />
          <Input
            label="Value 2"
            type="number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder="e.g., 20"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handlePrepareOperands} disabled={!value1 || !value2}>
            Prepare Operands
          </Button>
          {operands.length > 0 && (
            <Button onClick={handleCompute} isLoading={isComputing} variant="success">
              Compute on Chain
            </Button>
          )}
          {(result || error) && (
            <Button onClick={handleReset} variant="secondary">
              Reset
            </Button>
          )}
        </div>

        {/* Prepared Operands Status */}
        {operands.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ✓ Operands encrypted and ready for computation
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {operands.length} encrypted values prepared
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">Error: {error.message}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Computation Prepared</h4>
            <p className="text-sm text-green-700">
              The computation request has been prepared. In a real application, this would be
              submitted to the smart contract for on-chain homomorphic computation.
            </p>
            <p className="text-xs text-green-600 mt-2">
              Operation: {operation} | Result length: {result.length} bytes
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
