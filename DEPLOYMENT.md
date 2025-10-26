# Deployment Guide

This guide walks you through deploying the FHEVM SDK project and examples.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask or compatible wallet
- ETH for deployment (testnet or mainnet)

## Step 1: Install Dependencies

From the root directory:

```bash
# Install all dependencies
npm install

# Or install separately
npm run install:all
```

## Step 2: Build SDK

```bash
npm run build:sdk
```

This compiles the TypeScript SDK to JavaScript.

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
ETHERSCAN_API_KEY=your_api_key
```

## Step 4: Compile Contracts

```bash
npm run compile
```

This compiles the Solidity contracts using Hardhat.

## Step 5: Deploy Contracts

### Local Development

Terminal 1 - Start local node:
```bash
npm run node
```

Terminal 2 - Deploy:
```bash
npm run deploy:localhost
```

### Sepolia Testnet

```bash
npm run deploy:sepolia
```

Save the deployed contract address!

## Step 6: Configure Examples

Update each example's environment with the contract address:

### Next.js
```bash
cd examples/nextjs
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

### Node.js
```bash
cd examples/nodejs
cp .env.example .env
```

Edit `.env`:
```
CONTRACT_ADDRESS=0xYourContractAddress
RPC_URL=http://localhost:8545
```

## Step 7: Run Examples

### Next.js
```bash
npm run dev:nextjs
```
Visit http://localhost:3000

### React
```bash
npm run dev:react
```
Visit http://localhost:5173

### Node.js
```bash
npm run dev:nodejs
```

## Deployment Checklist

- [ ] Dependencies installed
- [ ] SDK built successfully
- [ ] Environment configured
- [ ] Contracts compiled
- [ ] Contracts deployed
- [ ] Contract addresses updated in examples
- [ ] Examples tested locally

## Production Deployment

### Frontend (Next.js)

1. Build:
```bash
cd examples/nextjs
npm run build
```

2. Deploy to Vercel:
```bash
vercel deploy
```

Or use the Vercel dashboard to deploy from GitHub.

### Environment Variables on Vercel

Add in Vercel dashboard:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

## Verify Contracts

After deployment to testnet/mainnet:

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## Troubleshooting

### Build Errors

- Ensure Node.js >= 18
- Clear cache: `npm run clean && rm -rf node_modules && npm install`

### Deployment Fails

- Check account has sufficient ETH
- Verify RPC URL is correct
- Check private key format (with 0x prefix)

### Frontend Issues

- Ensure contract address is correct
- Check MetaMask is connected to correct network
- Verify SDK is built: `cd packages/fhevm-sdk && npm run build`

## Network Support

The SDK supports:

- **Localhost**: Hardhat node for development
- **Sepolia**: Ethereum testnet
- **Mainnet**: Production (configure in hardhat.config.js)

## Security Notes

- Never commit `.env` files
- Use hardware wallet for mainnet deployments
- Audit contracts before mainnet deployment
- Test thoroughly on testnet first

## Support

For deployment issues, check:
1. Hardhat documentation
2. FHEVM documentation
3. GitHub issues
