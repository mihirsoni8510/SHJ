'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import {
    hashPassword,
    verifyPassword,
    generateToken,
    setAuthCookie,
    removeAuthCookie,
    getCurrentUser,
    getGuestId
} from '@/lib/auth';

export async function logoutAction() {
    await removeAuthCookie();
    return { success: true };
}

export async function getMeAction() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { user: null };

        const user = await prisma.user.findUnique({
            where: { id: currentUser.id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return { user };
    } catch (error) {
        console.error('Get me action error:', error);
        return { user: null };
    }
}

export async function updateProfileAction(userData: { name: string; phone?: string }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { error: 'Unauthorized' };

        const user = await prisma.user.update({
            where: { id: currentUser.id },
            data: userData,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return { success: true, user };
    } catch (error) {
        console.error('Update profile action error:', error);
        return { error: 'Failed to update profile' };
    }
}
