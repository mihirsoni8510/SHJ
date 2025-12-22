'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProduct, useAddToCart, useAddToWishlist, useWishlist, useRemoveFromWishlist } from '@/hooks/useApi';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiShare2, FiShield, FiRotateCcw, FiTruck } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { data: product, isLoading, error } = useProduct(slug);
    const addToCart = useAddToCart();
    const addToWishlist = useAddToWishlist();
    const removeFromWishlist = useRemoveFromWishlist();
    const { data: wishlistItems = [] } = useWishlist();

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const isInWishlist = wishlistItems.some((item) => item.productId === product?.id);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
                    <button onClick={() => router.push('/products')} className="mt-4 text-amber-600 font-bold underline">
                        Back to Collection
                    </button>
                </div>
            </div>
        );
    }

    const displayPrice = product.salePrice || product.price;
    const hasDiscount = product.salePrice && product.salePrice < product.price;

    const handleAddToCart = () => {
        addToCart.mutate({ productId: product.id, quantity });
    };

    const handleToggleWishlist = () => {
        if (isInWishlist) {
            removeFromWishlist.mutate(product.id);
        } else {
            addToWishlist.mutate(product.id);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="container mx-auto px-4 max-w-7xl pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
                            <Image
                                src={product.images[selectedImage] || '/placeholder-jewelry.jpg'}
                                alt={product.name}
                                fill
                                className="object-contain p-8"
                            />
                            {hasDiscount && (
                                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-1.5 rounded-full font-bold shadow-lg">
                                    {(Math.round(((product.price - product.salePrice!) / product.price) * 100))}% OFF
                                </div>
                            )}
                        </div>

                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-amber-500' : 'border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                {product.category?.name || 'Collection'}
                            </span>
                            {product.metal && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                    {product.metal}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-3xl font-bold text-amber-600">
                                ₹{displayPrice.toLocaleString('en-IN')}
                            </span>
                            {hasDiscount && (
                                <span className="text-xl text-gray-400 line-through">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Product Meta */}
                        <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl mb-8">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Purity</p>
                                <p className="text-gray-900 font-semibold">{product.purity || 'Standard'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Weight</p>
                                <p className="text-gray-900 font-semibold">{product.weight ? `${product.weight}g` : 'TBD'}</p>
                            </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2 bg-white shadow-sm">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-amber-600 font-bold">-</button>
                                <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-amber-600 font-bold">+</button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-amber-600 transition-all shadow-xl disabled:opacity-50"
                            >
                                <FiShoppingCart className="w-5 h-5" />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>

                            <button
                                onClick={handleToggleWishlist}
                                className={`p-4 border rounded-xl transition-all shadow-sm ${isInWishlist
                                    ? 'bg-amber-50 border-amber-500 text-amber-600'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-600'
                                    }`}
                            >
                                {isInWishlist ? <FaHeart className="w-6 h-6" /> : <FiHeart className="w-6 h-6" />}
                            </button>

                            <button onClick={handleShare} className="p-4 bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-all shadow-sm">
                                <FiShare2 className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Service Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FiShield className="w-5 h-5" /></div>
                                <span className="text-xs font-bold text-gray-600">Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FiTruck className="w-5 h-5" /></div>
                                <span className="text-xs font-bold text-gray-600">Free Express Delivery</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FiRotateCcw className="w-5 h-5" /></div>
                                <span className="text-xs font-bold text-gray-600">Easily Return Policy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
