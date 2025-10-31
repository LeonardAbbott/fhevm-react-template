# Next.js FHEVM Template

This template is located in `../../examples/nextjs/`

## Features

- ✨ Next.js 14 with App Router
- 🔐 Complete FHEVM SDK integration
- 🎣 React hooks for FHE operations
- 🚀 API routes for server-side encryption
- 💼 Multiple use case examples
- 📱 Responsive UI with Tailwind CSS

## Quick Start

```bash
cd ../../examples/nextjs
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## What's Included

### Components
- FHE Provider wrapper
- Encryption/Decryption demos
- Key management UI
- Banking example (confidential transfers)
- Medical records example (private health data)

### API Routes
- `/api/fhe` - Main FHE operations
- `/api/fhe/encrypt` - Encryption endpoint
- `/api/fhe/decrypt` - Decryption endpoint
- `/api/fhe/compute` - Computation preparation
- `/api/keys` - Key management

### Hooks
- `useFHE()` - Access FHE client
- `useEncryption()` - Encrypt values
- `useComputation()` - Homomorphic operations

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Main Project README](../../README.md)
