'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { WishlistItem } from '@/lib/types';
import {
    getWishlistAction,
    addToWishlistAction,
    removeFromWishlistAction
} from '@/app/actions/wishlist';

export function useWishlist() {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const result = await getWishlistAction();
            return result.wishlistItems as WishlistItem[];
        },
    });
}

export function useAddToWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const result = await addToWishlistAction(productId);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Added to wishlist!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to add to wishlist');
        },
    });
}

export function useRemoveFromWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const result = await removeFromWishlistAction(productId);
            if (result.error) throw new Error(result.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Removed from wishlist');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to remove from wishlist');
        },
    });
}
