# Next.js FHEVM Example

This example demonstrates how to use the FHEVM SDK in a Next.js application for private voting.

## Features

- Private voting using FHE encryption
- Wallet connection with MetaMask
- Create and vote on proposals
- Real-time proposal status updates

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set your contract address:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Connect your MetaMask wallet
2. Wait for FHEVM initialization
3. Create a new proposal or vote on existing ones
4. Your votes are encrypted before submission!

## Integration Code

The key integration points are:

### 1. Provider Setup (app/page.tsx)
```tsx
<FhevmProvider config={{ provider, contractAddress }}>
  <VotingApp />
</FhevmProvider>
```

### 2. Using Hooks (components/VotingApp.tsx)
```tsx
const { client, isInitialized } = useFhevm();
const { encrypt } = useFhevmEncrypt();

const encryptedVote = await encrypt('bool', true);
```

## Learn More

See the main README for full SDK documentation.
