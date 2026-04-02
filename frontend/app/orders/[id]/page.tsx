'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useOrder } from '@/hooks/useApi';
import Link from 'next/link';
import Image from 'next/image';
import { FiCheckCircle, FiPackage, FiTruck, FiTruck as FiShipping, FiShoppingBag, FiInfo } from 'react-icons/fi';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get('success') === 'true';
    const { data: order, isLoading } = useOrder(id as string);

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-7xl py-20 px-4">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Finding your order...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto max-w-7xl py-20 px-4">
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <FiShoppingBag className="w-20 h-20 text-gray-200 mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
                    <p className="text-gray-500 mb-8">We couldn&apos;t find an order with that ID.</p>
                    <Link href="/products" className="btn btn-primary px-8">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const orderStatusColor = {
        pending: 'bg-amber-100 text-amber-700',
        confirmed: 'bg-blue-100 text-blue-700',
        shipped: 'bg-indigo-100 text-indigo-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    }[order.status] || 'bg-gray-100 text-gray-700';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Success Banner */}
                {isSuccess && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center mb-10 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6 animate-bounce">
                            <FiCheckCircle className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                            Order Placed Successfully!
                        </h1>
                        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                            Thank you for shopping with Shree Harikrupa Jewellers. Your order is being processed.
                        </p>
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full border border-gray-100 mb-2">
                            <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Order ID:</span>
                            <span className="text-gray-900 font-bold tracking-tight">{order.orderNumber}</span>
                        </div>
                    </div>
                )}

                {/* Order Status & Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <FiPackage className="w-6 h-6 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-xs uppercase font-bold text-gray-400 mb-2">Status</h3>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${orderStatusColor}`}>
                            {order.status}
                        </span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <FiInfo className="w-6 h-6 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-xs uppercase font-bold text-gray-400 mb-2">Payment</h3>
                        <span className="text-gray-900 font-bold">{order.paymentMethod}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <FiShipping className="w-6 h-6 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-xs uppercase font-bold text-gray-400 mb-2">Delivery</h3>
                        <span className="text-gray-900 font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
                    <div className="p-6 sm:p-8 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                        <span className="text-sm text-gray-500 font-medium">{order.orderItems.length} Products</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {order.orderItems.map((item) => (
                            <div key={item.id} className="p-6 sm:p-8 flex gap-6 sm:gap-8">
                                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                    <Image 
                                        src={item.product.images?.[0] || '/placeholder.jpg'}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h4 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{item.product.name}</h4>
                                    <p className="text-sm text-gray-500 mb-4">{item.product.metal} • {item.product.purity}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Qty: <span className="text-gray-900 font-bold">{item.quantity}</span>
                                        </div>
                                        <div className="text-lg font-black text-amber-700">₹{item.price.toLocaleString('en-IN')}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Summary in Details */}
                    <div className="bg-gray-50/80 p-6 sm:p-8 space-y-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>GST (3%)</span>
                            <span className="font-semibold">₹{order.tax.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="font-semibold text-green-600">{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge.toLocaleString('en-IN')}`}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-gray-200 text-2xl font-black text-gray-900">
                            <span>Total</span>
                            <span className="text-amber-700">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FiTruck className="text-amber-600" />
                        Shipping To
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <p className="font-black text-gray-900 mb-1">{order.address.name}</p>
                            <p className="text-gray-600 leading-relaxed uppercase tracking-wider text-xs">
                                {order.address.address},<br />
                                {order.address.city}, {order.address.state} - {order.address.pincode}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 uppercase text-[10px] font-black tracking-widest mb-1">Phone Number</p>
                            <p className="text-gray-900 font-bold">+91 {order.address.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/profile" className="flex-1 w-full text-center py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                        View All Orders
                    </Link>
                    <Link href="/products" className="flex-1 w-full text-center py-4 border-2 border-amber-600/20 text-amber-900 rounded-xl font-bold hover:bg-amber-50 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
