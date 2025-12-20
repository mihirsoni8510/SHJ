'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { User, Product, CartItem, WishlistItem, Category } from '@/lib/types';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth hooks
export function useAuth() {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data } = await api.get('/auth/me');
            return data.user as User | null;
        },
    });
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const { data } = await api.post('/auth/login', credentials);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Logged in successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Login failed');
        },
    });
}

export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: {
            email: string;
            password: string;
            name: string;
            phone?: string;
        }) => {
            const { data } = await api.post('/auth/register', userData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Account created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Registration failed');
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await api.post('/auth/logout');
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Logged out successfully!');
        },
    });
}

// Products hooks
export function useProducts(filters?: {
    category?: string;
    search?: string;
    metal?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}) {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.category) params.append('category', filters.category);
            if (filters?.search) params.append('search', filters.search);
            if (filters?.metal) params.append('metal', filters.metal);
            if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
            if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
            if (filters?.page) params.append('page', filters.page.toString());
            if (filters?.limit) params.append('limit', filters.limit.toString());

            const { data } = await api.get(`/products?${params.toString()}`);
            return data as { products: Product[]; pagination: any };
        },
    });
}

export function useProduct(slug: string) {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const { data } = await api.get(`/products/${slug}`);
            return data.product as Product;
        },
        enabled: !!slug,
    });
}

// Cart hooks
export function useCart() {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const { data } = await api.get('/cart');
            return data.cartItems as CartItem[];
        },
    });
}

export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
            const { data } = await api.post('/cart', { productId, quantity });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Added to cart!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to add to cart');
        },
    });
}

export function useUpdateCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
            const { data } = await api.patch('/cart', { productId, quantity });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update cart');
        },
    });
}

export function useRemoveFromCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            await api.delete(`/cart?productId=${productId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Removed from cart');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to remove from cart');
        },
    });
}

// Wishlist hooks
export function useWishlist() {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const { data } = await api.get('/wishlist');
            return data.wishlistItems as WishlistItem[];
        },
    });
}

export function useAddToWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const { data } = await api.post('/wishlist', { productId });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Added to wishlist!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to add to wishlist');
        },
    });
}

export function useRemoveFromWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            await api.delete(`/wishlist?productId=${productId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Removed from wishlist');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to remove from wishlist');
        },
    });
}

// Categories hooks
export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get('/categories');
            return data.categories as Category[];
        },
    });
}
