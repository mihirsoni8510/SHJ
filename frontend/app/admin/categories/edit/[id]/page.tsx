'use client';

import { use } from 'react';
import { useAdminCategory } from '@/hooks/useApi';
import CategoryForm from '@/components/admin/categories/CategoryForm';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: category, isLoading, error } = useAdminCategory(id);

    if (isLoading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
    );

    if (error || !category) return (
        <div className="p-20 text-center text-red-500">
            Category not found or error loading data.
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
                <p className="text-gray-500">Update collection details and banner.</p>
            </div>

            <CategoryForm initialData={category} isEditing />
        </div>
    );
}
