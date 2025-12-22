'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, useUpdateCart, useRemoveFromCart } from '@/hooks/useApi';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
    const { data: cartItems = [], isLoading } = useCart();
    const updateCart = useUpdateCart();
    const removeFromCart = useRemoveFromCart();

    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.product.salePrice || item.product.price;
        return sum + price * item.quantity;
    }, 0);

    const tax = subtotal * 0.03; // 3% GST
    const shipping = subtotal > 25000 ? 0 : 500;
    const total = subtotal + tax + shipping;

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        updateCart.mutate({ productId, quantity });
    };

    const handleRemove = (productId: string) => {
        if (confirm('Are you sure you want to remove this item?')) {
            removeFromCart.mutate(productId);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-7xl py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--color-primary,#D4AF37)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your cart...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto max-w-7xl py-12">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <FiShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Start adding items to your cart!</p>
                    <Link href="/products" className="btn btn-primary">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                Shopping Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {cartItems.map((item) => {
                            const price = item.product.salePrice || item.product.price;

                            return (
                                <Fragment key={item.id}>
                                    <div className="relative flex gap-4 p-4 sm:p-6 border-b last:border-b-0">
                                        {/* Remove Button - Absolute Top Right */}
                                        <button
                                            onClick={() => handleRemove(item.productId)}
                                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-10"
                                            aria-label="Remove item"
                                        >
                                            <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>

                                        {/* Product Image */}
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100"
                                        >
                                            <Image
                                                src={item.product.images?.[0] || '/placeholder-jewelry.jpg'}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </Link>

                                        {/* Product Info & Controls */}
                                        <div className="flex flex-col flex-grow min-w-0 py-1">
                                            {/* Header */}
                                            <div className="pr-10 mb-1">
                                                <Link
                                                    href={`/products/${item.product.slug}`}
                                                    className="font-semibold text-gray-900 hover:text-[var(--color-primary,#D4AF37)] transition-colors line-clamp-1 text-base sm:text-lg"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                    {item.product.metal} • {item.product.purity}
                                                </p>
                                            </div>

                                            {/* Footer - Price & Quantity */}
                                            <div className="flex flex-wrap items-end justify-between gap-y-3 mt-auto">
                                                <p className="text-lg sm:text-xl font-bold text-[var(--color-primary,#D4AF37)]">
                                                    ₹{price.toLocaleString('en-IN')}
                                                </p>

                                                <div className="flex items-center gap-2 sm:gap-3 border border-gray-200 rounded-lg bg-gray-50/50 p-1">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-amber-600 disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <FiMinus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center font-semibold text-gray-900 text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                                        disabled={item.quantity >= item.product.stock}
                                                        className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-amber-600 disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <FiPlus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>GST (3%)</span>
                                <span>₹{tax.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                                    {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                                </span>
                            </div>
                            {subtotal < 25000 && (
                                <p className="text-sm text-gray-500 bg-amber-50 p-3 rounded">
                                    Add ₹{(25000 - subtotal).toLocaleString('en-IN')} more for free shipping!
                                </p>
                            )}
                        </div>

                        <div className="border-t pt-4 mb-6">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-[var(--color-primary,#D4AF37)]">₹{total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="btn btn-primary w-full text-lg py-4 mb-3">
                            Proceed to Checkout
                        </Link>
                        <Link href="/products" className="btn btn-outline w-full text-lg py-4">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
