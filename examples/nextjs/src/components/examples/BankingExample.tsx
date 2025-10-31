/**
 * Banking Example Component
 * Demonstrates confidential banking operations using FHE
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '@/hooks/useEncryption';
import { useFHE } from '@/hooks/useFHE';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export const BankingExample: React.FC = () => {
  const { isInitialized } = useFHE();
  const { encrypt, isEncrypting, encrypted, reset } = useEncryption();

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactionPrepared, setTransactionPrepared] = useState(false);

  const handlePrepareTransfer = async () => {
    const transferAmount = parseInt(amount, 10);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!recipient || !/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      alert('Please enter a valid recipient address');
      return;
    }

    // Encrypt the transfer amount
    const encryptedAmount = await encrypt('uint32', transferAmount);

    if (encryptedAmount) {
      setTransactionPrepared(true);
    }
  };

  const handleReset = () => {
    reset();
    setAmount('');
    setRecipient('');
    setTransactionPrepared(false);
  };

  if (!isInitialized) {
    return (
      <Card title="Banking Example">
        <p className="text-gray-600">Initializing FHE client...</p>
      </Card>
    );
  }

  return (
    <Card
      title="Confidential Banking Transfer"
      subtitle="Transfer funds with encrypted amounts"
    >
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Use Case:</strong> Transfer funds without revealing the amount on-chain.
            Only the sender, recipient, and authorized parties can decrypt the amount.
          </p>
        </div>

        <Input
          label="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          disabled={isEncrypting || transactionPrepared}
        />

        <Input
          label="Amount (tokens)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 100"
          disabled={isEncrypting || transactionPrepared}
          helperText="Amount will be encrypted before submission"
        />

        <div className="flex gap-2">
          {!transactionPrepared ? (
            <Button
              onClick={handlePrepareTransfer}
              isLoading={isEncrypting}
              disabled={!amount || !recipient}
            >
              Prepare Transfer
            </Button>
          ) : (
            <>
              <Button variant="success" disabled>
                Ready to Submit
              </Button>
              <Button onClick={handleReset} variant="secondary">
                Reset
              </Button>
            </>
          )}
        </div>

        {transactionPrepared && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✓ Transaction Prepared</h4>
            <div className="space-y-1 text-sm text-green-700">
              <p>• Amount encrypted: {amount} tokens</p>
              <p>• Recipient: {recipient.substring(0, 10)}...{recipient.substring(recipient.length - 8)}</p>
              <p>• Ready to submit to smart contract</p>
            </div>
            <p className="text-xs text-green-600 mt-3">
              Note: In a production app, this would submit to your banking smart contract
            </p>
          </div>
        )}

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Privacy Features</h4>
          <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
            <li>Transfer amounts remain encrypted on-chain</li>
            <li>Only authorized parties can decrypt balances</li>
            <li>Transaction history is visible, amounts are private</li>
            <li>Compliance checks can be performed on encrypted data</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
