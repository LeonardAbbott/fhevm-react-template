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
├── templates/               # Framework templates (per bounty requirements)
│   ├── nextjs/             # Next.js template reference
│   ├── react/              # React template reference
│   ├── vue/                # Vue template reference
│   └── nodejs/             # Node.js template reference
├── examples/
│   ├── nextjs/             # Next.js example (complete with SDK integration)
│   │   └── src/
│   │       ├── app/        # Next.js App Router
│   │       ├── components/ # UI, FHE, and example components
│   │       ├── lib/        # FHE client, server, keys, types
│   │       ├── hooks/      # useFHE, useEncryption, useComputation
│   │       └── types/      # TypeScript definitions
│   ├── react/              # React + Vite example
│   ├── nodejs/             # Node.js backend example
│   └── voting-dapp/        # Real voting application
├── docs/                   # Complete documentation
│   ├── API.md             # Full API reference
│   └── GETTING_STARTED.md # Setup and usage guide
├── contracts/              # Solidity contracts
├── scripts/                # Deployment scripts
├── hardhat.config.js       # Hardhat configuration
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

#### Privacy Voting DApp (React + FHEVM SDK)
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

### Next.js - Complete FHE Integration (Primary Example)

**Comprehensive Next.js 14 application** with full SDK integration per next.md structure:

**Features:**
- ✅ Complete directory structure (app/, components/, lib/, hooks/, types/)
- ✅ FHE library files (client.ts, server.ts, keys.ts, types.ts)
- ✅ Custom React hooks (useFHE, useEncryption, useComputation)
- ✅ API routes for server-side operations (/api/fhe/, /api/keys/)
- ✅ UI components (Button, Input, Card)
- ✅ FHE components (EncryptionDemo, ComputationDemo, KeyManager)
- ✅ Example use cases (Banking, Medical Records)
- ✅ Utility functions (security, validation)

**Use Cases Demonstrated:**
- **Encryption Demo**: Interactive encryption with all supported types
- **Computation Demo**: Homomorphic computation preparation
- **Banking Example**: Confidential transfers with encrypted amounts
- **Medical Example**: Private health data with batch encryption
- **Key Management**: Public key display and management

See `examples/nextjs/` for complete code with full structure.

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

### Privacy Voting DApp - React Implementation

**Complete React-based voting system** with full privacy-preserving governance:
- React component architecture with hooks
- Wallet connection and FHEVM initialization
- Voter registration on-chain
- Create voting proposals
- Cast encrypted votes using FHEVM SDK
- Vote delegation with privacy
- Real smart contract integration on Sepolia testnet
- Modern UI with loading states and error handling

**Components:**
- App.jsx - Main application logic
- WalletConnect.jsx - Initial connection screen
- VoterRegistration.jsx - On-chain voter registration
- VoteDelegation.jsx - Delegate voting power
- VotingSection.jsx - Load and cast votes
- ProposalManagement.jsx - Create proposals
- ProposalsList.jsx - Display active proposals
- MessageDisplay.jsx - User feedback

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

- **Getting Started**: See `docs/GETTING_STARTED.md` - Complete setup guide
- **API Reference**: See `docs/API.md` - Full API documentation
- **SDK Documentation**: See `packages/fhevm-sdk/README.md`
- **Next.js Example**: See `examples/nextjs/README.md` - Complete structure with all components
- **Templates**: See `templates/README.md` - Framework template references

## 🎬 Demo

A video demonstration is included showing:
- SDK installation and setup
- Creating encrypted transactions
- Using hooks in React/Next.js
- Backend encryption service
- Complete voting workflow

See `demo.mp4` in the root directory.

## 🏆 Competition Highlights

### ✅ Bounty Requirements Met

**Core SDK Package** (`packages/fhevm-sdk/`):
- ✅ Core initialization module with FHEVM instance management
- ✅ Complete encryption/decryption utilities
- ✅ Contract interaction with ABI handling
- ✅ EIP-712 signature processing for user decryption
- ✅ Full TypeScript type definitions

**Templates Directory** (`templates/`):
- ✅ Next.js template reference (primary submission)
- ✅ React, Vue, Node.js template structure
- ✅ Complete configuration and setup guides

**Next.js Example** (`examples/nextjs/`):
- ✅ Full integration per next.md specification
- ✅ Complete src/ structure with app/, components/, lib/, hooks/
- ✅ API routes for server-side FHE operations
- ✅ Multiple use case demonstrations
- ✅ Production-ready configuration

**Documentation** (`docs/`):
- ✅ Getting Started guide
- ✅ Complete API reference
- ✅ Installation and deployment instructions
- ✅ Code examples for all use cases

**Deployment**:
- ✅ Live demo available (see demo.mp4)
- ✅ Vercel deployment configuration
- ✅ Working contracts on testnet

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
- **Innovative use cases**: Private voting, banking, medical records
- **Production ready**: Error handling, loading states, optimizations

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

This project was built for the FHEVM SDK competition. Contributions and feedback are welcome!

## 📧 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Built with ❤️ for the FHEVM community**
