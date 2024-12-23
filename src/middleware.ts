import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/', '/breeder-certificate'];

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    // 3. Decrypt session from the cookie
    const cookie = cookies().get('session')?.value;
    const session = await decrypt(cookie);

    // 4. Redirect to login if session is not valid
    if (isProtectedRoute && !session?.role) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // 5. Redirect to dashboard if session is valid
    if (
        isPublicRoute &&
        session?.role &&
        !path.includes('dashboard') &&
        !path.includes('breeder-certificate')
    ) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    // 6. Continue to the next middleware
    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
