import { SessionPayload } from '@/app/lib/definitions';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import 'server-only';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
const EXPIRES_DAYS = 2;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${EXPIRES_DAYS}d`)
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.log('Failed to verify session');
    }
}

export async function createSession(role: SessionPayload['role']) {
    const expiresAt = new Date(Date.now() + EXPIRES_DAYS * DAY_IN_MS);
    const session = await encrypt({ role, expiresAt });

    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function updateSession() {
    const session = cookies().get('session')?.value;
    if (!session) return;

    const payload = await decrypt(session);
    if (!payload) return;

    const expiresAt = new Date(Date.now() + EXPIRES_DAYS * DAY_IN_MS);
    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export function deleteSession() {
    cookies().delete('session');
}

export async function getSessionRole(): Promise<SessionPayload['role'] | null> {
    const cookie = cookies().get('session')?.value;
    if (!cookie) {
        return null;
    }
    const session = await decrypt(cookie);

    // Check if role is a valid value (admin, bookkeeper) before returning it
    const role = session?.role;
    return role === 'admin' || role === 'bookkeeper' ? role : null;
}
