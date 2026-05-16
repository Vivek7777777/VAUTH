import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const jwks = await auth.api.getJwks({
      headers: await headers(),
    });

    return Response.json(jwks, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('JWKS endpoint error:', error);
    return Response.json(
      { error: 'Failed to retrieve JWKS' },
      { status: 500 }
    );
  }
}
