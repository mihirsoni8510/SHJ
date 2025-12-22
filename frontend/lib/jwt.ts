import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const encodedKey = new TextEncoder().encode(JWT_SECRET_KEY);

export interface UserPayload {
    id: string;
    email: string;
    name: string;
    role: string;
}

export async function generateToken(user: UserPayload): Promise<string> {
    return new SignJWT({ ...user })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
    try {
        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload as unknown as UserPayload;
    } catch {
        return null;
    }
}
