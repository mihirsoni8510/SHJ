'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn('google', { callbackUrl: '/' });
        } catch (error) {
            console.error('Google sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                    <div className="flex justify-center mb-6">
                        <Link href="/" className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                            SHJ
                        </Link>
                    </div>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            Welcome Back
                        </h1>
                        <p className="text-gray-600">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Google Login Only */}
                    <div className="space-y-4">
                        <p className="text-sm text-center text-gray-500 mb-6">
                            Please use your Google account to access your portfolio, orders, and more.
                        </p>

                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-300 rounded-xl text-gray-700 font-bold text-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 active:scale-[0.98]"
                        >
                            <FcGoogle className="w-7 h-7" />
                            {isLoading ? 'Connecting...' : 'Continue with Google'}
                        </button>

                        <div className="pt-6 text-center">
                            <Link
                                href="/"
                                className="text-sm text-gray-500 hover:text-[var(--color-primary,#D4AF37)] transition-colors"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
