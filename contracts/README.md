# Smart Contracts

This directory contains the Solidity smart contracts used in the FHEVM SDK examples.

## PrivateVoting.sol

A privacy-preserving voting contract that demonstrates FHE capabilities.

### Features

- **Encrypted Voting**: Votes are encrypted using FHE before submission
- **Proposal Management**: Create and manage voting proposals
- **Voter Registration**: Owner can register eligible voters
- **Vote Delegation**: Transfer voting power to trusted delegates
- **Privacy Preservation**: Vote choices remain encrypted on-chain
- **Secure Results**: Only owner can decrypt final tallies after deadline

### Contract Functions

#### Proposal Management
```solidity
createProposal(string description) → uint256
getProposal(uint256 proposalId) → (description, deadline, active)
closeProposal(uint256 proposalId)
```

#### Voting
```solidity
vote(uint256 proposalId, bool isYes, bytes inputProof)
hasVoted(uint256 proposalId, address voter) → bool
```

#### Delegation
```solidity
delegateVote(address delegate)
revokeDelegation()
getDelegation(address voter) → (delegate, active)
```

#### Results
```solidity
getProposalResults(uint256 proposalId, bytes32 publicKey, bytes signature)
  → (uint32 yesVotes, uint32 noVotes)
getEncryptedVotes(uint256 proposalId)
  → (bytes32 encryptedYes, bytes32 encryptedNo)
```

### Usage Example

```javascript
import { Contract } from 'ethers';

// Create proposal
const tx = await contract.createProposal("Should we upgrade?");
await tx.wait();

// Vote with encrypted value
const encrypted = client.encryptBool(true);
const voteTx = await contract.vote(0, true, encrypted);
await voteTx.wait();

// Get results (owner only, after deadline)
const [yes, no] = await contract.getProposalResults(
  0,
  publicKey,
  signature
);
```

### Security Features

- Access control with OpenZeppelin's Ownable
- Voter registration required
- Double-vote prevention
- Deadline enforcement
- Encrypted vote storage
- Signature-based decryption

### Testing

Run contract tests:
```bash
npx hardhat test
```

### Deployment

Deploy to local network:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

Deploy to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### ABI

The contract ABI is generated in `artifacts/contracts/PrivateVoting.sol/PrivateVoting.json` after compilation.

Import in frontend:
```typescript
import PrivateVotingABI from '../artifacts/contracts/PrivateVoting.sol/PrivateVoting.json';
```

## Development

### Compile
```bash
npx hardhat compile
```

### Clean
```bash
npx hardhat clean
```

### Verify (after deployment)
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## Notes

This contract is adapted from a working privacy voting implementation and demonstrates real-world FHE usage patterns.
