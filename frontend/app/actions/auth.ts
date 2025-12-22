'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/mail';
import {
    hashPassword,
    verifyPassword,
    generateToken,
    setAuthCookie,
    removeAuthCookie,
    getCurrentUser,
    getGuestId
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

        const token = await generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        await setAuthCookie(token, user.role);

        // Merge guest items
        const cookieStore = await cookies();
        const guestId = cookieStore.get('guestId')?.value;
        if (guestId) {
            // Merge Cart
            await (prisma.cartItem as any).updateMany({
                where: { guestId },
                data: { userId: user.id, guestId: null },
            });

            // Merge Wishlist (avoid duplicates)
            const guestWishlist = await (prisma.wishlistItem as any).findMany({
                where: { guestId },
            });

            for (const item of guestWishlist) {
                const existing = await (prisma.wishlistItem as any).findFirst({
                    where: { userId: user.id, productId: item.productId },
                });
                if (!existing) {
                    await (prisma.wishlistItem as any).update({
                        where: { id: item.id },
                        data: { userId: user.id, guestId: null },
                    });
                } else {
                    await (prisma.wishlistItem as any).delete({ where: { id: item.id } });
                }
            }
            cookieStore.delete('guestId');
        }

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

        const token = await generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        await setAuthCookie(token, user.role);

        // Merge guest items
        const cookieStore = await cookies();
        const guestId = cookieStore.get('guestId')?.value;
        if (guestId) {
            await (prisma.cartItem as any).updateMany({
                where: { guestId },
                data: { userId: user.id, guestId: null },
            });

            const guestWishlist = await (prisma.wishlistItem as any).findMany({
                where: { guestId },
            });

            for (const item of guestWishlist) {
                const existing = await (prisma.wishlistItem as any).findFirst({
                    where: { userId: user.id, productId: item.productId },
                });
                if (!existing) {
                    await (prisma.wishlistItem as any).update({
                        where: { id: item.id },
                        data: { userId: user.id, guestId: null },
                    });
                } else {
                    await (prisma.wishlistItem as any).delete({ where: { id: item.id } });
                }
            }
            cookieStore.delete('guestId');
        }

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

export async function forgotPasswordAction(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // For security, don't reveal if user exists
            return { success: true, message: 'If an account exists with that email, we have sent a reset link.' };
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        // Save to DB (cleanup old tokens first)
        await (prisma as any).passwordResetToken.deleteMany({
            where: { userId: user.id },
        });

        await (prisma as any).passwordResetToken.create({
            data: {
                token,
                expires,
                userId: user.id,
            },
        });

        // Send email
        await sendPasswordResetEmail(email, token);

        return { success: true, message: 'If an account exists with that email, we have sent a reset link.' };
    } catch (error) {
        console.error('Forgot password action error:', error);
        return { error: 'Failed to process request' };
    }
}

export async function resetPasswordAction(data: { token: string; password: string }) {
    try {
        const { token, password } = data;

        // Find token and check expiration
        const resetToken = await (prisma as any).passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken || resetToken.expires < new Date()) {
            return { error: 'Invalid or expired reset token' };
        }

        // Update password
        const hashedPassword = await hashPassword(password);
        await prisma.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword },
        });

        // Delete used token
        await (prisma as any).passwordResetToken.delete({
            where: { id: resetToken.id },
        });

        return { success: true, message: 'Password has been reset successfully.' };
    } catch (error) {
        console.error('Reset password action error:', error);
        return { error: 'Failed to reset password' };
    }
}
