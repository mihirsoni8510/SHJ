'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCategory, useUpdateCategory, useUploadImage } from '@/hooks/useApi';
import { FiSave, FiX, FiUpload, FiTrash2, FiLoader } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Category } from '@/lib/types';
import Image from 'next/image';

const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    slug: z.string().min(2, 'Slug is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    initialData?: Category;
    isEditing?: boolean;
}

export default function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
    const router = useRouter();
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const uploadImage = useUploadImage();
    const [image, setImage] = useState<string | null>(initialData?.image || null);
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData ? {
            name: initialData.name,
            description: initialData.description || '',
            slug: initialData.slug,
        } : {},
    });

    const onSubmit = async (data: CategoryFormData) => {
        try {
            const categoryData = { ...data, image: image || undefined };
            if (isEditing && initialData) {
                await updateCategory.mutateAsync({ id: initialData.id, data: categoryData });
            } else {
                await createCategory.mutateAsync(categoryData);
            }
            router.push('/admin/categories');
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64 = reader.result as string;
                    const url = await uploadImage.mutateAsync(base64);
                    setImage(url);
                } catch (err) {
                    console.error('Upload error:', err);
                } finally {
                    setUploading(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            setUploading(false);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setValue('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Image Upload */}
                    <div className="w-full md:w-1/3">
                        <label className="label">Category Image</label>
                        <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden group hover:border-amber-300 transition-colors">
                            {image ? (
                                <>
                                    <Image src={image} alt="Category" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImage(null)}
                                        className="absolute top-2 right-2 p-1.5 bg-white shadow-md rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-50 transition-colors">
                                    {uploading ? (
                                        <>
                                            <FiLoader className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                                            <span className="text-xs text-gray-400 font-medium">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload className="w-8 h-8 text-gray-300 mb-2" />
                                            <span className="text-xs text-gray-400 font-medium text-center px-4">Upload Banner Image</span>
                                        </>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="label">Category Name</label>
                            <input
                                {...register('name')}
                                className={`input ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="e.g. Gold Collection"
                                onChange={(e) => {
                                    register('name').onChange(e);
                                    handleNameChange(e);
                                }}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="label">URL Slug</label>
                            <input
                                {...register('slug')}
                                className={`input bg-gray-50 font-mono text-sm ${errors.slug ? 'border-red-500' : ''}`}
                                placeholder="gold-collection"
                            />
                            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                        </div>

                        <div>
                            <label className="label">Description (Optional)</label>
                            <textarea
                                {...register('description')}
                                className="input min-h-[100px] py-3"
                                placeholder="Briefly describe what's in this category..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t font-semibold">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full sm:flex-1 py-3 flex items-center justify-center gap-2 px-0"
                    >
                        <FiSave className="w-5 h-5" />
                        {isEditing ? 'Update Category' : 'Create Category'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn btn-outline w-full sm:flex-1 py-3 flex items-center justify-center gap-2 px-0"
                    >
                        <FiX className="w-5 h-5" />
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
}
