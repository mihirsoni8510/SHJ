'use client';

import { useAuth, useUserOrders } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FiShoppingBag, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiArrowRight } from 'react-icons/fi';
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
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.color} uppercase tracking-wider`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
};

export default function OrdersPage() {
    const { data: user, isLoading: isAuthLoading } = useAuth();
    const { data: orders, isLoading: isOrdersLoading } = useUserOrders();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, isAuthLoading, router]);

    if (isAuthLoading || isOrdersLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="bg-gray-50/50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-sm font-bold mb-4 border border-amber-100">
                            <FiShoppingBag className="w-4 h-4" />
                            <span>Order History</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                            My Orders
                        </h1>
                        <p className="text-gray-500 mt-3 text-lg">
                            Track and manage your recent purchases from Shree Harikrupa Jewellers.
                        </p>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-8">
                    {orders && orders.length > 0 ? (
                        orders.map((order: any) => (
                            <div 
                                key={order.id} 
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                            >
                                {/* Order Top Bar */}
                                <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order Placed</p>
                                            <p className="text-sm font-bold text-gray-700">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                                            <p className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                                            <p className="text-sm font-bold text-amber-600">#{order.orderNumber}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                {/* Order Content */}
                                <div className="p-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                        {/* Products List */}
                                        <div className="lg:col-span-2 space-y-6">
                                            {order.orderItems.map((item: any) => (
                                                <div key={item.id} className="flex gap-6 group">
                                                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                                                        <Image
                                                            src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                                            alt={item.product?.name || 'Product'}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center gap-1">
                                                        <h4 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                                                            {item.product?.name || 'Product Name Not Available'}
                                                        </h4>
                                                        <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                                            <span>Qty: {item.quantity}</span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span className="text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                                                        </div>
                                                        {item.product?.metal && (
                                                            <div className="mt-1">
                                                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                                                                    {item.product.metal} {item.product.purity}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Summary / Actions */}
                                        <div className="lg:col-span-1 flex flex-col justify-between border-l border-gray-100 pl-0 lg:pl-12">
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Shipping Address</p>
                                                    <div className="text-sm text-gray-600 font-medium leading-relaxed">
                                                        <p className="font-bold text-gray-900">{order.address?.name}</p>
                                                        <p>{order.address?.address}</p>
                                                        <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                                                        <p>Ph: {order.address?.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="pt-8 space-y-3">
                                                <Link 
                                                    href={`/orders/${order.id}`}
                                                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#946f3a] text-white font-bold rounded-xl hover:bg-[#785a2f] transition-all shadow-md text-sm"
                                                >
                                                    View Details
                                                    <FiArrowRight className="w-4 h-4" />
                                                </Link>
                                                {order.status.toLowerCase() === 'pending' && (
                                                    <button className="w-full py-3 text-rose-600 font-bold text-sm hover:bg-rose-50 rounded-xl transition-colors">
                                                        Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
                            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <FiShoppingBag className="w-10 h-10 text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                                No orders found
                            </h3>
                            <p className="text-gray-500 mt-3 max-w-sm mx-auto text-lg">
                                When you place an order, it will appear here. Start browsing our exquisite collection.
                            </p>
                            <Link 
                                href="/products"
                                className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
                            >
                                Start Shopping
                                <FiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
