'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { User, Product, CartItem, WishlistItem, Category, Order } from '@/lib/types';

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

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userData: { name: string; phone?: string }) => {
            const { data } = await api.patch('/auth/me', userData);
            return data.user;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Profile updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update profile');
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

export function useAdminProducts() {
    return useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const { data } = await api.get('/admin/products');
            return data.products as Product[];
        },
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productData: Partial<Product>) => {
            const { data } = await api.post('/admin/products', productData);
            return data.product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully!');
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data: productData }: { id: string; data: Partial<Product> }) => {
            const { data } = await api.patch(`/admin/products/${id}`, productData);
            return data.product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product updated successfully!');
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully!');
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

export function useAdminProduct(id: string) {
    return useQuery({
        queryKey: ['admin-product', id],
        queryFn: async () => {
            const { data } = await api.get(`/admin/products/${id}`);
            return data.product as Product;
        },
        enabled: !!id,
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

// Admin Orders hooks
export function useAdminOrders() {
    return useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const { data } = await api.get('/admin/orders');
            return data.orders as Order[];
        },
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { data } = await api.patch(`/admin/orders/${id}`, { status });
            return data.order;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            toast.success('Order status updated!');
        },
    });
}

export function useAdminCategory(id: string) {
    return useQuery({
        queryKey: ['admin-category', id],
        queryFn: async () => {
            const { data } = await api.get(`/admin/categories/${id}`);
            return data.category as Category;
        },
        enabled: !!id,
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

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryData: Partial<Category>) => {
            const { data } = await api.post('/admin/categories', categoryData);
            return data.category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully!');
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data: categoryData }: { id: string; data: Partial<Category> }) => {
            const { data } = await api.patch(`/admin/categories/${id}`, categoryData);
            return data.category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully!');
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully!');
        },
    });
}

// Admin Users hooks
export function useAdminUsers() {
    return useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const { data } = await api.get('/admin/users');
            return data.users as User[];
        },
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, role }: { id: string; role: string }) => {
            const { data } = await api.patch('/admin/users', { id, role });
            return data.user;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success('User role updated!');
        },
    });
}
