'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategories, useCreateProduct, useUpdateProduct } from '@/hooks/useApi';
import { FiSave, FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import Image from 'next/image';

const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().min(0, 'Price must be positive'),
    salePrice: z.number().optional(),
    stock: z.number().min(0, 'Stock cannot be negative'),
    categoryId: z.string().min(1, 'Please select a category'),
    metal: z.string().optional(),
    purity: z.string().optional(),
    weight: z.number().optional(),
    isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: Product;
    isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const { data: categories = [] } = useCategories();
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();
    const [images, setImages] = useState<string[]>(initialData?.images || []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            description: initialData.description || '',
            price: initialData.price,
            salePrice: initialData.salePrice || undefined,
            stock: initialData.stock,
            categoryId: initialData.categoryId,
            metal: initialData.metal || '',
            purity: initialData.purity || '',
            weight: initialData.weight || undefined,
            isActive: initialData.isActive,
        } : {
            isActive: true,
            stock: 0,
        },
    });

    const onSubmit = async (data: ProductFormData) => {
        try {
            const productData = { ...data, images };
            if (isEditing && initialData) {
                await updateProduct.mutateAsync({ id: initialData.id, data: productData });
            } else {
                await createProduct.mutateAsync(productData);
            }
            router.push('/admin/products');
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Mock image upload - in a real app, you'd upload to Cloudinary/S3
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
            setImages((prev) => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Essential Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Product Details</h2>

                        <div>
                            <label className="label">Product Name</label>
                            <input
                                {...register('name')}
                                className={`input ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="e.g. 22K Gold Diamond Studded Bangle"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="label">Description</label>
                            <textarea
                                {...register('description')}
                                className={`input min-h-[150px] py-3 ${errors.description ? 'border-red-500' : ''}`}
                                placeholder="Describe the product details, crafting, and features..."
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Price (₹)</label>
                                <input
                                    type="number"
                                    {...register('price', { valueAsNumber: true })}
                                    className={`input ${errors.price ? 'border-red-500' : ''}`}
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                            </div>
                            <div>
                                <label className="label">Sale Price (Optional)</label>
                                <input
                                    type="number"
                                    {...register('salePrice', { valueAsNumber: true })}
                                    className="input"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Product Attributes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="label">Metal</label>
                                <select {...register('metal')} className="input">
                                    <option value="">Select Metal</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Silver">Silver</option>
                                    <option value="Diamond">Diamond Collection</option>
                                    <option value="Platinum">Platinum</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Purity</label>
                                <input {...register('purity')} className="input" placeholder="e.g. 22K, 18K, 925" />
                            </div>
                            <div>
                                <label className="label">Weight (Grams)</label>
                                <input type="number" step="0.01" {...register('weight', { valueAsNumber: true })} className="input" placeholder="0.00" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Media Gallary</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                                    <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-white shadow-md rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <label className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors aspect-square">
                                <FiUpload className="w-6 h-6 text-gray-400" />
                                <span className="text-xs text-gray-500 font-medium">Add Image</span>
                                <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Organization</h2>

                        <div>
                            <label className="label">Category</label>
                            <select
                                {...register('categoryId')}
                                className={`input ${errors.categoryId ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                        </div>

                        <div>
                            <label className="label">Stock Quantity</label>
                            <input
                                type="number"
                                {...register('stock', { valueAsNumber: true })}
                                className={`input ${errors.stock ? 'border-red-500' : ''}`}
                            />
                            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <span className="font-medium text-gray-700">Product Status</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" {...register('isActive')} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                <span className="ml-3 text-sm font-medium text-gray-600">{register('isActive') ? 'Active' : 'Draft'}</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
                        >
                            <FiSave className="w-5 h-5" />
                            {isEditing ? 'Update Product' : 'Create Product'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn btn-outline w-full py-3 flex items-center justify-center gap-2"
                        >
                            <FiX className="w-5 h-5" />
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
