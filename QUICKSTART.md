# Quick Start Guide

Get up and running with FHEVM SDK in minutes!

## TL;DR - 5 Minute Setup

```bash
# 1. Install dependencies
npm install
npm run install:all

# 2. Build SDK
npm run build:sdk

# 3. Compile contracts
npm run compile

# 4. Start local blockchain (Terminal 1)
npm run node

# 5. Deploy contracts (Terminal 2)
npm run deploy:localhost

# 6. Run Next.js example (Terminal 3)
cd examples/nextjs
cp .env.example .env.local
# Edit .env.local with contract address from step 5
npm run dev

# Visit http://localhost:3000
```

## Usage in Your Project

### 1. Install SDK

```bash
npm install fhevm-sdk ethers fhevmjs
```

### 2. Basic Usage (Any Framework)

```typescript
import { FhevmClient } from 'fhevm-sdk';
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const client = new FhevmClient({
  provider,
  contractAddress: '0x...',
});

await client.initialize();
const encrypted = client.encryptUint32(42);
```

### 3. React/Next.js Usage

```tsx
import { FhevmProvider, useFhevmEncrypt } from 'fhevm-sdk/react';

<FhevmProvider config={{ provider, contractAddress }}>
  <App />
</FhevmProvider>

function App() {
  const { encrypt } = useFhevmEncrypt();
  const result = await encrypt('uint32', 42);
}
```

### 4. Node.js Backend

```javascript
import { FhevmClient } from 'fhevm-sdk';

const client = new FhevmClient({ provider, contractAddress });
await client.initialize();
const encrypted = client.encryptBool(true);
```

## What's Included

- ✅ Universal FHEVM SDK (`packages/fhevm-sdk`)
- ✅ Next.js example with voting app
- ✅ React example with encryption demo
- ✅ Node.js backend example
- ✅ Smart contracts for private voting
- ✅ Deployment scripts
- ✅ Comprehensive documentation

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Explore [examples/](./examples/) for usage patterns
- View SDK docs in [packages/fhevm-sdk/README.md](./packages/fhevm-sdk/README.md)

## Common Issues

**Build fails?**
```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
```

**SDK not found in examples?**
```bash
npm run build:sdk
```

**MetaMask connection issues?**
- Make sure you're on the correct network
- Check contract address in .env files

## Support

Open an issue on GitHub for help!
