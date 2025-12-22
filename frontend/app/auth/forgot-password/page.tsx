'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPassword } from '@/hooks/useApi';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const forgotPassword = useForgotPassword();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        try {
            await forgotPassword.mutateAsync(data.email);
            setIsSubmitted(true);
        } catch (error) {
            // Error handled by mutation
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <FiCheckCircle className="w-10 h-10" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            Check your email
                        </h1>
                        <p className="text-gray-600 mb-8">
                            If an account exists with that email, we have sent a password reset link. Please check your inbox and follow the instructions.
                        </p>
                        <Link
                            href="/auth/login"
                            className="btn btn-primary w-full text-lg py-3 flex items-center justify-center gap-2"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 to-orange-50">
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
                            Forgot Password?
                        </h1>
                        <p className="text-gray-600">
                            No worries, we&apos;ll send you reset instructions.
                        </p>
                    </div>

                    {/* Forgot Password Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FiMail className="w-5 h-5" />
                                </div>
                                <input
                                    {...register('email')}
                                    type="email"
                                    id="email"
                                    placeholder="you@example.com"
                                    className="input !pl-12"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={forgotPassword.isPending}
                            className="btn btn-primary w-full text-lg py-3"
                        >
                            {forgotPassword.isPending ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/auth/login"
                            className="text-sm font-semibold text-[var(--color-primary,#D4AF37)] hover:underline flex items-center justify-center gap-2"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
