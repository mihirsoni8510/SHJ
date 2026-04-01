'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Category } from '@/lib/types';
import {
    getCategoriesAction,
    createCategoryAction,
    updateCategoryAction,
    deleteCategoryAction
} from '@/app/actions/categories';
import { getAdminCategoryAction } from '@/app/actions/admin';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const result = await getCategoriesAction();
            return result.categories as Category[];
        },
    });
}

export function useAdminCategory(id: string) {
    return useQuery({
        queryKey: ['admin-category', id],
        queryFn: async () => {
            const result = await getAdminCategoryAction(id);
            if (result.error) throw new Error(result.error);
            return result.category as Category;
        },
        enabled: !!id,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryData: Partial<Category>) => {
            const result = await createCategoryAction(categoryData);
            if (result.error) throw new Error(result.error);
            return result.category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create category');
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data: categoryData }: { id: string; data: Partial<Category> }) => {
            const result = await updateCategoryAction(id, categoryData);
            if (result.error) throw new Error(result.error);
            return result.category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update category');
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const result = await deleteCategoryAction(id);
            if (result.error) throw new Error(result.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete category');
        },
    });
}
