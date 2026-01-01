'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { RiShieldKeyholeLine, RiErrorWarningLine } from 'react-icons/ri';
import { useAuth, useLogout } from '@/hooks/useApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const { data: user, isLoading: isAuthLoading } = useAuth();
    const { mutate: logout } = useLogout();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user && user.role.toLowerCase() === 'admin') {
            router.push('/admin');
        }
    }, [user, router]);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn('google', { callbackUrl: '/admin' });
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    const isNonAdminUser = user && user.role.toLowerCase() !== 'admin';

    return (
        <div className="min-h-screen flex items-center justify-center  px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 md:p-10">
                        <div className="text-center mb-8">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isNonAdminUser ? 'bg-red-100' : 'bg-amber-100'}`}>
                                {isNonAdminUser ? (
                                    <RiErrorWarningLine className="w-8 h-8 text-red-600" />
                                ) : (
                                    <RiShieldKeyholeLine className="w-8 h-8 text-amber-600" />
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {isNonAdminUser ? 'Access Denied' : 'Admin Dashboard'}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {isNonAdminUser
                                    ? 'You are logged in, but you do not have administrator permissions.'
                                    : 'Secure access for administrators only'}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {isNonAdminUser ? (
                                <>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 mb-4">
                                        Signed in as <strong>{user?.email}</strong>
                                    </div>
                                    <button
                                        onClick={() => logout()}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                                    >
                                        Sign out & Switch Account
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FcGoogle className="w-6 h-6" />
                                    {isLoading ? 'Authenticating...' : 'Sign in with Google'}
                                </button>
                            )}

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        {isNonAdminUser ? 'Actions' : 'Restricted Access'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-center text-xs text-gray-400">
                                <Link href="/" className="text-amber-600 hover:underline">
                                    Return to Main Site
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                        <p className="text-xs text-center text-gray-500">
                            &copy; {new Date().getFullYear()} SHJ Admin Panel. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
