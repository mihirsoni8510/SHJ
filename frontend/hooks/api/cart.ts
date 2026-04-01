'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CartItem } from '@/lib/types';
import {
    getCartAction,
    addToCartAction,
    updateCartAction,
    removeFromCartAction
} from '@/app/actions/cart';

export function useCart() {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const result = await getCartAction();
            return result.cartItems as CartItem[];
        },
    });
}

export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
            const result = await addToCartAction(productId, quantity);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Added to cart!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to add to cart');
        },
    });
}

export function useUpdateCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
            const result = await updateCartAction(productId, quantity);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update cart');
        },
    });
}

export function useRemoveFromCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const result = await removeFromCartAction(productId);
            if (result.error) throw new Error(result.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Removed from cart');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to remove from cart');
        },
    });
}
