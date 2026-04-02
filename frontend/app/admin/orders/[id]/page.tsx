'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAdminOrder, useUpdateOrderStatus } from '@/hooks/useApi';
import Link from 'next/link';
import Image from 'next/image';
import { 
    FiArrowLeft, 
    FiPackage, 
    FiTruck, 
    FiUser, 
    FiMail, 
    FiPhone, 
    FiCalendar, 
    FiCreditCard,
    FiAlertCircle
} from 'react-icons/fi';

const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminOrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: order, isLoading } = useAdminOrder(id as string);
    const updateStatus = useUpdateOrderStatus();

    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;
        try {
            await updateStatus.mutateAsync({ id: order.id, status: newStatus });
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
                <p className="text-gray-500 mb-8">The request order could not be located in our system.</p>
                <Link href="/admin/orders" className="text-amber-600 font-bold hover:underline">
                    Back to All Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Link 
                        href="/admin/orders" 
                        className="inline-flex items-center text-sm text-gray-500 hover:text-amber-600 transition-colors mb-2"
                    >
                        <FiArrowLeft className="mr-2" /> Back to Orders
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        Order #{order.orderNumber}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5"><FiCalendar /> {new Date(order.createdAt).toLocaleString()}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                            {order.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-gray-700">Set Status:</label>
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updateStatus.isPending}
                        className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-amber-500 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Order Items */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FiPackage className="text-amber-600" />
                                Order Items
                            </h2>
                            <span className="text-sm font-medium text-gray-500">{order.orderItems.length} Products</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="p-6 flex gap-6 hover:bg-gray-50/50 transition-colors">
                                    <Link href={`/admin/products/${item.product.id}`} className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                        <Image
                                            src={item.product.images?.[0] || '/placeholder.jpg'}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </Link>
                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                        <Link href={`/admin/products/${item.product.id}`}>
                                            <h4 className="text-base font-bold text-gray-900 mb-0.5 hover:text-amber-600 transition-colors truncate">
                                                {item.product.name}
                                            </h4>
                                        </Link>
                                        <p className="text-xs text-gray-500 mb-2">{item.product.metal} • {item.product.purity}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Qty: <span className="text-gray-900 font-bold">{item.quantity}</span> × ₹{item.price.toLocaleString()}
                                            </span>
                                            <span className="text-base font-black text-amber-700">₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Summary */}
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-3">
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Subtotal</span>
                                <span className="font-bold">₹{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>GST (3%)</span>
                                <span className="font-bold">₹{order.tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Shipping Charge</span>
                                <span className="font-bold">{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge.toLocaleString()}`}</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-gray-200 text-xl font-black text-gray-900">
                                <span>Total Amount</span>
                                <span className="text-amber-700">₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <FiCreditCard className="text-amber-600" />
                            Payment Method
                        </h2>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <p className="font-bold text-gray-900 uppercase tracking-wide">{order.paymentMethod}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Transaction ID: <span className="font-mono">{order.id}</span></p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Customer & Shipping Details */}
                <div className="space-y-8">
                    {/* Customer Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                            <FiUser className="text-amber-600" />
                            <h2 className="text-lg font-bold text-gray-900">Customer</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                                    <FiUser size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{order.user.name}</p>
                                    <p className="text-xs text-gray-500 tracking-wider">Customer ID: {order.userId.substring(0, 8)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                    <FiMail size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</p>
                                    <p className="text-sm text-gray-900 font-medium truncate">{order.user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                            <FiTruck className="text-amber-600" />
                            <h2 className="text-lg font-bold text-gray-900">Shipping To</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4 text-gray-700">
                                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                                    <FiTruck size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{order.address.name}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed mt-1 uppercase">
                                        {order.address.address},<br />
                                        {order.address.city}, {order.address.state} - {order.address.pincode}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                                    <FiPhone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                                    <p className="text-sm text-gray-900 font-bold">+91 {order.address.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
