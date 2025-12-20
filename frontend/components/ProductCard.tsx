'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { useAddToCart, useAddToWishlist, useRemoveFromWishlist, useWishlist, useAuth } from '@/hooks/useApi';
import type { Product } from '@/lib/types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);
    const { data: user } = useAuth();
    const router = useRouter();
    const addToCart = useAddToCart();
    const addToWishlist = useAddToWishlist();
    const removeFromWishlist = useRemoveFromWishlist();
    const { data: wishlistItems = [] } = useWishlist();

    const isInWishlist = wishlistItems.some((item) => item.productId === product.id);
    const displayPrice = product.salePrice || product.price;
    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
        : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/auth/login');
            return;
        }
        addToCart.mutate({ productId: product.id, quantity: 1 });
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/auth/login');
            return;
        }
        if (isInWishlist) {
            removeFromWishlist.mutate(product.id);
        } else {
            addToWishlist.mutate(product.id);
        }
    };

    const placeholderImage = 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop';
    const productImage = product.images && product.images.length > 0 && !imageError
        ? product.images[0]
        : placeholderImage;

    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <div className="card overflow-hidden">
                {/* Image Container */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => setImageError(true)}
                    />

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {discountPercent}% OFF
                        </div>
                    )}

                    {/* Stock Badge */}
                    {product.stock === 0 && (
                        <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Out of Stock
                        </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button
                            onClick={handleToggleWishlist}
                            className="bg-white p-3 rounded-full hover:bg-[var(--color-primary,#D4AF37)] hover:text-white transition-all transform hover:scale-110"
                            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            {isInWishlist ? (
                                <FaHeart className="w-5 h-5 text-[var(--color-primary,#D4AF37)]" />
                            ) : (
                                <FiHeart className="w-5 h-5" />
                            )}
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="bg-white p-3 rounded-full hover:bg-[var(--color-primary,#D4AF37)] hover:text-white transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Add to cart"
                        >
                            <FiShoppingCart className="w-5 h-5" />
                        </button>
                        <div className="bg-white p-3 rounded-full cursor-pointer hover:bg-[var(--color-primary,#D4AF37)] hover:text-white transition-all transform hover:scale-110">
                            <FiEye className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Category & Metal */}
                    <div className="flex items-center gap-2 mb-2">
                        {product.category && (
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                                {product.category.name}
                            </span>
                        )}
                        {product.metal && (
                            <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-[var(--color-primary,#D4AF37)] font-semibold uppercase">
                                    {product.metal}
                                </span>
                            </>
                        )}
                        {product.purity && (
                            <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-500">
                                    {product.purity}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[var(--color-primary,#D4AF37)] transition-colors">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[var(--color-primary,#D4AF37)]">
                            ₹{displayPrice.toLocaleString('en-IN')}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                ₹{product.price.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>

                    {/* Weight */}
                    {product.weight && (
                        <p className="text-xs text-gray-500 mt-2">
                            Weight: {product.weight}g
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
