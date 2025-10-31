/**
 * Encryption API Route
 * Dedicated endpoint for encryption operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeServerFheClient, serverBatchEncrypt } from '@/lib/fhe/server';
import type { EncryptionRequest } from '@/lib/fhe/types';

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

    // Support both single and batch encryption
    const isBatch = Array.isArray(body);
    const requests: EncryptionRequest[] = isBatch ? body : [body];

    // Validate requests
    for (const req of requests) {
      if (!req.type || req.value === undefined) {
        return NextResponse.json(
          { error: 'Each request must have type and value fields' },
          { status: 400 }
        );
      }
    }

    const client = await getFheClient();
    const results = await serverBatchEncrypt(client, requests);

    const response = results.map(r => ({
      encrypted: r.hex,
      type: r.type,
    }));

    return NextResponse.json({
      success: true,
      results: isBatch ? response : response[0],
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to encrypt' },
      { status: 500 }
    );
  }
}
