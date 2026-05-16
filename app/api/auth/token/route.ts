import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tokenResponse = await auth.api.getToken({
      headers: await headers(),
    });

    return Response.json(tokenResponse);
  } catch (error) {
    console.error('Token endpoint error:', error);
    return Response.json(
      { error: 'Failed to retrieve token' },
      { status: 500 }
    );
  }
}
