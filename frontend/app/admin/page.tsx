'use client';

import {
    FiShoppingBag,
    FiUsers,
    FiShoppingCart,
    FiTrendingUp,
    FiArrowUpRight,
    FiArrowDownRight
} from 'react-icons/fi';
import Link from 'next/link';
import { useAdminOrders, useAdminUsers, useAdminProducts } from '@/hooks/useApi';



export default function AdminDashboard() {
    const { data: orders = [], isLoading: isLoadingOrders } = useAdminOrders();
    const { data: users = [], isLoading: isLoadingUsers } = useAdminUsers();
    const { data: products = [], isLoading: isLoadingProducts } = useAdminProducts();

    const isLoading = isLoadingOrders || isLoadingUsers || isLoadingProducts;

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-amber-500"></div>
            </div>
        );
    }

    // --- Stats Calculations ---

    // 1. Total Revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // 2. Total Orders
    const totalOrdersCount = orders.length;

    // 3. Total Products
    const totalProductsCount = products.length;

    // 4. Total Customers (Role = 'user')
    const totalCustomersCount = users.filter(u => u.role === 'user').length;

    // 5. Recent Orders (Sort by date desc, take top 5)
    // Note: Assuming API might return sorted, but sorting here to be sure
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentOrders = sortedOrders.slice(0, 5);

    // 6. Category Sales
    // We need to aggregate sales by category
    const categorySales: Record<string, number> = {};
    let totalSalesValue = 0;

    orders.forEach(order => {
        order.orderItems.forEach(item => {
            // Check if product and category exist
            const catName = item.product?.category?.name || 'Uncategorized';
            const itemTotal = item.price * item.quantity;

            categorySales[catName] = (categorySales[catName] || 0) + itemTotal;
            totalSalesValue += itemTotal;
        });
    });

    // Convert to array and calculate percentages
    const categoryStats = Object.entries(categorySales)
        .map(([name, value]) => ({
            name,
            value,
            percentage: totalSalesValue > 0 ? Math.round((value / totalSalesValue) * 100) : 0
        }))
        .sort((a, b) => b.value - a.value) // Sort by highest sales
        .slice(0, 5); // Take top 5 categories

    // Helper for currency formatting
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Helper for date formatting
    const formatDate = (dateString: Date) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const stats = [
        {
            label: 'Total Revenue',
            value: formatCurrency(totalRevenue),
            change: '', // Dynamic change % requires historical data
            up: true,
            icon: FiTrendingUp,
            bg: 'bg-emerald-50',
            color: 'text-emerald-600'
        },
        {
            label: 'Total Orders',
            value: totalOrdersCount.toString(),
            change: '',
            up: true,
            icon: FiShoppingCart,
            bg: 'bg-blue-50',
            color: 'text-blue-600'
        },
        {
            label: 'Total Products',
            value: totalProductsCount.toString(),
            change: '',
            up: true,
            icon: FiShoppingBag,
            bg: 'bg-amber-50',
            color: 'text-amber-600'
        },
        {
            label: 'Total Customers', // Changed from "New Customers" to be more accurate
            value: totalCustomersCount.toString(),
            change: '',
            up: true,
            icon: FiUsers,
            bg: 'bg-purple-50',
            color: 'text-purple-600'
        },
    ];

    // Colors for categories charts
    const categoryColors = ['bg-amber-400', 'bg-blue-400', 'bg-emerald-400', 'bg-purple-400', 'bg-rose-400'];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {/* <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stat.change}
                                {stat.up ? <FiArrowUpRight /> : <FiArrowDownRight />}
                            </div> */}
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-amber-600 font-semibold hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <th className="px-6 py-4 font-semibold">Order ID</th>
                                    <th className="px-6 py-4 font-semibold">Customer</th>
                                    <th className="px-6 py-4 font-semibold">Amount</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => {
                                        const customerName = users.find(u => u.id === order.userId)?.name || 'Unknown User';

                                        return (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">#{order.orderNumber || order.id.slice(0, 8)}</td>
                                                <td className="px-6 py-4 text-gray-600">{customerName}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(order.total)}</td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                            order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Popular Categories */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h2>
                    <div className="space-y-6">
                        {categoryStats.length > 0 ? (
                            categoryStats.map((cat, index) => (
                                <div key={cat.name}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-gray-700">{cat.name}</span>
                                        <span className="font-bold text-gray-900">{cat.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`${categoryColors[index % categoryColors.length]} h-2 rounded-full`}
                                            style={{ width: `${cat.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No sales data available yet.</p>
                        )}
                    </div>

                    <div className="mt-10 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-sm text-amber-800 font-medium">✨ Pro Tip</p>
                        <p className="text-xs text-amber-700 mt-1">
                            Analyze your top selling categories to plan your inventory better.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
