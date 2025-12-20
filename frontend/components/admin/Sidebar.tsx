'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiGrid,
    FiShoppingBag,
    FiLayers,
    FiUsers,
    FiShoppingCart,
    FiSettings,
    FiLogOut
} from 'react-icons/fi';

const menuItems = [
    { label: 'Dashboard', icon: FiGrid, href: '/admin' },
    { label: 'Products', icon: FiShoppingBag, href: '/admin/products' },
    { label: 'Categories', icon: FiLayers, href: '/admin/categories' },
    { label: 'Orders', icon: FiShoppingCart, href: '/admin/orders' },
    { label: 'Users', icon: FiUsers, href: '/admin/users' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                        SHJ Admin
                    </span>
                </Link>
            </div>

            <nav className="mt-6 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-amber-50 text-[var(--color-primary,#D4AF37)]'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-primary,#D4AF37)]' : ''}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-8 left-0 w-full px-4">
                <button
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-all"
                    onClick={() => {
                        // Implement logout logic or redirect to main site logout
                        window.location.href = '/';
                    }}
                >
                    <FiLogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
