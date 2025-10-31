'use client';

import { useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';
import { FhevmProvider } from 'fhevm-sdk/react';
import VotingApp from '@/components/VotingApp';

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);
    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      setProvider(browserProvider);
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || '');
        if (accounts.length === 0) {
          setProvider(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  if (!provider || !account) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">FHEVM Private Voting</h1>
          <p className="text-gray-600 mb-8">
            A demonstration of confidential voting using Fully Homomorphic Encryption
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <FhevmProvider
      config={{
        provider,
        contractAddress: CONTRACT_ADDRESS,
      }}
      autoInitialize={true}
    >
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">FHEVM Private Voting</h1>
            <p className="text-sm text-gray-600">Connected: {account}</p>
          </div>
          <VotingApp contractAddress={CONTRACT_ADDRESS} userAddress={account} />
        </div>
      </main>
    </FhevmProvider>
  );
}
