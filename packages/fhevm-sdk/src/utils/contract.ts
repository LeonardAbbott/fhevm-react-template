import { Contract, type BrowserProvider } from 'ethers';

/**
 * Contract interaction utilities
 */

/**
 * Create a contract instance with provider
 */
export function createContractInstance(
  address: string,
  abi: any[],
  provider: BrowserProvider
): Contract {
  return new Contract(address, abi, provider);
}

/**
 * Get signer from provider
 */
export async function getSigner(provider: BrowserProvider) {
  return await provider.getSigner();
}

/**
 * Get contract with signer (for write operations)
 */
export async function getContractWithSigner(
  address: string,
  abi: any[],
  provider: BrowserProvider
): Promise<Contract> {
  const signer = await getSigner(provider);
  return new Contract(address, abi, signer);
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  txHash: string,
  provider: BrowserProvider,
  confirmations: number = 1
) {
  const receipt = await provider.waitForTransaction(txHash, confirmations);
  return receipt;
}

/**
 * Estimate gas for transaction
 */
export async function estimateGas(
  contract: Contract,
  method: string,
  ...args: any[]
): Promise<bigint> {
  const gasEstimate = await contract[method].estimateGas(...args);
  return gasEstimate;
}
