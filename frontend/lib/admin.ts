import { getCurrentUser } from './auth';
import { NextResponse } from 'next/server';

export async function isAdmin() {
    const user = await getCurrentUser();
    return user?.role === 'admin';
}

export async function adminOnly(handler: () => Promise<NextResponse>) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler();
}
