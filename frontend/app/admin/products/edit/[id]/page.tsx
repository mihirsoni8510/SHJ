'use client';

import { useAdminProduct } from '@/hooks/useApi';
import ProductForm from '@/components/admin/products/ProductForm';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: product, isLoading, error } = useAdminProduct(id);

    if (isLoading) return <div className="p-20 text-center text-gray-500">Loading product details...</div>;
    if (error || !product) return <div className="p-20 text-center text-red-500">Error loading product. Please try again.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-500">Update product information and pricing.</p>
            </div>

            <ProductForm initialData={product} isEditing={true} />
        </div>
    );
}
