'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';
import {
    getProductsAction,
    getProductBySlugAction,
    createProductAction,
    updateProductAction,
    deleteProductAction
} from '@/app/actions/products';
import { uploadImageAction } from '@/app/actions/upload';
import { getAdminProductsAction, getAdminProductAction } from '@/app/actions/admin';

export function useProducts(filters?: {
    category?: string;
    search?: string;
    metal?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
}) {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: async () => {
            const result = await getProductsAction(filters);
            return result as { products: Product[]; pagination: any };
        },
    });
}

export function useAdminProducts(filters?: { category?: string; search?: string }) {
    return useQuery({
        queryKey: ['admin-products', filters],
        queryFn: async () => {
            const result = await getAdminProductsAction(filters);
            return result.products as Product[];
        },
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productData: Partial<Product>) => {
            const result = await createProductAction(productData);
            if (result.error) throw new Error(result.error);
            return result.product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create product');
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data: productData }: { id: string; data: Partial<Product> }) => {
            const result = await updateProductAction(id, productData);
            if (result.error) throw new Error(result.error);
            return result.product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update product');
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const result = await deleteProductAction(id);
            if (result.error) throw new Error(result.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete product');
        },
    });
}

export function useProduct(slug: string) {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const result = await getProductBySlugAction(slug);
            if (result.error) throw new Error(result.error);
            return result.product as Product;
        },
        enabled: !!slug,
    });
}

export function useAdminProduct(id: string) {
    return useQuery({
        queryKey: ['admin-product', id],
        queryFn: async () => {
            const result = await getAdminProductAction(id);
            if (result.error) throw new Error(result.error);
            return result.product as Product;
        },
        enabled: !!id,
    });
}

export function useUploadImage() {
    return useMutation({
        mutationFn: async (base64: string) => {
            const result = await uploadImageAction(base64);
            if (result.error) throw new Error(result.error);
            return result.url as string;
        },
    });
}
