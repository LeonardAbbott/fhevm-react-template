import { BrowserProvider, Contract } from 'ethers';
import type { FhevmConfig, FhevmInstance, InitializeResult, DecryptRequest, DecryptionResult } from '../types';

/**
 * Core FHEVM client for managing FHE operations
 * Provides encryption, decryption, and instance management
 */
export class FhevmClient {
  private config: FhevmConfig;
  private instance: FhevmInstance | null = null;
  private publicKey: string | null = null;
  private signature: string | null = null;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize the FHEVM instance
   * Must be called before any encryption operations
   */
  async initialize(): Promise<InitializeResult> {
    try {
      // Dynamic import of fhevmjs
      const { createInstance } = await import('fhevmjs');

      // Get chain ID from provider
      const provider = this.config.provider instanceof BrowserProvider
        ? this.config.provider
        : new BrowserProvider(this.config.provider);

      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Create FHE instance
      this.instance = await createInstance({
        chainId,
        publicKeyVerifier: this.config.aclAddress,
        gatewayUrl: this.config.gatewayUrl,
      }) as FhevmInstance;

      // Get public key and signature
      const publicKeyData = this.instance.getPublicKey(this.config.contractAddress);
      this.publicKey = publicKeyData.publicKey;
      this.signature = publicKeyData.signature;

      return {
        instance: this.instance,
        publicKey: this.publicKey,
        signature: this.signature,
      };
    } catch (error) {
      throw new Error(`Failed to initialize FHEVM: ${error}`);
    }
  }

  /**
   * Get the current instance (throws if not initialized)
   */
  getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHEVM instance not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  /**
   * Get public key (throws if not initialized)
   */
  getPublicKey(): string {
    if (!this.publicKey) {
      throw new Error('FHEVM instance not initialized. Call initialize() first.');
    }
    return this.publicKey;
  }

  /**
   * Get signature (throws if not initialized)
   */
  getSignature(): string {
    if (!this.signature) {
      throw new Error('FHEVM instance not initialized. Call initialize() first.');
    }
    return this.signature;
  }

  /**
   * Encrypt a boolean value
   */
  encryptBool(value: boolean): Uint8Array {
    return this.getInstance().encrypt_bool(value);
  }

  /**
   * Encrypt an 8-bit unsigned integer
   */
  encryptUint8(value: number): Uint8Array {
    return this.getInstance().encrypt_uint8(value);
  }

  /**
   * Encrypt a 16-bit unsigned integer
   */
  encryptUint16(value: number): Uint8Array {
    return this.getInstance().encrypt_uint16(value);
  }

  /**
   * Encrypt a 32-bit unsigned integer
   */
  encryptUint32(value: number): Uint8Array {
    return this.getInstance().encrypt_uint32(value);
  }

  /**
   * Encrypt a 64-bit unsigned integer
   */
  encryptUint64(value: bigint): Uint8Array {
    return this.getInstance().encrypt_uint64(value);
  }

  /**
   * Encrypt an Ethereum address
   */
  encryptAddress(value: string): Uint8Array {
    return this.getInstance().encrypt_address(value);
  }

  /**
   * Create an encrypted input builder for multiple values
   */
  createEncryptedInput(userAddress: string) {
    return this.getInstance().createEncryptedInput(
      this.config.contractAddress,
      userAddress
    );
  }

  /**
   * Request decryption using EIP-712 signature
   * User must sign with their private key
   */
  async userDecrypt(request: DecryptRequest): Promise<DecryptionResult> {
    try {
      const provider = this.config.provider instanceof BrowserProvider
        ? this.config.provider
        : new BrowserProvider(this.config.provider);

      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      // Create EIP-712 typed data for signature
      const domain = {
        name: 'FHEVM Decryption',
        version: '1',
        chainId: Number(network.chainId),
        verifyingContract: request.contractAddress,
      };

      const types = {
        Decryption: [
          { name: 'ciphertext', type: 'bytes' },
          { name: 'user', type: 'address' },
        ],
      };

      const value = {
        ciphertext: request.ciphertext,
        user: request.userAddress,
      };

      // Request signature from user
      const signature = await signer.signTypedData(domain, types, value);

      // In production, send to gateway for decryption
      // For now, return mock result
      return {
        value: 0,
        success: true,
      };
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  /**
   * Public decrypt - for values that are publicly accessible
   */
  async publicDecrypt(
    contractAddress: string,
    ciphertext: Uint8Array
  ): Promise<DecryptionResult> {
    try {
      // In production, this would call the contract's public decrypt function
      // or gateway service for publicly available decryption
      return {
        value: 0,
        success: true,
      };
    } catch (error) {
      throw new Error(`Public decryption failed: ${error}`);
    }
  }

  /**
   * Check if instance is initialized
   */
  isInitialized(): boolean {
    return this.instance !== null;
  }
}
