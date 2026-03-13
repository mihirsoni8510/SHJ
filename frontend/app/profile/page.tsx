'use client';

import { useAuth, useUpdateProfile } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiUser, FiSettings, FiShoppingBag, FiMapPin, FiHeart, FiLogOut, FiEdit2, FiSave } from 'react-icons/fi';

export default function ProfilePage() {
    const { data: user, isLoading } = useAuth();
    const router = useRouter();
    const updateProfile = useUpdateProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
        if (user) {
            setName(user.name);
            setPhone(user.phone || '');
        }
    }, [user, isLoading, router]);

    const handleUpdate = async () => {
        try {
            await updateProfile.mutateAsync({ name, phone });
            setIsEditing(false);
        } catch (error) {
            // Error handled by hook
        }
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>My Account</h1>
                    <p className="text-gray-500 mt-2">Manage your personal information and view your order history.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-2">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 text-center">
                            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-3xl mx-auto mb-4">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="font-bold text-gray-900 truncate">{user.name}</h2>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            <div className="mt-2 inline-flex px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-700">
                                {user.role}
                            </div>
                        </div>

                        {[
                            { icon: FiUser, label: 'Personal Info', active: true },
                            { icon: FiShoppingBag, label: 'My Orders', href: '/orders' },
                            { icon: FiHeart, label: 'Wishlist', href: '/wishlist' },
                            { icon: FiMapPin, label: 'Addresses', disabled: true },
                            { icon: FiSettings, label: 'Account Settings', disabled: true },
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={() => item.href && router.push(item.href)}
                                disabled={item.disabled}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                    ? 'bg-amber-50 text-amber-600 shadow-sm'
                                    : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                    } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                                    >
                                        <FiEdit2 className="w-4 h-4" /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            disabled={updateProfile.isPending}
                                            className="flex items-center gap-2 text-sm font-semibold text-white bg-amber-500 px-4 py-1.5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                                        >
                                            <FiSave className="w-4 h-4" /> {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-semibold text-lg">{user.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Email Address</label>
                                        <p className="text-gray-900 font-semibold text-lg">{user.email}</p>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Verified
                                        </span>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="Enter phone number"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-semibold text-lg">{user.phone || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Member Since</label>
                                        <p className="text-gray-900 font-semibold text-lg">
                                            {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-amber-50 rounded-xl">
                                    <FiShoppingBag className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Recent Activity</h4>
                                    <p className="text-sm text-gray-500 font-medium">Your recent interactions with Shree Harikrupa Jewellers.</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <div className="text-center py-8">
                                    <p className="text-gray-400 font-medium">No recent orders found.</p>
                                    <button
                                        onClick={() => router.push('/products')}
                                        className="mt-4 text-amber-600 font-bold hover:underline"
                                    >
                                        Start Shopping →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
