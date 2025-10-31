/**
 * Key Manager Component
 * Display and manage FHE public keys
 */

'use client';

import React, { useState } from 'react';
import { useFHE } from '@/hooks/useFHE';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const KeyManager: React.FC = () => {
  const { publicKey, isInitialized, isInitializing, reinitialize, error } = useFHE();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await reinitialize();
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      alert('Public key copied to clipboard!');
    }
  };

  return (
    <Card title="Key Management" subtitle="FHE public key information">
      <div className="space-y-4">
        {/* Status */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                isInitialized ? 'bg-green-500' : isInitializing ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
            />
            <span className="text-sm">
              {isInitialized
                ? 'Initialized'
                : isInitializing
                ? 'Initializing...'
                : 'Not Initialized'}
            </span>
          </div>
        </div>

        {/* Public Key */}
        {publicKey && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Public Key</h4>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs font-mono break-all text-gray-800">{publicKey}</p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="secondary" onClick={copyToClipboard}>
                Copy Key
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleRefresh}
                isLoading={isRefreshing}
              >
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">Error: {error.message}</p>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">About FHE Keys</h4>
          <p className="text-xs text-blue-700">
            The public key is used to encrypt data on the client side. Only the FHEVM instance
            can decrypt and process the encrypted data. User signatures are required for
            decryption operations.
          </p>
        </div>
      </div>
    </Card>
  );
};
