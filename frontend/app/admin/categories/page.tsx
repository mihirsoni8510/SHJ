'use client';

import { useCategories, useDeleteCategory } from '@/hooks/useApi';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminCategoriesPage() {
    const { data: categories = [], isLoading } = useCategories();
    const deleteCategory = useDeleteCategory();

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category? All products in this category will be affected.')) {
            await deleteCategory.mutateAsync(id);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
                    <p className="text-gray-500">Organize your products into meaningful collections.</p>
                </div>
                <Link
                    href="/admin/categories/add"
                    className="btn btn-primary flex items-center gap-2 w-fit px-6 py-2.5"
                >
                    <FiPlus />
                    Add New Category
                </Link>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center text-gray-500">Loading categories...</div>
                ) : categories.length === 0 ? (
                    <div className="p-20 text-center text-gray-500">No categories found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <th className="px-6 py-4 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-semibold">Slug</th>
                                    <th className="px-6 py-4 font-semibold">Description</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                                                    {category.image ? (
                                                        <Image
                                                            src={category.image}
                                                            alt={category.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold bg-amber-50 text-amber-500">
                                                            {category.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{category.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-500">{category.slug}</td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                            {category.description || 'No description provided.'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/categories/edit/${category.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Edit Category"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Category"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
