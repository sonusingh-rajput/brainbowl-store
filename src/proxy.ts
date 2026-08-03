import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ipRequestMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 10; // Maximum 10 requests
const WINDOW = 60 * 1000; // 1 Minute window

export function proxy(request: NextRequest) {
  // Safely extract IP from headers
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  // Apply rate limiting specifically to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const now = Date.now();
    const userRecord = ipRequestMap.get(ip) || { count: 0, lastReset: now };

    if (now - userRecord.lastReset > WINDOW) {
      userRecord.count = 1;
      userRecord.lastReset = now;
    } else {
      userRecord.count += 1;
    }

    ipRequestMap.set(ip, userRecord);

    if (userRecord.count > LIMIT) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }
  }

  const response = NextResponse.next();

  // Inject standard security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  matcher: '/api/:path*',
};