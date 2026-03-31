'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts, useCategories } from '@/hooks/useApi';
import ProductCard from '@/components/ProductCard';
import { FiFilter, FiSearch, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';

function ProductsContent() {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const metalParam = searchParams.get('metal');
    const [sortBy, setSortBy] = useState('newest');

    const { data, isLoading } = useProducts({
        category: categorySlug || undefined,
        search: searchQuery || undefined,
        metal: metalParam || undefined,
        sort: sortBy,
        limit: 20
    });

    const { data: categories = [] } = useCategories();
    const activeCategory = categories.find(c => c.slug === categorySlug);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header / Breadcrumbs */}
            <div className="bg-white border-b border-gray-200 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Link href="/" className="hover:text-amber-600">Home</Link>
                        <FiChevronRight className="w-3 h-3" />
                        <span className="text-gray-900 font-medium">
                            {activeCategory ? activeCategory.name : 'All Products'}
                        </span>
                    </nav>
                    <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                        {activeCategory ? activeCategory.name : 'Our Collection'}
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-2xl">
                        {activeCategory?.description || 'Discover our wide range of handcrafted jewelry, from traditional gold ornaments to modern diamond sets.'}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl mt-6 lg:mt-12 pb-12 lg:pb-20">
                <div className="flex flex-col lg:flex-row gap-8 mt-4 mb-4">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 space-y-4 lg:space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 hidden lg:flex items-center gap-2">
                                <FiFilter className="w-5 h-5" /> Categories
                            </h3>
                            {/* Horizontal scroll on mobile, regular list on desktop */}
                            <div className="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 scroll-smooth snap-x snap-mandatory">
                                <Link
                                    href="/products"
                                    className={`whitespace-nowrap px-4 py-2 rounded-lg transition-colors flex-shrink-0 snap-start ${!categorySlug && !searchParams.get('metal') ? 'bg-amber-500 text-white font-semibold shadow-md' : 'text-gray-600 bg-white border border-gray-100 lg:bg-transparent lg:border-0 hover:bg-gray-100'
                                        }`}
                                >
                                    All Products
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/products?category=${cat.slug}`}
                                        className={`whitespace-nowrap px-4 py-2 rounded-lg transition-colors flex-shrink-0 snap-start ${categorySlug === cat.slug ? 'bg-amber-500 text-white font-semibold shadow-md' : 'text-gray-600 bg-white border border-gray-100 lg:bg-transparent lg:border-0 hover:bg-gray-100'
                                            }`}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="hidden lg:block p-6 bg-amber-50 rounded-2xl border border-amber-100">
                            <h4 className="font-bold text-amber-900 mb-2">Need Help?</h4>
                            <p className="text-sm text-amber-800 mb-4">Can&apos;t find what you&apos;re looking for? Our experts are here to help you.</p>
                            <button className="w-full bg-white text-amber-700 font-bold py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
                                Contact Expert
                            </button>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 lg:mb-8 flex justify-between items-center gap-4">
                            <p className="text-gray-600 font-medium text-sm sm:text-base">
                                <span className="hidden sm:inline">Showing </span><span className="text-gray-900 font-bold">{data?.products.length || 0}</span> products
                            </p>
                            <div className="flex items-center gap-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500/20"
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 gap-y-8 sm:gap-y-10">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 animate-pulse">
                                        <div className="aspect-square sm:aspect-[4/5] bg-gray-200 rounded-xl mb-4" />
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : data?.products && data.products.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 gap-y-8 sm:gap-y-10">
                                {data.products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl py-12 px-6 sm:p-20 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                    <FiSearch className="w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm sm:text-base">
                                    We couldn&apos;t find any products in this category. Try adjusting your filters or check back later!
                                </p>
                                <Link
                                    href="/products"
                                    className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg text-sm sm:text-base"
                                >
                                    View All Products
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
