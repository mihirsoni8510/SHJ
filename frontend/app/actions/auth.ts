'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import {
    hashPassword,
    verifyPassword,
    generateToken,
    setAuthCookie,
    removeAuthCookie,
    getCurrentUser
} from '@/lib/auth';

export async function loginAction(formData: any) {
    try {
        const { email, password } = formData;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await verifyPassword(password, user.password))) {
            return { error: 'Invalid email or password' };
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        await setAuthCookie(token);

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        };
    } catch (error) {
        console.error('Login action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function registerAction(formData: any) {
    try {
        const { name, email, password } = formData;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: 'User with this email already exists' };
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'user',
            },
        });

        const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        await setAuthCookie(token);

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        };
    } catch (error) {
        console.error('Register action error:', error);
        return { error: 'Internal server error' };
    }
}

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
