import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';

let cachedJWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!cachedJWKS) {
    cachedJWKS = createRemoteJWKSet(
      new URL(`${AUTH_SERVICE_URL}/.well-known/jwks.json`),
      {
        cooldownDuration: 60 * 60 * 1000,
      }
    );
  }
  return cachedJWKS;
}

export interface VerifiedJWT extends JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
}

export async function verifyJWT(token: string): Promise<VerifiedJWT> {
  try {
    const JWKS = getJWKS();
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ['RS256'],
    });

    return payload as VerifiedJWT;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid or expired token');
  }
}

export function extractTokenFromHeader(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) return null;
  
  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  
  return token;
}

export async function verifyAuthHeader(authorizationHeader: string | null): Promise<VerifiedJWT | null> {
  const token = extractTokenFromHeader(authorizationHeader);
  if (!token) return null;
  
  try {
    return await verifyJWT(token);
  } catch {
    return null;
  }
}
