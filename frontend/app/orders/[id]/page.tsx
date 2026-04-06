'use client';

import { useAuth, useOrderDetails } from '@/hooks/useApi';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { FiShoppingBag, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiArrowLeft, FiMapPin, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: Record<string, { color: string; icon: any; label: string }> = {
        pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: FiClock, label: 'Pending' },
        confirmed: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FiPackage, label: 'Confirmed' },
        shipped: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: FiTruck, label: 'Shipped' },
        delivered: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: FiCheckCircle, label: 'Delivered' },
        cancelled: { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: FiXCircle, label: 'Cancelled' },
    };

    const config = statusMap[status.toLowerCase()] || statusMap.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${config.color} uppercase tracking-wider`}>
            <Icon className="w-4 h-4" />
            {config.label}
        </span>
    );
};

export default function OrderDetailsPage() {
    const { data: user, isLoading: isAuthLoading } = useAuth();
    const { id } = useParams();
    const { data: order, isLoading: isOrderLoading } = useOrderDetails(id as string);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, isAuthLoading, router]);

    if (isAuthLoading || isOrderLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    <p className="text-gray-500 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!user || !order) return null;

    return (
        <div className="bg-gray-50/50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Back Link */}
                <Link 
                    href="/orders" 
                    className="inline-flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-amber-600 transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    Back to Orders
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Order Details
                            </h1>
                            <StatusBadge status={order.status} />
                        </div>
                        <p className="text-gray-500 text-lg">
                            Track your order <span className="text-amber-600 font-bold">#{order.orderNumber}</span> placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items and Billing */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Items Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900">Order Items</h3>
                            </div>
                            <div className="p-8 space-y-6">
                                {order.orderItems.map((item: any) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="relative w-28 h-28 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                                            <Image
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                                alt={item.product?.name || 'Product'}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center gap-1">
                                            <Link href={`/products/${item.product?.slug}`} className="hover:text-amber-600 transition-colors">
                                                <h4 className="font-bold text-lg text-gray-900 leading-tight">
                                                    {item.product?.name}
                                                </h4>
                                            </Link>
                                            <div className="flex items-center gap-3 text-gray-500 font-medium">
                                                <span>Quantity: {item.quantity}</span>
                                                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                                                <span className="text-gray-900 font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                                            </div>
                                            {item.product?.metal && (
                                                <div className="mt-2 flex gap-2">
                                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg border border-amber-100 uppercase tracking-widest">
                                                        {item.product.metal}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-200 uppercase tracking-widest">
                                                        {item.product.purity}
                                                    </span>
                                                    {item.product.weight && (
                                                        <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-200 uppercase tracking-widest">
                                                            {item.product.weight}g
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Breakdown */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900">Payment Breakdown</h3>
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Tax</span>
                                    <span>₹{order.tax.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium pb-4 border-b border-gray-100">
                                    <span>Shipping</span>
                                    <span>{order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge.toLocaleString('en-IN')}`}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2">
                                    <span>Total</span>
                                    <span className="text-amber-600">₹{order.total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <FiMapPin className="w-5 h-5 text-amber-600" />
                                </div>
                                <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Shipping To</h4>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-gray-900 text-lg">{order.address?.name}</p>
                                <p className="text-gray-600 font-medium leading-relaxed">{order.address?.address}</p>
                                <p className="text-gray-600 font-medium">{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                                <div className="flex items-center gap-2 mt-4 text-gray-900 font-bold">
                                    <FiSmartphone className="w-4 h-4" />
                                    <span>{order.address?.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <FiCreditCard className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Payment Information</h4>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Method</p>
                                    <p className="font-bold text-gray-900 uppercase">{order.paymentMethod || 'Not Specified'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                        order.paymentStatus.toLowerCase() === 'paid' 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                            : 'bg-rose-50 text-rose-700 border-rose-100'
                                    }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Need Help */}
                        <div className="bg-gray-900 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-3">Need Assistance?</h4>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                    In case of any issues with your order, please contact our support team.
                                </p>
                                <Link 
                                    href="/contact" 
                                    className="block w-full py-3 bg-white text-gray-900 text-center font-bold rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                >
                                    Contact Support
                                </Link>
                            </div>
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
