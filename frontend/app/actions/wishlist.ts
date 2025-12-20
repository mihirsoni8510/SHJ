'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getWishlistAction() {
    try {
        const user = await getCurrentUser();
        if (!user) return { wishlistItems: [] };

        const wishlistItems = await prisma.wishlistItem.findMany({
            where: { userId: user.id },
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
        if (!user) return { error: 'Unauthorized' };

        await prisma.wishlistItem.upsert({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
            update: {},
            create: {
                userId: user.id,
                productId,
            },
        });

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
        if (!user) return { error: 'Unauthorized' };

        await prisma.wishlistItem.delete({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        revalidatePath('/wishlist');
        return { success: true };
    } catch (error) {
        console.error('Remove from wishlist action error:', error);
        return { error: 'Internal server error' };
    }
}
