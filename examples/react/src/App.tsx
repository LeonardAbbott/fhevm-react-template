import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { FhevmProvider, useFhevmEncrypt, useFhevm } from 'fhevm-sdk/react';

function EncryptionDemo() {
  const { isInitialized, publicKey } = useFhevm();
  const { encrypt, encryptedHex, isEncrypting } = useFhevmEncrypt();
  const [value, setValue] = useState('');
  const [valueType, setValueType] = useState<'uint32' | 'bool'>('uint32');

  const handleEncrypt = async () => {
    if (!value) return;

    const parsedValue = valueType === 'bool'
      ? value.toLowerCase() === 'true'
      : parseInt(value);

    await encrypt(valueType, parsedValue);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>FHEVM Encryption Demo</h1>

      {isInitialized ? (
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Public Key: {publicKey?.slice(0, 20)}...
          </p>

          <div style={{ marginTop: '20px' }}>
            <select
              value={valueType}
              onChange={(e) => setValueType(e.target.value as any)}
              style={{ padding: '8px', marginRight: '10px' }}
            >
              <option value="uint32">Number (uint32)</option>
              <option value="bool">Boolean</option>
            </select>

            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={valueType === 'bool' ? 'true/false' : 'Enter number'}
              style={{ padding: '8px', marginRight: '10px' }}
            />

            <button
              onClick={handleEncrypt}
              disabled={isEncrypting || !value}
              style={{ padding: '8px 16px' }}
            >
              {isEncrypting ? 'Encrypting...' : 'Encrypt'}
            </button>
          </div>

          {encryptedHex && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
              <h3>Encrypted Result:</h3>
              <p style={{ wordBreak: 'break-all', fontSize: '12px' }}>
                {encryptedHex}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p>Initializing FHEVM...</p>
      )}
    </div>
  );
}

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }

    const browserProvider = new BrowserProvider(window.ethereum);
    await browserProvider.send('eth_requestAccounts', []);
    setProvider(browserProvider);
  };

  if (!provider) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>FHEVM React Example</h1>
        <button onClick={connectWallet} style={{ padding: '10px 20px', marginTop: '20px' }}>
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <FhevmProvider
      config={{
        provider,
        contractAddress: '0x0000000000000000000000000000000000000000'
      }}
    >
      <EncryptionDemo />
    </FhevmProvider>
  );
}

export default App;
