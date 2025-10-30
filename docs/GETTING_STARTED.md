# Getting Started with FHEVM SDK

This guide will help you get started with the FHEVM SDK in your project.

## Installation

### From Monorepo (Development)

1. Clone the repository:
```bash
git clone <repository-url>
cd fhevm-react-template
```

2. Install dependencies:
```bash
npm install
```

3. Build the SDK:
```bash
cd packages/fhevm-sdk
npm run build
```

### As a Package (Production)

Once published to npm:

```bash
npm install fhevm-sdk
```

## Quick Start

### 1. Framework-Agnostic Usage

```typescript
import { FhevmClient } from 'fhevm-sdk';
import { BrowserProvider } from 'ethers';

// Initialize provider
const provider = new BrowserProvider(window.ethereum);

// Create client
const client = new FhevmClient({
  provider,
  contractAddress: '0x...',
});

// Initialize
await client.initialize();

// Encrypt
const encrypted = client.encryptUint32(42);

// Decrypt (requires user signature)
const decrypted = await client.userDecrypt({
  ciphertext: encrypted,
  contractAddress: '0x...',
  userAddress: '0x...',
});
```

### 2. React/Next.js Usage

```tsx
import { FhevmProvider, useFhevm, useFhevmEncrypt } from 'fhevm-sdk/react';

// Wrap your app
function App() {
  const provider = new BrowserProvider(window.ethereum);

  return (
    <FhevmProvider
      config={{
        provider,
        contractAddress: '0x...',
      }}
      autoInitialize={true}
    >
      <YourApp />
    </FhevmProvider>
  );
}

// Use in components
function EncryptComponent() {
  const { isInitialized } = useFhevm();
  const { encrypt, encrypted, isEncrypting } = useFhevmEncrypt();

  const handleEncrypt = async () => {
    await encrypt('uint32', 42);
  };

  return (
    <div>
      <button onClick={handleEncrypt} disabled={isEncrypting}>
        Encrypt
      </button>
      {encrypted && <p>Encrypted: {encrypted.length} bytes</p>}
    </div>
  );
}
```

### 3. Node.js Backend Usage

```javascript
import { FhevmClient } from 'fhevm-sdk';
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('http://localhost:8545');
const client = new FhevmClient({
  provider,
  contractAddress: '0x...',
});

await client.initialize();

// Encrypt on server
const encrypted = client.encryptBool(true);
```

## Core Concepts

### 1. Initialization

The FHE client must be initialized before encryption:

```typescript
await client.initialize();
```

This loads the FHEVM instance and public key.

### 2. Encryption

Encrypt values before sending to smart contracts:

```typescript
// Different types
const bool = client.encryptBool(true);
const num8 = client.encryptUint8(42);
const num32 = client.encryptUint32(1000);
const addr = client.encryptAddress('0x...');
```

### 3. Decryption

Two types of decryption:

**User Decryption** (requires signature):
```typescript
const value = await client.userDecrypt({
  ciphertext: encrypted,
  contractAddress: '0x...',
  userAddress: account,
});
```

**Public Decryption** (for revealed values):
```typescript
const value = await client.publicDecrypt(contractAddress, ciphertext);
```

### 4. Multiple Values

Encrypt multiple values together:

```typescript
const input = client.createEncryptedInput(userAddress);
input.addBool(true);
input.addUint32(42);
input.addAddress('0x...');

const { encrypted, proof } = input.encrypt();
```

## Smart Contract Integration

### 1. Setup Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

contract MyContract {
    ebool private encryptedFlag;
    euint32 private encryptedValue;

    function setValues(bytes calldata encryptedBool, bytes calldata encryptedUint) public {
        encryptedFlag = TFHE.asEbool(encryptedBool);
        encryptedValue = TFHE.asEuint32(encryptedUint);
    }
}
```

### 2. Send Encrypted Data

```typescript
import { Contract } from 'ethers';

const contract = new Contract(address, abi, signer);

// Encrypt values
const encBool = client.encryptBool(true);
const encUint = client.encryptUint32(100);

// Send to contract
await contract.setValues(encBool, encUint);
```

### 3. Decrypt Results

```typescript
// Request decryption permission
const decrypted = await client.userDecrypt({
  ciphertext: await contract.getEncryptedValue(),
  contractAddress: contract.address,
  userAddress: account,
});
```

## Environment Setup

### Required Environment Variables

Create a `.env.local` file:

```bash
# Network RPC URL (optional for client-side)
NETWORK_URL=http://localhost:8545

# Contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Chain ID
NEXT_PUBLIC_CHAIN_ID=9000
```

### For Next.js

```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};
```

## Common Patterns

### Wallet Connection

```typescript
import { BrowserProvider } from 'ethers';

async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();

  return { provider, signer };
}
```

### Error Handling

```typescript
try {
  await client.initialize();
  const encrypted = client.encryptUint32(value);
} catch (error) {
  if (error.message.includes('not initialized')) {
    console.error('Client not initialized');
  } else {
    console.error('Encryption failed:', error);
  }
}
```

### Loading States

```typescript
function Component() {
  const { isInitializing, isInitialized } = useFhevm();

  if (isInitializing) {
    return <div>Loading FHE...</div>;
  }

  if (!isInitialized) {
    return <div>FHE not initialized</div>;
  }

  return <div>Ready!</div>;
}
```

## Next Steps

1. ✅ **Explore Examples**: Check `/examples` directory for complete apps
2. 📚 **Read API Docs**: See [API.md](./API.md) for detailed API reference
3. 🚀 **Deploy Contracts**: Use `/contracts` and `/scripts` to deploy FHE contracts
4. 🎨 **Build Your App**: Start building with the SDK!

## Troubleshooting

### "Instance not initialized"

Make sure to call `await client.initialize()` before encryption.

### "User denied signature"

User must sign EIP-712 message for decryption. This is expected behavior.

### webpack errors in Next.js

Add the webpack configuration shown in Environment Setup.

### "Cannot find module 'fhevm-sdk/react'"

Make sure the SDK is built: `cd packages/fhevm-sdk && npm run build`

## Support

- 📖 Full documentation in `/docs`
- 💻 Example projects in `/examples`
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions
