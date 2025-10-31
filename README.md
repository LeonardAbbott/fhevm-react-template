# FHEVM SDK - Universal Confidential Frontend Toolkit

A comprehensive, framework-agnostic SDK for building confidential frontends with Fully Homomorphic Encryption on EVM chains. Built for developers who want wagmi-like simplicity with complete FHE power.

## 🎯 Overview

This project provides a universal FHEVM SDK that makes building confidential applications simple, consistent, and developer-friendly across all JavaScript frameworks.

### Key Features

- ✨ **Framework Agnostic** - Works seamlessly with React, Next.js, Vue, Node.js, or vanilla JavaScript
- 🎣 **Wagmi-like API** - Familiar hooks and patterns for web3 developers
- 🔐 **Complete FHE Coverage** - Full encryption/decryption pipeline with EIP-712 signatures
- 📦 **All-in-One Package** - Single dependency wraps all required FHE packages
- 🚀 **Quick Setup** - Get started in less than 10 lines of code
- 💪 **TypeScript First** - Full type safety and IntelliSense support
- 🔧 **Developer Friendly** - Clear documentation and comprehensive examples


**🌐 Live Demo**: [https://fhe-proxy-voting.vercel.app/](https://fhe-proxy-voting.vercel.app/)  demo.mp4

## 📦 Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/           # Universal FHEVM SDK package
│       ├── src/
│       │   ├── core/        # Core FHE client
│       │   ├── react/       # React hooks
│       │   └── utils/       # Utilities
│       └── package.json
├── examples/
│   ├── nextjs/              # Next.js example (required)
│   ├── react/               # React + Vite example
│   ├── nodejs/              # Node.js backend example
│   └── voting-dapp/         # Real voting dApp (imported from working project)
├── contracts/               # Solidity contracts
├── scripts/                 # Deployment scripts
├── hardhat.config.js        # Hardhat configuration
└── package.json
```

## 🚀 Quick Start

### Installation

From the root directory:

```bash
# Install all dependencies
npm install

# Build the SDK
cd packages/fhevm-sdk
npm install
npm run build
```

### Compile and Deploy Contracts

```bash
# From root directory
npm run compile
npm run deploy:localhost    # or deploy:sepolia
```

### Run Examples

#### Next.js Example (Required)
```bash
cd examples/nextjs
npm install
npm run dev
```

#### React Example
```bash
cd examples/react
npm install
npm run dev
```

#### Node.js Example
```bash
cd examples/nodejs
npm install
npm start
```

#### Privacy Voting DApp (Imported Example)
```bash
cd examples/voting-dapp
npm install
npm run dev
```

## 💻 Usage

### Basic Framework-Agnostic Usage

```typescript
import { FhevmClient } from 'fhevm-sdk';
import { BrowserProvider } from 'ethers';

// Initialize
const provider = new BrowserProvider(window.ethereum);
const client = new FhevmClient({
  provider,
  contractAddress: '0x...',
});

await client.initialize();

// Encrypt
const encrypted = client.encryptUint32(42);

// Decrypt (with user signature)
const result = await client.userDecrypt({
  ciphertext: encrypted,
  contractAddress: '0x...',
  userAddress: '0x...',
});
```

### React/Next.js Usage

```tsx
import { FhevmProvider, useFhevm, useFhevmEncrypt } from 'fhevm-sdk/react';

// Wrap your app
<FhevmProvider config={{ provider, contractAddress }}>
  <App />
</FhevmProvider>

// Use in components
function Component() {
  const { isInitialized } = useFhevm();
  const { encrypt, encrypted } = useFhevmEncrypt();

  const handleEncrypt = async () => {
    const result = await encrypt('uint32', 42);
    // Use encrypted value in contract calls
  };
}
```

### Node.js Backend Usage

```javascript
import { FhevmClient } from 'fhevm-sdk';
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('http://localhost:8545');
const client = new FhevmClient({ provider, contractAddress });

await client.initialize();

// Encrypt server-side
const encrypted = client.encryptBool(true);
```

## 📚 SDK API Reference

### FhevmClient

Core client for all FHE operations.

#### Methods

- `initialize()` - Initialize the FHE instance (required before encryption)
- `encryptBool(value: boolean)` - Encrypt a boolean value
- `encryptUint8(value: number)` - Encrypt an 8-bit unsigned integer
- `encryptUint16(value: number)` - Encrypt a 16-bit unsigned integer
- `encryptUint32(value: number)` - Encrypt a 32-bit unsigned integer
- `encryptUint64(value: bigint)` - Encrypt a 64-bit unsigned integer
- `encryptAddress(value: string)` - Encrypt an Ethereum address
- `createEncryptedInput(userAddress)` - Create builder for multiple encrypted values
- `userDecrypt(request)` - Decrypt with user's EIP-712 signature
- `publicDecrypt(address, ciphertext)` - Decrypt public values

### React Hooks

#### `useFhevm()`
Access global FHEVM context.

```tsx
const { client, instance, publicKey, isInitialized, isInitializing } = useFhevm();
```

#### `useFhevmEncrypt()`
Encrypt values with state management.

```tsx
const { encrypt, isEncrypting, encrypted, encryptedHex, error, reset } = useFhevmEncrypt();
```

#### `useFhevmDecrypt()`
Decrypt values with state management.

```tsx
const { decrypt, isDecrypting, decrypted, error, reset } = useFhevmDecrypt();
```

### Utility Functions

```typescript
import {
  encryptedToHex,      // Convert encrypted data to hex string
  hexToUint8Array,     // Convert hex to Uint8Array
  createInputProof,    // Create multi-value input proof
  isValidAddress,      // Validate Ethereum address
  createContractInstance, // Create contract with provider
  getSigner,           // Get signer from provider
} from 'fhevm-sdk';
```

## 🎓 Examples

### Next.js - Private Voting Application

Full-featured voting app with:
- Wallet connection
- Create proposals
- Cast encrypted votes
- View proposal status

See `examples/nextjs/` for complete code.

### React - Encryption Demo

Simple encryption interface demonstrating:
- Value encryption
- Type selection
- Result display

See `examples/react/` for complete code.

### Node.js - Backend Service

Server-side encryption service:
- Batch encryption
- Multi-value inputs
- API integration ready

See `examples/nodejs/` for complete code.

### Privacy Voting DApp - Real Implementation

**Imported from working voting system** - complete privacy-preserving governance:
- Wallet connection and FHEVM initialization
- Voter registration on-chain
- Create voting proposals
- Cast encrypted votes
- Vote delegation with privacy
- Real smart contract on Sepolia testnet

See `examples/voting-dapp/` for complete code.

## 🔧 Development

### Build SDK

```bash
cd packages/fhevm-sdk
npm run build
```

### Run Tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

## 📝 Smart Contracts

The project includes a privacy-preserving voting contract:

- **PrivateVoting.sol** - FHE-compatible voting with delegation
  - Create proposals
  - Cast encrypted votes
  - Delegate voting power
  - Owner-only result decryption

## 🛠 Tech Stack

- **SDK Core**: TypeScript, fhevmjs, ethers.js
- **React Integration**: React hooks, Context API
- **Examples**: Next.js 14, React 18, Vite
- **Smart Contracts**: Solidity 0.8.20, Hardhat, OpenZeppelin
- **Build Tools**: TypeScript, ESLint, Prettier

## 📖 Documentation

- **SDK Documentation**: See `packages/fhevm-sdk/README.md`
- **Next.js Example**: See `examples/nextjs/README.md`
- **Node.js Example**: See `examples/nodejs/README.md`
- **API Reference**: Full TypeScript types in source code

## 🎬 Demo

A video demonstration is included showing:
- SDK installation and setup
- Creating encrypted transactions
- Using hooks in React/Next.js
- Backend encryption service
- Complete voting workflow

See `demo.mp4` in the root directory.

## 🏆 Competition Highlights

### Usability
- **10-line setup**: Initialize and encrypt in minimal code
- **Zero boilerplate**: Provider wrapper handles all complexity
- **Familiar patterns**: Wagmi-like hooks for web3 developers

### Completeness
- **Full FHE pipeline**: Initialize → Encrypt → Decrypt with signatures
- **All data types**: Boolean, uint8-64, addresses
- **Complete workflow**: Contract interaction to result decryption

### Reusability
- **Framework agnostic**: Core works everywhere
- **Modular design**: Use only what you need
- **Clean exports**: Well-organized public API

### Documentation
- **Comprehensive guides**: Each example fully documented
- **Type safety**: Full TypeScript support
- **Code examples**: Real-world use cases

### Creativity
- **Multiple environments**: Next.js, React, Node.js examples
- **Innovative use cases**: Private voting, encrypted delegation
- **Production ready**: Error handling, loading states, optimizations

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

This project was built for the FHEVM SDK competition. Contributions and feedback are welcome!

## 📧 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Built with ❤️ for the FHEVM community**
