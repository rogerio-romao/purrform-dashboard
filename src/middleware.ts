import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// 1. Specify public routes
const publicRoutes = ['/login', '/', '/breeder-certificate'];

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = !publicRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    // 3. Decrypt session from the cookie
    const cookie = cookies().get('session')?.value;
    const session = await decrypt(cookie);

    // 4. Redirect to login if session is not valid
    if (isProtectedRoute && !session?.role) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // Role-specific dashboard access
    if (session?.role === 'bookkeeper' && isProtectedRoute) {
        if (path !== '/dashboard/trader-credit') {
            // If 'bookkeeper' role tries to access any dashboard page other than trader-credit, redirect them
            return NextResponse.redirect(
                new URL('/dashboard/trader-credit', req.nextUrl)
            );
        }
    }

    // 5. Redirect to dashboard if session is valid
    if (
        isPublicRoute &&
        session?.role &&
        !path.includes('dashboard') &&
        !path.includes('breeder-certificate')
    ) {
        // If user is 'bookkeeper', redirect to their specific page, otherwise to general dashboard
        const redirectUrl =
            session.role === 'bookkeeper'
                ? '/dashboard/trader-credit'
                : '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, req.nextUrl));
    }

    // If user is on '/' and logged in, redirect them to their respective dashboard
    if (path === '/' && session?.role) {
        const redirectUrl =
            session.role === 'bookkeeper'
                ? '/dashboard/trader-credit'
                : '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, req.nextUrl));
    }

    // 6. Continue to the next middleware
    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
