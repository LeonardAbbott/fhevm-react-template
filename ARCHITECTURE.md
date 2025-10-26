# Architecture Documentation

## System Overview

The FHEVM SDK is designed as a universal, framework-agnostic toolkit for building confidential frontends. This document explains the architecture and design decisions.

## Core Principles

1. **Framework Agnostic Core**: The base SDK has zero framework dependencies
2. **Progressive Enhancement**: Framework-specific features built on top of core
3. **Type Safety**: Full TypeScript support throughout
4. **Developer Experience**: Wagmi-like patterns for familiarity
5. **Production Ready**: Error handling, loading states, optimizations

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│           Application Layer                 │
│  (Next.js, React, Vue, Node.js apps)       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│        Framework Adapters                   │
│  (React Hooks, Vue Composables, etc.)      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Core SDK Layer                    │
│  (FhevmClient, encryption/decryption)      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         External Dependencies               │
│      (fhevmjs, ethers.js)                  │
└─────────────────────────────────────────────┘
```

## Component Architecture

### 1. Core SDK (`packages/fhevm-sdk/src/core/`)

**FhevmClient.ts**
- Central client for all FHE operations
- Manages instance lifecycle
- Provides encryption/decryption methods
- Framework-agnostic design

```typescript
class FhevmClient {
  - config: FhevmConfig
  - instance: FhevmInstance | null
  + initialize(): Promise<InitializeResult>
  + encrypt*(): Uint8Array
  + userDecrypt(): Promise<DecryptionResult>
}
```

### 2. React Integration (`packages/fhevm-sdk/src/react/`)

**FhevmProvider.tsx**
- Context provider for React apps
- Manages global FHEVM state
- Auto-initialization option
- Error boundary ready

**Hooks**:
- `useFhevm()` - Access global context
- `useFhevmEncrypt()` - Encryption with state
- `useFhevmDecrypt()` - Decryption with state
- `useFhevmClient()` - Direct client access

### 3. Utilities (`packages/fhevm-sdk/src/utils/`)

**encryption.ts**
- Data format conversions
- Input proof creation
- Validation helpers

**contract.ts**
- Contract instance creation
- Signer management
- Transaction helpers

### 4. Type System (`packages/fhevm-sdk/src/types.ts`)

Complete TypeScript definitions for:
- Configuration options
- FHE instances
- Encrypted values
- Decryption results
- EIP-712 domains

## Data Flow

### Encryption Flow

```
User Input → SDK Encrypt → Encrypted Data → Contract Call
```

```typescript
// 1. User provides value
const value = 42;

// 2. SDK encrypts
const encrypted = client.encryptUint32(value);

// 3. Encrypted data sent to contract
await contract.someFunction(encrypted);
```

### Decryption Flow

```
Encrypted Data → User Signature → Gateway → Decrypted Result
```

```typescript
// 1. Get encrypted data from contract
const ciphertext = await contract.getEncrypted();

// 2. Request user signature (EIP-712)
const result = await client.userDecrypt({
  ciphertext,
  contractAddress,
  userAddress,
});

// 3. Result available to user
console.log(result.value);
```

## State Management

### React State Flow

```
FhevmProvider (Global State)
    ↓
  Context
    ↓
useFhevm() → Component State
    ↓
UI Updates
```

**Global State**:
- FHE instance
- Public key
- Signature
- Initialization status

**Component State** (via hooks):
- Encryption results
- Decryption results
- Loading states
- Errors

## Error Handling

### Layers of Error Handling

1. **Core SDK Level**
   - Instance initialization failures
   - Encryption errors
   - Invalid parameters

2. **Framework Level**
   - React hook errors
   - Context not available errors
   - State update errors

3. **Application Level**
   - Transaction failures
   - Network errors
   - User rejections

### Error Propagation

```typescript
try {
  await client.initialize();
} catch (error) {
  // Core SDK throws descriptive errors
  // Framework layer catches and sets error state
  // Application displays to user
}
```

## Performance Optimization

### Lazy Loading

- fhevmjs loaded only when needed
- Dynamic imports for large dependencies
- Code splitting in examples

### Caching

- FHE instance cached after initialization
- Public keys stored
- Contract instances reused

### Async Operations

- All encryption/decryption async
- Non-blocking UI updates
- Loading states for user feedback

## Security Considerations

### Private Key Protection

- Never exposed in SDK
- Wallet handles signing
- EIP-712 for typed data

### Data Validation

- Address validation
- Type checking
- Range validation for numeric types

### Safe Defaults

- Auto-initialization optional
- Explicit error messages
- No silent failures

## Extensibility

### Adding New Frameworks

```typescript
// 1. Create adapter directory
packages/fhevm-sdk/src/vue/

// 2. Implement composables
export function useFhevm() {
  const client = inject('fhevmClient');
  // Vue-specific implementation
}

// 3. Export from index
export * from './vue';
```

### Adding New Features

```typescript
// 1. Add to core client
class FhevmClient {
  newFeature() {
    // Implementation
  }
}

// 2. Add hook if needed
export function useNewFeature() {
  const { client } = useFhevm();
  // React wrapper
}

// 3. Update types
export interface NewFeatureResult {
  // Type definition
}
```

## Testing Strategy

### Unit Tests
- Core SDK functions
- Utility functions
- Type validations

### Integration Tests
- React hooks with provider
- Contract interactions
- End-to-end encryption flow

### Example Tests
- Example apps build
- Contract deployment
- Full user workflows

## Build System

### SDK Build

```
TypeScript → CommonJS (dist/)
          → ESM (dist/)
          → Type Definitions (dist/)
```

### Example Builds

- **Next.js**: Next.js build system
- **React**: Vite bundler
- **Node.js**: Native ESM

## Deployment Architecture

```
├── SDK (npm package)
│   └── Published to registry
│
├── Contracts (blockchain)
│   └── Deployed to networks
│
└── Examples (applications)
    ├── Next.js → Vercel
    ├── React → Netlify/Vercel
    └── Node.js → Server/Docker
```

## Design Patterns

### Singleton Pattern
- FhevmClient per configuration
- Single instance initialization

### Provider Pattern
- React Context for global state
- Dependency injection ready

### Builder Pattern
- Encrypted input builder
- Fluent API for multi-value inputs

### Factory Pattern
- Contract instance creation
- Provider creation

## Future Architecture Considerations

### Planned Enhancements

1. **Plugin System**
   ```typescript
   client.use(plugin);
   ```

2. **Middleware Support**
   ```typescript
   client.addMiddleware(logger);
   ```

3. **Event System**
   ```typescript
   client.on('encrypted', callback);
   ```

4. **Batch Operations**
   ```typescript
   client.batchEncrypt([...values]);
   ```

## Comparison to Similar Tools

### vs. Raw fhevmjs

- ✅ Higher-level API
- ✅ Framework integrations
- ✅ State management
- ✅ Better DX

### vs. Wagmi (inspiration)

- ✅ Similar hook patterns
- ✅ Provider-based
- ✅ TypeScript first
- ➕ FHE-specific features

## Conclusion

The architecture prioritizes:
1. Developer experience
2. Type safety
3. Framework flexibility
4. Production readiness
5. Extensibility

This enables developers to build confidential applications quickly while maintaining code quality and security.
