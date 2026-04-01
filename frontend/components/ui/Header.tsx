'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { useState } from 'react';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth, useCart, useWishlist, useLogout } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const router = useRouter();

    const { data: user } = useAuth();
    const { data: cartItems = [] } = useCart();
    const { data: wishlistItems = [] } = useWishlist();
    const logout = useLogout();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = async () => {
        try {
            await logout.mutateAsync();
            await signOut({ redirect: false });
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/collections', label: 'Collections' },
        { href: '/products?category=gold', label: 'Gold' },
        { href: '/products?category=diamond', label: 'Diamond' },
        { href: '/products?category=silver', label: 'Silver' },
    ];

    return (
        <header className="sticky top-0 bg-white z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 group">
                    <div className="relative w-8 h-8 sm:w-10 h-10 flex-shrink-0 overflow-hidden transform group-hover:scale-110 transition-transform duration-300">
                        <NextImage 
                            src="/logo-icon.png" 
                            alt="SHJ Logo" 
                            fill 
                            className="object-contain"
                            priority
                            fetchPriority="high"
                        />
                    </div>
                    <h1 className="text-sm sm:text-lg md:text-2xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        <span className="inline sm:hidden">SHJ</span>
                        <span className="hidden sm:inline">Shree Harikrupa Jewellers</span>
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-gray-700 hover:text-[#946f3a] font-medium transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
                    {/* Search */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 lg:p-3 text-gray-700 hover:text-[#946f3a] transition-colors relative"
                        aria-label="Search items"
                    >
                        <FiSearch className="w-5 h-5 lg:w-6 h-6" />
                    </button>
                    
                    {/* Wishlist */}
                    <Link
                        href="/wishlist"
                        className="relative p-2 lg:p-3 text-gray-700 hover:text-[#946f3a] transition-colors"
                        aria-label="Wishlist"
                    >
                        <FiHeart className="w-5 h-5 lg:w-6 h-6" />
                        {wishlistItems.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 bg-[#946f3a] text-white text-[8px] lg:text-[10px] w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full flex items-center justify-center font-bold">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative p-2 lg:p-3 text-gray-700 hover:text-[#946f3a] transition-colors"
                        aria-label="Cart"
                    >
                        <FiShoppingCart className="w-5 h-5 lg:w-6 h-6" />
                        {cartItems.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 bg-[#946f3a] text-white text-[8px] lg:text-[10px] w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full flex items-center justify-center font-bold">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    {/* User Menu / Login */}
                    <div className="relative">
                        {user ? (
                            <>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="p-2 lg:p-3 text-gray-700 hover:text-[#946f3a] transition-colors flex items-center gap-1"
                                    aria-label="User menu"
                                >
                                    <FiUser className="w-5 h-5 lg:w-6 h-6" />
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[100] animate-fade-in">
                                        {user.role === 'ADMIN' && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-[#946f3a] transition-colors font-medium border-b border-gray-50"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-[#946f3a] transition-colors"
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/orders"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-[#946f3a] transition-colors"
                                        >
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 mt-1 border-t border-gray-50 pt-3"
                                        >
                                            <FiLogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="p-2 lg:p-3 text-gray-700 hover:text-[#946f3a] transition-colors"
                                aria-label="Login"
                            >
                                <FiUser className="w-5 h-5 lg:w-6 h-6" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-gray-700 hover:text-[#946f3a] transition-colors"
                        aria-label="Menu"
                    >
                        {isMenuOpen ? (
                            <FiX className="w-5 h-5" />
                        ) : (
                            <FiMenu className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
                <div
                    className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out p-6 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Menu</h2>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close menu">
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-2 overflow-y-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-800 hover:text-[var(--color-primary,#D4AF37)] hover:bg-amber-50 font-medium transition-colors px-4 py-3 rounded-xl flex items-center"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto pt-8 border-t border-gray-100">
                        {user ? (
                            <div className="space-y-2">
                                <Link
                                    href="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-gray-700 hover:bg-amber-50 rounded-xl"
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"
                                >
                                    <FiLogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full text-center bg-[var(--color-primary,#D4AF37)] text-white py-3 rounded-xl font-semibold"
                            >
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .animate-fadeIn {
                  animation: fadeIn 0.3s ease-out;
                }
                @keyframes slideDown {
                  from {
                    opacity: 0;
                    transform: translateY(-20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .animate-slideDown {
                  animation: slideDown 0.3s ease-out;
                }
            `}} />

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-2 sm:pt-20 px-2 sm:px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleSearch} className="relative flex items-center gap-2 sm:gap-4">
                                <FiSearch className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 shrink-0" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search for jewelry..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-lg sm:text-xl outline-none text-gray-800 placeholder:text-gray-400 py-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 shrink-0"
                                    aria-label="Close search"
                                >
                                    <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </form>
                            <div className="mt-3 sm:mt-4 border-t pt-4 sm:pt-6">
                                <div className="text-center text-sm sm:text-base text-gray-500 font-medium">
                                    {searchQuery ? (
                                        <p>Press Enter to search for &quot;{searchQuery}&quot;</p>
                                    ) : (
                                        <p>Start typing to search...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Click outside to close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={() => setIsSearchOpen(false)}
                    />
                </div>
            )}
        </header>
    );
}
