'use client';

import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useApi';
import { FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import Link from 'next/link';

const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
    const { data: orders = [], isLoading } = useAdminOrders();
    const updateStatus = useUpdateOrderStatus();

    const handleStatusChange = async (id: string, status: string) => {
        await updateStatus.mutateAsync({ id, status });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-500">Track and manage customer orders and fulfillment.</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-amber-500/20"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select className="flex-1 md:w-40 bg-white border border-gray-200 rounded-lg py-2 px-3 text-gray-600 focus:ring-2 focus:ring-amber-500/20 outline-none">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="p-20 text-center text-gray-500">No orders found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <th className="px-6 py-4 font-semibold">Order ID</th>
                                    <th className="px-6 py-4 font-semibold">Customer</th>
                                    <th className="px-6 py-4 font-semibold">Total</th>
                                    <th className="px-6 py-4 font-semibold">Payment</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">#{order.orderNumber}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {/* In a real app, you'd include user name in order object or fetch separately */}
                                            Customer #{order.userId.substring(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">₹{order.total.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {order.paymentStatus.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold outline-none border-none cursor-pointer ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all inline-block"
                                                title="View Details"
                                            >
                                                <FiEye className="w-5 h-5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
