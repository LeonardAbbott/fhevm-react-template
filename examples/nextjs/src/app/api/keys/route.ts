/**
 * Key Management API Route
 * Handles public key retrieval and key management
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeServerFheClient } from '@/lib/fhe/server';

let cachedClient: any = null;
let cachedPublicKey: string | null = null;

async function getFheClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const networkUrl = process.env.NETWORK_URL || 'http://localhost:8545';
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

  cachedClient = await initializeServerFheClient(networkUrl, contractAddress);
  return cachedClient;
}

export async function GET(request: NextRequest) {
  try {
    // Return cached public key if available
    if (cachedPublicKey) {
      return NextResponse.json({
        success: true,
        publicKey: cachedPublicKey,
        cached: true,
      });
    }

    const client = await getFheClient();
    const publicKey = client.getPublicKey();

    cachedPublicKey = publicKey;

    return NextResponse.json({
      success: true,
      publicKey,
      cached: false,
    });
  } catch (error) {
    console.error('Key retrieval error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve public key' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'refresh') {
      // Clear cache and get fresh key
      cachedPublicKey = null;
      cachedClient = null;

      const client = await getFheClient();
      const publicKey = client.getPublicKey();

      cachedPublicKey = publicKey;

      return NextResponse.json({
        success: true,
        publicKey,
        message: 'Public key refreshed',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use action: "refresh" to refresh the public key' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Key management error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to manage keys' },
      { status: 500 }
    );
  }
}
