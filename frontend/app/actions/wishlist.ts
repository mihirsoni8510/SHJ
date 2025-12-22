'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser, getGuestId } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getWishlistAction() {
    try {
        const user = await getCurrentUser();
        const guestId = !user ? await getGuestId() : null;

        const wishlistItems = await (prisma.wishlistItem as any).findMany({
            where: user ? { userId: user.id } : { guestId: guestId },
            include: { product: true },
        });

        return { wishlistItems: JSON.parse(JSON.stringify(wishlistItems)) };
    } catch (error) {
        console.error('Get wishlist action error:', error);
        return { wishlistItems: [], error: 'Internal server error' };
    }
}

export async function addToWishlistAction(productId: string) {
    try {
        const user = await getCurrentUser();
        const guestId = !user ? await getGuestId() : null;

        const existingItem = await (prisma.wishlistItem as any).findFirst({
            where: user ? { userId: user.id, productId } : { guestId: guestId, productId },
        });

        if (!existingItem) {
            await (prisma.wishlistItem as any).create({
                data: {
                    ...(user ? { userId: user.id } : { guestId: guestId }),
                    productId,
                },
            });
        }

        revalidatePath('/wishlist');
        return { success: true };
    } catch (error) {
        console.error('Add to wishlist action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function removeFromWishlistAction(productId: string) {
    try {
        const user = await getCurrentUser();
        const guestId = !user ? await getGuestId() : null;

        const existingItem = await (prisma.wishlistItem as any).findFirst({
            where: user ? { userId: user.id, productId } : { guestId: guestId, productId },
        });

        if (existingItem) {
            await (prisma.wishlistItem as any).delete({
                where: { id: existingItem.id },
            });
        }

        revalidatePath('/wishlist');
        return { success: true };
    } catch (error) {
        console.error('Remove from wishlist action error:', error);
        return { error: 'Internal server error' };
    }
}
