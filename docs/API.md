# API Documentation

Complete API reference for the FHEVM SDK.

## Core Client

### `FhevmClient`

The main client for all FHE operations.

#### Constructor

```typescript
new FhevmClient(config: FhevmConfig)
```

**Parameters:**
- `config.provider` - Ethers provider (BrowserProvider or JsonRpcProvider)
- `config.contractAddress` - Contract address for FHE operations

#### Methods

##### `initialize(): Promise<void>`

Initialize the FHE instance. Must be called before encryption operations.

```typescript
await client.initialize();
```

##### `encryptBool(value: boolean): Uint8Array`

Encrypt a boolean value.

```typescript
const encrypted = client.encryptBool(true);
```

##### `encryptUint8(value: number): Uint8Array`

Encrypt an 8-bit unsigned integer (0-255).

```typescript
const encrypted = client.encryptUint8(42);
```

##### `encryptUint16(value: number): Uint8Array`

Encrypt a 16-bit unsigned integer (0-65535).

```typescript
const encrypted = client.encryptUint16(1000);
```

##### `encryptUint32(value: number): Uint8Array`

Encrypt a 32-bit unsigned integer (0-4294967295).

```typescript
const encrypted = client.encryptUint32(100000);
```

##### `encryptUint64(value: bigint): Uint8Array`

Encrypt a 64-bit unsigned integer.

```typescript
const encrypted = client.encryptUint64(1000000000000n);
```

##### `encryptAddress(value: string): Uint8Array`

Encrypt an Ethereum address.

```typescript
const encrypted = client.encryptAddress('0x...');
```

##### `createEncryptedInput(userAddress: string): EncryptedInput`

Create a builder for multiple encrypted values.

```typescript
const input = client.createEncryptedInput(userAddress);
input.addBool(true);
input.addUint32(42);
const encrypted = input.encrypt();
```

##### `userDecrypt(request: DecryptionRequest): Promise<bigint>`

Decrypt with user's EIP-712 signature.

```typescript
const decrypted = await client.userDecrypt({
  ciphertext: encrypted,
  contractAddress: '0x...',
  userAddress: '0x...',
});
```

##### `publicDecrypt(address: string, ciphertext: Uint8Array): Promise<bigint>`

Decrypt public values (for revealed ciphertexts).

```typescript
const value = await client.publicDecrypt(contractAddress, ciphertext);
```

##### `getPublicKey(): string`

Get the public key for encryption.

```typescript
const publicKey = client.getPublicKey();
```

## React Hooks

### `useFhevm()`

Access the global FHEVM context.

**Returns:**
```typescript
{
  client: FhevmClient | null;
  instance: FhevmInstance | null;
  publicKey: string | null;
  isInitialized: boolean;
  isInitializing: boolean;
}
```

**Usage:**
```typescript
const { client, isInitialized } = useFhevm();
```

### `useFhevmEncrypt()`

Encrypt values with state management.

**Returns:**
```typescript
{
  encrypt: (type: EncryptedType, value: any) => Promise<Uint8Array | null>;
  isEncrypting: boolean;
  encrypted: Uint8Array | null;
  encryptedHex: string | null;
  error: Error | null;
  reset: () => void;
}
```

**Usage:**
```typescript
const { encrypt, isEncrypting, encrypted } = useFhevmEncrypt();

const handleEncrypt = async () => {
  await encrypt('uint32', 42);
};
```

### `useFhevmDecrypt()`

Decrypt values with state management.

**Returns:**
```typescript
{
  decrypt: (request: DecryptionRequest) => Promise<bigint | null>;
  isDecrypting: boolean;
  decrypted: bigint | null;
  error: Error | null;
  reset: () => void;
}
```

**Usage:**
```typescript
const { decrypt, isDecrypting, decrypted } = useFhevmDecrypt();

const handleDecrypt = async () => {
  await decrypt({
    ciphertext: encrypted,
    contractAddress: '0x...',
    userAddress: account,
  });
};
```

## Utility Functions

### `encryptedToHex(data: Uint8Array): string`

Convert encrypted data to hex string.

```typescript
const hex = encryptedToHex(encrypted);
// Returns: "0x..."
```

### `hexToUint8Array(hex: string): Uint8Array`

Convert hex string to Uint8Array.

```typescript
const bytes = hexToUint8Array('0x...');
```

### `isValidAddress(address: string): boolean`

Validate Ethereum address format.

```typescript
if (isValidAddress(address)) {
  // Valid address
}
```

### `truncateAddress(address: string, chars?: number): string`

Truncate address for display.

```typescript
const short = truncateAddress('0x1234...', 4);
// Returns: "0x1234...5678"
```

## Types

### `EncryptedType`

```typescript
type EncryptedType = 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address';
```

### `FhevmConfig`

```typescript
interface FhevmConfig {
  provider: BrowserProvider | JsonRpcProvider;
  contractAddress: string;
  networkUrl?: string;
}
```

### `DecryptionRequest`

```typescript
interface DecryptionRequest {
  ciphertext: Uint8Array | string;
  contractAddress: string;
  userAddress: string;
}
```

## Error Handling

All async operations may throw errors. Always wrap in try-catch:

```typescript
try {
  const encrypted = await encrypt('uint32', 42);
} catch (error) {
  console.error('Encryption failed:', error);
}
```

## Best Practices

1. **Initialize once**: Call `initialize()` once when the app starts
2. **Reuse client**: Don't create multiple FhevmClient instances
3. **Use hooks**: In React, prefer hooks over direct client usage
4. **Validate inputs**: Always validate values before encryption
5. **Handle errors**: Encryption/decryption can fail, handle gracefully
6. **User signatures**: Decryption requires user interaction (EIP-712)

## Examples

See the `/examples` directory for complete working examples in different frameworks.
