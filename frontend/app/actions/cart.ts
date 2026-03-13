'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser, getGuestId } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getCartAction() {
    try {
        const user = await getCurrentUser();
        const guestId = !user ? await getGuestId() : null;

        const cartItems = await (prisma.cartItem as any).findMany({
            where: user ? { userId: user.id } : { guestId: guestId },
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
        const guestId = !user ? await getGuestId() : null;

        const existingItem = await (prisma.cartItem as any).findFirst({
            where: user ? { userId: user.id, productId } : { guestId: guestId, productId },
        });

        if (existingItem) {
            await (prisma.cartItem as any).update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        } else {
            await (prisma.cartItem as any).create({
                data: {
                    ...(user ? { userId: user.id } : { guestId: guestId }),
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
        const guestId = !user ? await getGuestId() : null;

        const existingItem = await (prisma.cartItem as any).findFirst({
            where: user ? { userId: user.id, productId } : { guestId: guestId, productId },
        });

        if (!existingItem) return { error: 'Item not found in cart' };

        if (quantity <= 0) {
            await (prisma.cartItem as any).delete({
                where: { id: existingItem.id },
            });
        } else {
            await (prisma.cartItem as any).update({
                where: { id: existingItem.id },
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
        const guestId = !user ? await getGuestId() : null;

        const existingItem = await (prisma.cartItem as any).findFirst({
            where: user ? { userId: user.id, productId } : { guestId: guestId, productId },
        });

        if (existingItem) {
            await (prisma.cartItem as any).delete({
                where: { id: existingItem.id },
            });
        }

        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Remove from cart action error:', error);
        return { error: 'Internal server error' };
    }
}
