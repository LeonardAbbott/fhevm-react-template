/**
 * React hooks for FHEVM SDK
 * Provides wagmi-like API for React applications
 */

// Check if React is available
let React: any;
try {
  React = require('react');
} catch {
  // React not available, hooks will throw runtime errors if used
}

export { useFhevmClient } from './useFhevmClient';
export { useFhevmEncrypt } from './useFhevmEncrypt';
export { useFhevmDecrypt } from './useFhevmDecrypt';
export { FhevmProvider, useFhevm } from './FhevmProvider';
