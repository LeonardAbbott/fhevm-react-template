# Privacy Voting DApp - FHEVM SDK Integration Example

This example demonstrates a complete privacy-preserving voting system integrated with the FHEVM SDK. It's imported from a working implementation and showcases real-world usage of encrypted voting.

## 🎯 Overview

This dApp is a **real-world example** imported from an existing privacy voting implementation, demonstrating:

- **Full FHEVM SDK Integration**: Complete encryption/decryption workflow
- **Privacy-Preserving Voting**: All votes encrypted using FHE
- **Vote Delegation**: Delegate voting power while maintaining privacy
- **On-Chain Governance**: Real smart contract interaction on Sepolia testnet

## 📋 Features

### Core Functionality
- ✅ Wallet connection with MetaMask
- ✅ FHEVM SDK initialization
- ✅ Voter registration on-chain
- ✅ Create voting proposals
- ✅ Cast encrypted votes
- ✅ Delegate voting power
- ✅ Revoke delegation

### Privacy Features
- 🔐 **Vote Encryption**: Votes encrypted using FHEVM SDK before submission
- 🔐 **Private Delegation**: Delegation maintains privacy
- 🔐 **Encrypted Storage**: All votes stored encrypted on-chain
- 🔐 **Secure Decryption**: Only authorized parties can decrypt results

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Configuration

```bash
cp .env.example .env
```

Edit `.env` with your contract address:
```
VITE_CONTRACT_ADDRESS=0xYourContractAddress
```

### Run Development Server

```bash
npm run dev
```

Visit http://localhost:3001

## 💻 Usage

### 1. Connect Wallet

Click "Connect Wallet & Initialize FHEVM" to:
- Connect MetaMask
- Switch to Sepolia testnet
- Initialize FHEVM SDK
- Load user data

### 2. Register as Voter

First-time users must register:
```javascript
// Automatically handled by the UI
await contract.registerVoter(userAddress);
```

### 3. Vote on Proposals

Cast encrypted votes:
```javascript
// Encrypt vote using FHEVM SDK
const encryptedVote = fhevmClient.encryptBool(isYes);

// Submit to blockchain
await contract.vote(proposalId, isYes, encryptedVote);
```

### 4. Delegate Voting Power (Optional)

Transfer voting power to trusted representative:
```javascript
await contract.delegateVote(delegateAddress);
```

## 🔧 SDK Integration

### Initialize FHEVM SDK

```javascript
import { FhevmClient } from 'fhevm-sdk';

const fhevmClient = new FhevmClient({
  provider: browserProvider,
  contractAddress: CONTRACT_ADDRESS,
});

await fhevmClient.initialize();
```

### Encrypt Values

```javascript
// Encrypt boolean (vote)
const encryptedVote = fhevmClient.encryptBool(true);

// Encrypt number
const encryptedValue = fhevmClient.encryptUint32(42);
```

### Submit Encrypted Data

```javascript
// Use encrypted data in contract calls
const tx = await contract.vote(
  proposalId,
  voteChoice,
  encryptedVote  // Encrypted data from SDK
);
await tx.wait();
```

## 📁 Project Structure

```
voting-dapp/
├── src/
│   ├── main.js       # Entry point, SDK initialization
│   ├── app.js        # Main app logic
│   └── style.css     # Styling
├── index.html        # HTML template
├── package.json      # Dependencies
└── README.md         # This file
```

## 🎓 Learning Points

### FHEVM SDK Integration

This example demonstrates:

1. **Initialization**
   ```javascript
   const client = new FhevmClient({ provider, contractAddress });
   await client.initialize();
   ```

2. **Encryption**
   ```javascript
   const encrypted = client.encryptBool(value);
   ```

3. **Contract Integration**
   ```javascript
   await contract.vote(id, choice, encrypted);
   ```

### Privacy Workflow

1. User selects vote choice (Yes/No)
2. FHEVM SDK encrypts the choice locally
3. Encrypted vote submitted to blockchain
4. Vote stored encrypted on-chain
5. Results decrypted only by authorized parties

## 🌐 Smart Contract

**Network**: Ethereum Sepolia Testnet

**Contract Address**: `0xA52413121E6C22502efACF91714889f85BaA9A88`

**Features**:
- Voter registration
- Proposal creation
- Encrypted voting
- Vote delegation
- Result decryption (owner only)

## 🔑 Key Components

### Voter Registration
```javascript
function registerVoter() {
  const tx = await contract.registerVoter(userAddress);
  await tx.wait();
}
```

### Encrypted Voting
```javascript
async function vote(proposalId, isYes) {
  // Encrypt using SDK
  const encrypted = fhevmClient.encryptBool(isYes);

  // Submit to contract
  const tx = await contract.vote(proposalId, isYes, encrypted);
  await tx.wait();
}
```

### Vote Delegation
```javascript
async function delegateVote(delegateAddress) {
  const tx = await contract.delegateVote(delegateAddress);
  await tx.wait();
}
```

## 🛠 Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📝 Notes

- This is a **real implementation** imported from a working voting system
- Demonstrates **production-ready** FHEVM SDK integration
- All votes are **truly encrypted** using FHE
- Contract is deployed on **Sepolia testnet**
- Requires MetaMask and Sepolia ETH for transactions

## 🔗 Related

- **Main SDK**: `../../packages/fhevm-sdk`
- **Contract**: `../../contracts/PrivateVoting.sol`
- **Deployment**: See main project README

## 📄 License

MIT

---

**🔐 This example showcases real-world privacy-preserving voting with FHEVM SDK integration**
