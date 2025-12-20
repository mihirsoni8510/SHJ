'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth, useCart, useWishlist, useLogout } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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



    const handleLogout = () => {
        logout.mutate();
        router.push('/');
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/collections', label: 'Collections' },
        { href: '/products?category=gold', label: 'Gold' },
        { href: '/products?category=diamond', label: 'Diamond' },
        { href: '/products?category=silver', label: 'Silver' },
    ];

    return (
        <div className="flex items-center justify-between h-16">
            <div className="container mx-5 max-w-7xl">
                {/* Top Bar */}
                <div className="flex items-center justify-between py-4 px-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                            Shree Harikrupa Jewellers
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-[var(--color-primary,#D4AF37)] font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center justify-between gap-3 h-16">
                        {/* Search */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Search"
                        >
                            <FiSearch className="w-5 h-5" />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Wishlist"
                        >
                            <FiHeart className="w-5 h-5" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[var(--color-primary,#D4AF37)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Cart"
                        >
                            <FiShoppingCart className="w-5 h-5" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[var(--color-primary,#D4AF37)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative group">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <FiUser className="w-5 h-5" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="p-4 border-b">
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/orders"
                                            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2 text-red-600"
                                        >
                                            <FiLogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Login"
                            >
                                <FiUser className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Menu"
                        >
                            {isMenuOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-b animate-fadeIn">
                        <nav className="flex flex-col space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-gray-700 hover:text-[var(--color-primary,#D4AF37)] font-medium transition-colors py-2"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
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
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="relative flex items-center gap-4">
                                <FiSearch className="w-6 h-6 text-gray-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search for jewelry..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-xl outline-none text-gray-800 placeholder:text-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </form>
                            <div className="mt-4 border-t pt-6">
                                <div className="text-center text-gray-500">
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
        </div>
    );
}
