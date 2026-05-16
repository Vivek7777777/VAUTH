import { NextResponse, type NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 50;
const AUTH_ENDPOINTS_MAX_REQUESTS = 10;

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 'unknown';
}

function isAuthEndpoint(pathname: string): boolean {
  return (
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/signup') ||
    pathname.startsWith('/api/auth/sign-in') ||
    pathname.startsWith('/api/auth/sign-up') ||
    pathname.startsWith('/api/auth/reset-password') ||
    pathname.startsWith('/api/auth/forgot-password') ||
    pathname.startsWith('/api/auth/request-password-reset') ||
    pathname.startsWith('/api/auth/callback')
  );
}

function checkRateLimit(ip: string, isAuth: boolean): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  const maxRequests = isAuth ? AUTH_ENDPOINTS_MAX_REQUESTS : DEFAULT_MAX_REQUESTS;

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + DEFAULT_WINDOW_MS,
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  entry.count += 1;

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - entry.count };
}

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

export function rateLimit(request: NextRequest): NextResponse | null {
  const ip = getClientIP(request);
  const isAuth = isAuthEndpoint(request.nextUrl.pathname);
  const { allowed, remaining } = checkRateLimit(ip, isAuth);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', isAuth ? String(AUTH_ENDPOINTS_MAX_REQUESTS) : String(DEFAULT_MAX_REQUESTS));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  
  return response;
}
