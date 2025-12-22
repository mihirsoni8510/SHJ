import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { generateToken as genToken, verifyToken as vtoken, UserPayload } from './jwt';

export type { UserPayload };

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export async function generateToken(user: UserPayload): Promise<string> {
    return genToken(user);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
    return vtoken(token);
}

export async function getCurrentUser(): Promise<UserPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    return verifyToken(token);
}

export async function setAuthCookie(token: string, role: string) {
    const cookieStore = await cookies();

    // Secure httpOnly cookie for the token
    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    // Non-httpOnly cookie for the role (accessible by client-side JS)
    cookieStore.set('user-role', role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('user-role');
}

export async function getGuestId(): Promise<string> {
    const cookieStore = await cookies();
    let guestId = cookieStore.get('guestId')?.value;

    if (!guestId) {
        guestId = crypto.randomUUID();
        cookieStore.set('guestId', guestId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });
    }

    return guestId;
}
