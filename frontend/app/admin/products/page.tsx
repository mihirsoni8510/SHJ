'use client';

import { useAdminProducts, useDeleteProduct } from '@/hooks/useApi';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export default function AdminProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: products = [], isLoading } = useAdminProducts({
        search: debouncedSearch,
        category: categoryFilter
    });
    const deleteProduct = useDeleteProduct();

    const handleDelete = (id: string) => {
        toast.warning('Are you sure you want to delete this product?', {
            description: 'This action cannot be undone.',
            action: {
                label: 'Delete',
                onClick: () => deleteProduct.mutate(id)
            },
            cancel: {
                label: 'Cancel',
                onClick: () => { }
            },
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
                    <p className="text-gray-500">Manage your jewellery collection and inventory.</p>
                </div>
                <Link
                    href="/admin/products/add"
                    className="btn btn-primary flex items-center gap-2 w-fit px-6 py-2.5"
                >
                    <FiPlus />
                    Add New Product
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-amber-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all font-medium w-full sm:w-auto">
                        <FiFilter />
                        Filter
                    </button>
                    <select
                        className="w-full sm:w-auto md:w-48 bg-white border border-gray-200 rounded-lg py-2 px-3 text-gray-600 focus:ring-2 focus:ring-amber-500/20 outline-none"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="gold">Gold</option>
                        <option value="diamond">Diamond</option>
                        <option value="silver">Silver</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center text-gray-500">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="p-20 text-center text-gray-500">No products found. Add your first product!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <th className="px-6 py-4 font-semibold">Product</th>
                                    <th className="px-6 py-4 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-semibold">Price</th>
                                    <th className="px-6 py-4 font-semibold">Stock</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                                                    {product.images?.[0] ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <FiShoppingBag />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{product.name}</p>
                                                    <p className="text-gray-500 text-xs mt-0.5">#{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {typeof product.category === 'object' ? product.category.name : product.categoryId}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">₹{product.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.stock > 10 ? 'bg-gray-100' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className={`flex items-center gap-1.5 font-medium ${product.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                <span className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                                {product.isActive ? 'Active' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Edit Product"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Product"
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
