/**
 * Decryption API Route
 * Handles public decryption operations (for revealed values)
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeServerFheClient, serverPublicDecrypt } from '@/lib/fhe/server';

let cachedClient: any = null;

async function getFheClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const networkUrl = process.env.NETWORK_URL || 'http://localhost:8545';
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

  cachedClient = await initializeServerFheClient(networkUrl, contractAddress);
  return cachedClient;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ciphertext, contractAddress } = body;

    if (!ciphertext || !contractAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: ciphertext and contractAddress' },
        { status: 400 }
      );
    }

    const client = await getFheClient();
    const result = await serverPublicDecrypt(client, contractAddress, ciphertext);

    return NextResponse.json({
      success: true,
      decrypted: result.toString(),
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to decrypt' },
      { status: 500 }
    );
  }
}
