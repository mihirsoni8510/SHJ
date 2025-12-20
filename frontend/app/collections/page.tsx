'use client';

import { useCategories } from '@/hooks/useApi';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function CollectionsPage() {
    const { data: categories = [], isLoading } = useCategories();

    return (
        <div className="bg-gray-50 min-h-screen pb-20 ">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-16">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                        Our Collections
                    </h1>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto font-light">
                        Explore our curated selection of luxury jewelry, meticulously handcrafted for your most precious moments.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl mt-16">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-gray-200 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.slug}`}
                                className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
                            >
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                                <Image
                                    src={category.image || '/placeholder-category.jpg'}
                                    alt={category.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                <div className="absolute bottom-0 left-0 right-0 p-10 z-20">
                                    <h2 className="text-white text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {category.name}
                                    </h2>
                                    <p className="text-gray-300 mb-6 line-clamp-2 text-sm leading-relaxed">
                                        {category.description || `Discover our exquisite ${category.name} collection.`}
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-amber-500 font-bold group-hover:translate-x-2 transition-transform">
                                        Explore Collection <FiArrowRight />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No collections found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
