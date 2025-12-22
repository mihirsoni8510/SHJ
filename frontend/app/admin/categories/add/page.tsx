'use client';

import CategoryForm from '@/components/admin/categories/CategoryForm';

export default function NewCategoryPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
                <p className="text-gray-500">Create a new collection for your jewellery.</p>
            </div>

            <CategoryForm />
        </div>
    );
}
