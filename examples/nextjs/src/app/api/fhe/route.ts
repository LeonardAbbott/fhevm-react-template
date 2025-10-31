/**
 * FHE Operations API Route
 * Handles server-side FHE operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeServerFheClient, serverEncryptValue } from '@/lib/fhe/server';
import type { EncryptionRequest } from '@/lib/fhe/types';

// Cache FHE client to avoid re-initialization
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
    const { type, value } = body as EncryptionRequest;

    if (!type || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: type and value' },
        { status: 400 }
      );
    }

    const client = await getFheClient();
    const result = await serverEncryptValue(client, { type, value });

    return NextResponse.json({
      success: true,
      encrypted: result.hex,
      type: result.type,
    });
  } catch (error) {
    console.error('FHE operation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process FHE operation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FHE API endpoint',
    methods: ['POST'],
    description: 'Encrypt values using FHE on the server',
  });
}
