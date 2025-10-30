import { JsonRpcProvider, Wallet } from 'ethers';
import { FhevmClient } from 'fhevm-sdk';
import dotenv from 'dotenv';

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  console.log('FHEVM Node.js Example - Encryption Service\n');

  // Setup provider
  const provider = new JsonRpcProvider(RPC_URL);

  let wallet;
  if (PRIVATE_KEY) {
    wallet = new Wallet(PRIVATE_KEY, provider);
    console.log('Using wallet:', wallet.address);
  } else {
    console.log('Warning: No private key provided. Using provider only.');
  }

  // Initialize FHEVM client
  console.log('\nInitializing FHEVM client...');
  const client = new FhevmClient({
    provider,
    contractAddress: CONTRACT_ADDRESS,
  });

  await client.initialize();
  console.log('✓ FHEVM client initialized');
  console.log('Public key:', client.getPublicKey().slice(0, 40) + '...');

  // Example 1: Encrypt different types
  console.log('\n--- Example 1: Encrypting Different Types ---');

  const encryptedBool = client.encryptBool(true);
  console.log('Encrypted boolean (true):', '0x' + Buffer.from(encryptedBool).toString('hex').slice(0, 40) + '...');

  const encryptedUint8 = client.encryptUint8(42);
  console.log('Encrypted uint8 (42):', '0x' + Buffer.from(encryptedUint8).toString('hex').slice(0, 40) + '...');

  const encryptedUint32 = client.encryptUint32(123456);
  console.log('Encrypted uint32 (123456):', '0x' + Buffer.from(encryptedUint32).toString('hex').slice(0, 40) + '...');

  // Example 2: Create encrypted input for multiple values
  console.log('\n--- Example 2: Encrypted Input Builder ---');

  const userAddress = wallet ? wallet.address : '0x0000000000000000000000000000000000000000';
  const input = client.createEncryptedInput(userAddress);

  input.addBool(true);
  input.add32(100);
  input.add32(200);

  const { handles, inputProof } = input.encrypt();
  console.log('Encrypted input with 3 values:');
  console.log('  Handles count:', handles.length);
  console.log('  Input proof:', inputProof.slice(0, 40) + '...');

  // Example 3: Utility functions
  console.log('\n--- Example 3: Utility Functions ---');

  const { encryptedToHex, isValidAddress } = await import('fhevm-sdk');

  const hexValue = encryptedToHex(encryptedUint32);
  console.log('Hex representation:', hexValue.slice(0, 40) + '...');

  const validAddress = isValidAddress(CONTRACT_ADDRESS);
  console.log('Is valid address:', validAddress);

  console.log('\n✓ All examples completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\nError:', error.message);
    process.exit(1);
  });
