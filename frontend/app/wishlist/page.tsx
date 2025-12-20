'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWishlist, useRemoveFromWishlist, useAddToCart } from '@/hooks/useApi';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';

export default function WishlistPage() {
    const { data: wishlistItems = [], isLoading } = useWishlist();
    const removeFromWishlist = useRemoveFromWishlist();
    const addToCart = useAddToCart();

    const handleRemove = (productId: string) => {
        if (confirm('Are you sure you want to remove this item from wishlist?')) {
            removeFromWishlist.mutate(productId);
        }
    };

    const handleAddToCart = (productId: string, productName: string) => {
        addToCart.mutate({ productId, quantity: 1 });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-7xl py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--color-primary,#D4AF37)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your wishlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="container mx-auto max-w-7xl py-12">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <FiHeart className="w-24 h-24 text-gray-300 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
                    <p className="text-gray-600 mb-8">Save items you love to your wishlist!</p>
                    <Link href="/products" className="btn btn-primary">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                    My Wishlist
                </h1>
                <p className="text-gray-600">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => {
                    const price = item.product.salePrice || item.product.price;
                    const hasDiscount = item.product.salePrice && item.product.salePrice < item.product.price;

                    return (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                            {/* Product Image */}
                            <Link
                                href={`/products/${item.product.slug}`}
                                className="relative aspect-square bg-gray-100 block overflow-hidden"
                            >
                                <Image
                                    src={item.product.images?.[0] || '/placeholder-jewelry.jpg'}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {hasDiscount && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {Math.round(((item.product.price - item.product.salePrice!) / item.product.price) * 100)}% OFF
                                    </div>
                                )}
                            </Link>

                            {/* Product Info */}
                            <div className="p-4">
                                <div className="flex items-start gap-2 mb-2">
                                    {item.product.category && (
                                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                                            {item.product.category.name}
                                        </span>
                                    )}
                                    {item.product.metal && (
                                        <>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs text-[var(--color-primary,#D4AF37)] font-semibold uppercase">
                                                {item.product.metal}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="font-semibold text-gray-900 hover:text-[var(--color-primary,#D4AF37)] transition-colors mb-2 line-clamp-2 block"
                                >
                                    {item.product.name}
                                </Link>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-lg font-bold text-[var(--color-primary,#D4AF37)]">
                                        ₹{price.toLocaleString('en-IN')}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{item.product.price.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(item.product.id, item.product.name)}
                                        disabled={item.product.stock === 0}
                                        className="flex-1 btn btn-primary py-2 text-sm flex items-center justify-center gap-2"
                                    >
                                        <FiShoppingCart className="w-4 h-4" />
                                        {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.product.id)}
                                        className="p-2 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                                        aria-label="Remove from wishlist"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
