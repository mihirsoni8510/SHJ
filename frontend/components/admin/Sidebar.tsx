import { usePathname, useRouter } from 'next/navigation';
import { useLogout } from '@/hooks/useApi';
import {
    FiGrid,
    FiShoppingBag,
    FiLayers,
    FiUsers,
    FiUser,
    FiShoppingCart,
    FiSettings,
    FiLogOut
} from 'react-icons/fi';
import Link from 'next/link';

const menuItems = [
    { label: 'Dashboard', icon: FiGrid, href: '/admin' },
    { label: 'Products', icon: FiShoppingBag, href: '/admin/products' },
    { label: 'Categories', icon: FiLayers, href: '/admin/categories' },
    { label: 'Orders', icon: FiShoppingCart, href: '/admin/orders' },
    { label: 'Users', icon: FiUsers, href: '/admin/users' },
    // { label: 'Profile', icon: FiUser, href: '/profile' },
];

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useLogout();

    const handleLogout = async () => {
        try {
            await logout.mutateAsync();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <aside
            className={`bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto transition-all duration-300 ease-in-out z-40 ${isOpen ? 'w-64' : 'w-20'
                } left-0 shadow-xl md:shadow-none`}
        >
            <div className={`p-6 transition-all duration-300 ${isOpen ? 'px-6' : 'px-4'}`}>
                <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
                    <div className="min-w-[40px] h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        S
                    </div>
                    <span className={`text-xl font-bold text-gray-900 whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 w-0'
                        }`} style={{ fontFamily: 'var(--font-heading)' }}>
                        SHJ Admin
                    </span>
                </Link>
            </div>

            <nav className={`mt-6 space-y-2 transition-all duration-300 ${isOpen ? 'px-4' : 'px-2'}`}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={!isOpen ? item.label : ''}
                            className={`flex items-center gap-3 rounded-xl transition-all ${isOpen ? 'px-4 py-3' : 'p-3 justify-center'
                                } ${isActive
                                    ? 'bg-amber-50 text-[var(--color-primary,#D4AF37)]'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 min-w-[20px] ${isActive ? 'text-[var(--color-primary,#D4AF37)]' : ''}`} />
                            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 w-0'
                                }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className={`absolute bottom-8 left-0 w-full transition-all duration-300 ${isOpen ? 'px-4' : 'px-2'}`}>
                <button
                    className={`flex items-center gap-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-all ${isOpen ? 'px-4 py-3' : 'p-3 justify-center'
                        }`}
                    onClick={handleLogout}
                    disabled={logout.isPending}
                >
                    <FiLogOut className={`w-5 h-5 min-w-[20px] ${logout.isPending ? 'animate-pulse' : ''}`} />
                    <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 w-0'
                        }`}>
                        {logout.isPending ? 'Logging out...' : 'Logout'}
                    </span>
                </button>
            </div>
        </aside>
    );
}
