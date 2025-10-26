# Node.js FHEVM Example

Backend encryption service using FHEVM SDK in Node.js.

## Features

- Server-side encryption
- Support for all FHE data types
- Encrypted input builder
- Easy integration with backend services

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

Edit `.env` with your settings.

3. Run the example:
```bash
npm start
```

## Usage

```javascript
import { FhevmClient } from 'fhevm-sdk';

const client = new FhevmClient({ provider, contractAddress });
await client.initialize();

// Encrypt values
const encrypted = client.encryptUint32(42);

// Create multi-value inputs
const input = client.createEncryptedInput(userAddress);
input.add32(100);
input.add32(200);
const { handles, inputProof } = input.encrypt();
```

## Use Cases

- Backend encryption service
- Batch processing encrypted data
- API endpoints for encryption
- Testing and development scripts
