'use client';

import { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import { useFhevm, useFhevmEncrypt } from 'fhevm-sdk/react';

const VOTING_ABI = [
  'function createProposal(string calldata description) external returns (uint256)',
  'function vote(uint256 proposalId, bool isYes, bytes calldata inputProof) external',
  'function getProposal(uint256 proposalId) external view returns (string memory description, uint256 deadline, bool active)',
  'function proposalCount() external view returns (uint256)',
  'function hasVoted(uint256 proposalId, address voter) external view returns (bool)',
];

interface VotingAppProps {
  contractAddress: string;
  userAddress: string;
}

export default function VotingApp({ contractAddress, userAddress }: VotingAppProps) {
  const { client, isInitialized, isInitializing } = useFhevm();
  const { encrypt, isEncrypting } = useFhevmEncrypt();

  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newProposalDesc, setNewProposalDesc] = useState('');

  const getContract = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(contractAddress, VOTING_ABI, signer);
  };

  const loadProposals = async () => {
    if (!isInitialized) return;

    setIsLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(contractAddress, VOTING_ABI, provider);

      const count = await contract.proposalCount();
      const proposalData = [];

      for (let i = 0; i < Number(count); i++) {
        const proposal = await contract.getProposal(i);
        const hasVoted = await contract.hasVoted(i, userAddress);
        proposalData.push({
          id: i,
          description: proposal[0],
          deadline: new Date(Number(proposal[1]) * 1000),
          active: proposal[2],
          hasVoted,
        });
      }

      setProposals(proposalData);
    } catch (error) {
      console.error('Failed to load proposals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      loadProposals();
    }
  }, [isInitialized]);

  const handleCreateProposal = async () => {
    if (!newProposalDesc.trim()) {
      alert('Please enter a proposal description');
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.createProposal(newProposalDesc);
      await tx.wait();

      setNewProposalDesc('');
      await loadProposals();
      alert('Proposal created successfully!');
    } catch (error) {
      console.error('Failed to create proposal:', error);
      alert('Failed to create proposal');
    }
  };

  const handleVote = async (proposalId: number, isYes: boolean) => {
    if (!client) return;

    try {
      const encryptedVote = await encrypt('bool', isYes);
      if (!encryptedVote) {
        throw new Error('Failed to encrypt vote');
      }

      const contract = await getContract();
      const tx = await contract.vote(proposalId, isYes, encryptedVote);
      await tx.wait();

      await loadProposals();
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to submit vote');
    }
  };

  if (isInitializing) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Initializing FHEVM...</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to initialize FHEVM</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Create New Proposal</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newProposalDesc}
            onChange={(e) => setNewProposalDesc(e.target.value)}
            placeholder="Enter proposal description"
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={handleCreateProposal}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Active Proposals</h2>
        {isLoading ? (
          <p>Loading proposals...</p>
        ) : proposals.length === 0 ? (
          <p className="text-gray-500">No proposals yet</p>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-2">{proposal.description}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Deadline: {proposal.deadline.toLocaleString()}
                  {proposal.hasVoted && ' • You have voted'}
                </p>
                {proposal.active && !proposal.hasVoted && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleVote(proposal.id, true)}
                      disabled={isEncrypting}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                      Vote Yes
                    </button>
                    <button
                      onClick={() => handleVote(proposal.id, false)}
                      disabled={isEncrypting}
                      className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                      Vote No
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
