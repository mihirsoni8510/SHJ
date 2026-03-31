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
        addToCart.mutate({ productId: product.id, quantity: 1 });
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
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
        <Link href={`/products/${product.slug}`} className="group block h-full">
            <div className="card overflow-hidden h-full flex flex-col">
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
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {discountPercent}% OFF
                        </div>
                    )}

                    {/* Stock Badge */}
                    {product.stock === 0 && (
                        <div className="absolute bottom-3 left-3 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-bold">
                            Out of Stock
                        </div>
                    )}

                    {/* Wishlist Button - Always Visible */}
                    <button
                        onClick={handleToggleWishlist}
                        className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-[var(--color-primary,#D4AF37)] hover:text-white transition-all shadow-sm z-10"
                        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        {isInWishlist ? (
                            <FaHeart className="w-4 h-4 text-[var(--color-primary,#D4AF37)]" />
                        ) : (
                            <FiHeart className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                    {/* Category & Metal */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        {product.category && (
                            <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide line-clamp-1">
                                {product.category.name}
                            </span>
                        )}
                        {product.metal && (
                            <span className="text-[10px] sm:text-xs text-[var(--color-primary,#D4AF37)] font-semibold uppercase">
                                • {product.metal}
                            </span>
                        )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug min-h-[2.5rem]">
                        {product.name}
                    </h3>

                    {/* Price & Add to Cart */}
                    <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-50">
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-base sm:text-lg font-bold text-amber-600">
                                    ₹{displayPrice.toLocaleString('en-IN')}
                                </span>
                                {hasDiscount && (
                                    <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="bg-gray-900 text-white p-2 sm:p-2.5 rounded-full hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
                            aria-label="Add to cart"
                        >
                            <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
