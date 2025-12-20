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

const stats = [
    {
        label: 'Total Revenue',
        value: '₹1,24,500',
        change: '+12.5%',
        up: true,
        icon: FiTrendingUp,
        bg: 'bg-emerald-50',
        color: 'text-emerald-600'
    },
    {
        label: 'Total Orders',
        value: '156',
        change: '+8.2%',
        up: true,
        icon: FiShoppingCart,
        bg: 'bg-blue-50',
        color: 'text-blue-600'
    },
    {
        label: 'Total Products',
        value: '248',
        change: '+4',
        up: true,
        icon: FiShoppingBag,
        bg: 'bg-amber-50',
        color: 'text-amber-600'
    },
    {
        label: 'New Customers',
        value: '1,200',
        change: '-2.4%',
        up: false,
        icon: FiUsers,
        bg: 'bg-purple-50',
        color: 'text-purple-600'
    },
];

const recentOrders = [
    { id: '#ORD-7231', customer: 'Mihir Soni', product: 'Gold Diamond Ring', amount: '₹45,000', status: 'Delivered', date: '20 Dec 2025' },
    { id: '#ORD-7232', customer: 'Anjali Shah', product: 'Silver Necklace', amount: '₹12,500', status: 'Pending', date: '20 Dec 2025' },
    { id: '#ORD-7233', customer: 'Rajesh Patel', product: 'Gold Bangle', amount: '₹85,000', status: 'Shipped', date: '19 Dec 2025' },
    { id: '#ORD-7234', customer: 'Priya Mehta', product: 'Diamond Earrings', amount: '₹32,000', status: 'Delivered', date: '18 Dec 2025' },
];

export default function AdminDashboard() {
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
                            <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                                {stat.change}
                                {stat.up ? <FiArrowUpRight /> : <FiArrowDownRight />}
                            </div>
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
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{order.amount}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Popular Categories */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h2>
                    <div className="space-y-6">
                        {[
                            { name: 'Gold Jewellery', percentage: 65, color: 'bg-amber-400' },
                            { name: 'Diamond Collection', percentage: 25, color: 'bg-blue-400' },
                            { name: 'Silver Articles', percentage: 10, color: 'bg-gray-400' },
                        ].map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700">{cat.name}</span>
                                    <span className="font-bold text-gray-900">{cat.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className={`${cat.color} h-2 rounded-full`}
                                        style={{ width: `${cat.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-sm text-amber-800 font-medium">✨ Pro Tip</p>
                        <p className="text-xs text-amber-700 mt-1">
                            Gold jewellery sales are up by 20% this week. Consider featuring more gold items on the homepage.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
