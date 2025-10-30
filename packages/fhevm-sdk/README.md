# FHEVM SDK

Universal framework-agnostic SDK for building confidential frontends with Fully Homomorphic Encryption on EVM chains.

## Features

- ✨ **Framework Agnostic** - Works with React, Next.js, Vue, Node.js, or any JavaScript environment
- 🎯 **Wagmi-like API** - Familiar hooks and patterns for web3 developers
- 🔐 **Complete FHE Support** - Encryption, decryption, and encrypted computations
- 📦 **All-in-One Package** - No need to manage scattered dependencies
- 🚀 **Quick Setup** - Get started in less than 10 lines of code
- 💪 **TypeScript First** - Full type safety and IntelliSense support

## Installation

```bash
npm install fhevm-sdk ethers fhevmjs
```

## Quick Start

### Basic Usage (Framework Agnostic)

```typescript
import { FhevmClient } from 'fhevm-sdk';
import { BrowserProvider } from 'ethers';

// Initialize the client
const provider = new BrowserProvider(window.ethereum);
const client = new FhevmClient({
  provider,
  contractAddress: '0x...',
});

await client.initialize();

// Encrypt a value
const encrypted = client.encryptUint32(42);

// Decrypt a value
const result = await client.userDecrypt({
  ciphertext: encrypted,
  contractAddress: '0x...',
  userAddress: '0x...',
});
```

### React Usage

```tsx
import { FhevmProvider, useFhevm, useFhevmEncrypt } from 'fhevm-sdk/react';

// Wrap your app
function App() {
  return (
    <FhevmProvider config={{ provider, contractAddress }}>
      <YourComponent />
    </FhevmProvider>
  );
}

// Use in components
function YourComponent() {
  const { isInitialized } = useFhevm();
  const { encrypt, encrypted } = useFhevmEncrypt();

  const handleVote = async () => {
    const encryptedVote = await encrypt('bool', true);
    // Use encrypted vote in contract call
  };

  return <button onClick={handleVote}>Vote</button>;
}
```

## API Reference

### FhevmClient

Core client for FHEVM operations.

#### Methods

- `initialize()` - Initialize the FHE instance
- `encryptBool(value)` - Encrypt a boolean
- `encryptUint8(value)` - Encrypt an 8-bit unsigned integer
- `encryptUint16(value)` - Encrypt a 16-bit unsigned integer
- `encryptUint32(value)` - Encrypt a 32-bit unsigned integer
- `encryptUint64(value)` - Encrypt a 64-bit unsigned integer
- `encryptAddress(value)` - Encrypt an Ethereum address
- `userDecrypt(request)` - Decrypt with EIP-712 signature
- `publicDecrypt(address, ciphertext)` - Public decryption

### React Hooks

#### useFhevm()

Access the global FHEVM context.

```tsx
const { client, instance, publicKey, signature, isInitialized } = useFhevm();
```

#### useFhevmEncrypt()

Encrypt values with state management.

```tsx
const { encrypt, isEncrypting, encrypted, encryptedHex, error } = useFhevmEncrypt();
```

#### useFhevmDecrypt()

Decrypt values with state management.

```tsx
const { decrypt, isDecrypting, decrypted, error } = useFhevmDecrypt();
```

## Examples

See the `/examples` directory for complete examples:

- **Next.js** - Full-stack app with voting system
- **React** - Client-side encryption demo
- **Node.js** - Backend encryption service

## License

MIT
