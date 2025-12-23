import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { Role } from '@/lib/types';
import { getToken } from 'next-auth/jwt';

// Define the routes and their access levels
const PROTECTED_ROUTES = ['/profile'];
const ADMIN_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/auth/login'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;
    const nextAuthToken = await getToken({ req: request });

    let userPayload = null;

    // Try to verify custom token if it exists
    if (token) {
        userPayload = await verifyToken(token);
    }
    // If no custom token, check next-auth token
    else if (nextAuthToken) {
        userPayload = {
            id: nextAuthToken.sub,
            email: nextAuthToken.email,
            name: nextAuthToken.name,
            role: (nextAuthToken as any).role || 'user',
        };
    }

    // 1. Handle Admin Routes
    const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
    if (isAdminRoute) {
        if (!userPayload || userPayload.role?.toLowerCase() !== Role.ADMIN) {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 2. Handle Protected Routes
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    if (isProtectedRoute) {
        if (!userPayload) {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 3. Handle Auth Routes (Login/Register) - Redirect to home if already logged in
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
    if (isAuthRoute && userPayload) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
