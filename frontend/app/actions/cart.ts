'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getCartAction() {
    try {
        const user = await getCurrentUser();
        if (!user) return { cartItems: [] };

        const cartItems = await prisma.cartItem.findMany({
            where: { userId: user.id },
            include: { product: true },
        });

        return { cartItems: JSON.parse(JSON.stringify(cartItems)) };
    } catch (error) {
        console.error('Get cart action error:', error);
        return { cartItems: [], error: 'Internal server error' };
    }
}

export async function addToCartAction(productId: string, quantity: number = 1) {
    try {
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        const existingItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    userId: user.id,
                    productId,
                    quantity,
                },
            });
        }

        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Add to cart action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function updateCartAction(productId: string, quantity: number) {
    try {
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        if (quantity <= 0) {
            await prisma.cartItem.delete({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId,
                    },
                },
            });
        } else {
            await prisma.cartItem.update({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId,
                    },
                },
                data: { quantity },
            });
        }

        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Update cart action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function removeFromCartAction(productId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        await prisma.cartItem.delete({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Remove from cart action error:', error);
        return { error: 'Internal server error' };
    }
}
