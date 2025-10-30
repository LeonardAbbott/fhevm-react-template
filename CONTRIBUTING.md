# Contributing to FHEVM SDK

Thank you for your interest in contributing! This project was created for the FHEVM SDK competition.

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Build SDK: `npm run build:sdk`
5. Make your changes
6. Test your changes
7. Submit a pull request

## Project Structure

```
fhevm-react-template/
├── packages/fhevm-sdk/    # Core SDK (main focus)
├── examples/              # Usage examples
├── contracts/             # Smart contracts
└── scripts/               # Deployment scripts
```

## SDK Development

The SDK is in `packages/fhevm-sdk/`:

- `src/core/` - Core FHE client
- `src/react/` - React hooks
- `src/utils/` - Utility functions
- `src/types.ts` - TypeScript types

### Making Changes

1. Edit TypeScript files in `src/`
2. Build: `npm run build`
3. Test in examples

### Adding Features

- Keep API consistent with wagmi patterns
- Maintain framework-agnostic core
- Add TypeScript types
- Update documentation

## Example Development

Examples demonstrate SDK usage:

- **Next.js** (required) - Full-featured app
- **React** - Simple demo
- **Node.js** - Backend usage

## Code Style

- TypeScript for all new code
- Use ESLint configuration
- Follow existing patterns
- Add comments for complex logic

## Testing

Run tests:
```bash
npm test
```

## Documentation

Update documentation when:
- Adding new features
- Changing API
- Adding examples

## Pull Request Process

1. Update README if needed
2. Update CHANGELOG
3. Ensure builds pass
4. Request review

## Questions?

Open an issue for discussion.
