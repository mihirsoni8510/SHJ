'use client';

import ProductForm from '@/components/admin/products/ProductForm';

export default function NewProductPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-500">Create a new item in your jewellery collection.</p>
            </div>

            <ProductForm />
        </div>
    );
}
