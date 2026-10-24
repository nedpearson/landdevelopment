import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Allow direct access in development / local preview
  if (process.env.AUTH_REQUIRED !== 'true') {
    return NextResponse.next();
  }
}

export const config = { 
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"] 
};
