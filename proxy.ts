import { NextResponse, type NextRequest } from 'next/server';
import { rateLimit } from './lib/rate-limit';

export async function proxy(request: NextRequest) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/:path*', '/', '/login', '/signup'],
};
