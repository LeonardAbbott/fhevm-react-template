/**
 * Encryption Demo Component
 * Interactive demo for encryption operations
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '@/hooks/useEncryption';
import { useFHE } from '@/hooks/useFHE';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { validateEncryptionValue, parseValueForType } from '@/lib/utils/validation';
import { bytesToHex } from '@/lib/utils/security';
import type { EncryptedType } from '@/lib/fhe/types';

export const EncryptionDemo: React.FC = () => {
  const { isInitialized } = useFHE();
  const { encrypt, isEncrypting, encrypted, encryptedHex, error, reset } = useEncryption();

  const [selectedType, setSelectedType] = useState<EncryptedType>('uint32');
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleEncrypt = async () => {
    setValidationError('');

    const parsedValue = parseValueForType(selectedType, inputValue);
    if (parsedValue === null) {
      setValidationError('Invalid value for selected type');
      return;
    }

    const validation = validateEncryptionValue(selectedType, parsedValue);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid value');
      return;
    }

    await encrypt(selectedType, parsedValue);
  };

  const handleReset = () => {
    reset();
    setInputValue('');
    setValidationError('');
  };

  if (!isInitialized) {
    return (
      <Card title="Encryption Demo">
        <p className="text-gray-600">Initializing FHE client...</p>
      </Card>
    );
  }

  return (
    <Card title="Encryption Demo" subtitle="Encrypt values using FHE">
      <div className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Encryption Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as EncryptedType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="bool">Boolean</option>
            <option value="uint8">Uint8 (0-255)</option>
            <option value="uint16">Uint16 (0-65535)</option>
            <option value="uint32">Uint32 (0-4294967295)</option>
            <option value="uint64">Uint64 (BigInt)</option>
            <option value="address">Address</option>
          </select>
        </div>

        {/* Value Input */}
        <Input
          label="Value to Encrypt"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={getPlaceholder(selectedType)}
          error={validationError}
          disabled={isEncrypting}
        />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleEncrypt} isLoading={isEncrypting} disabled={!inputValue}>
            Encrypt
          </Button>
          {(encrypted || error) && (
            <Button onClick={handleReset} variant="secondary">
              Reset
            </Button>
          )}
        </div>

        {/* Results */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">Error: {error.message}</p>
          </div>
        )}

        {encrypted && encryptedHex && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Encrypted Result</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-green-700 mb-1">Hex String:</p>
                <p className="text-sm font-mono bg-white p-2 rounded border border-green-300 break-all">
                  {encryptedHex}
                </p>
              </div>
              <div>
                <p className="text-xs text-green-700 mb-1">Byte Length:</p>
                <p className="text-sm font-mono bg-white p-2 rounded border border-green-300">
                  {encrypted.length} bytes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

function getPlaceholder(type: EncryptedType): string {
  switch (type) {
    case 'bool':
      return 'true or false';
    case 'uint8':
      return 'e.g., 42';
    case 'uint16':
      return 'e.g., 1000';
    case 'uint32':
      return 'e.g., 100000';
    case 'uint64':
      return 'e.g., 1000000000000';
    case 'address':
      return '0x...';
    default:
      return 'Enter value';
  }
}
