'use client';

import { useState, useEffect } from 'react';
import { useCart, useAuth, useCreateOrder } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiCreditCard, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const { data: cartItems = [], isLoading: isCartLoading } = useCart();
    const { data: user, isLoading: isAuthLoading } = useAuth();
    const createOrder = useCreateOrder();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthLoading && !user) {
            router.push('/auth/login?callbackUrl=/checkout');
            return;
        }

        // Redirect if cart is empty
        if (!isCartLoading && cartItems.length === 0 && !createOrder.isSuccess) {
            router.push('/cart');
            return;
        }

        // Set initial form data
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || '',
            }));
        }
    }, [user, isAuthLoading, cartItems, isCartLoading, router, createOrder.isSuccess]);

    if (isCartLoading || isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || (cartItems.length === 0 && !createOrder.isSuccess)) {
        return null;
    }

    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.product.salePrice || item.product.price;
        return sum + price * item.quantity;
    }, 0);

    const tax = subtotal * 0.03; // 3% GST
    const shipping = subtotal > 25000 ? 0 : 500;
    const total = subtotal + tax + shipping;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
            toast.error('Please fill in all shipping details');
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        if (!/^[0-9]{6}$/.test(formData.pincode)) {
            toast.error('Please enter a valid 6-digit pincode');
            return;
        }

        createOrder.mutate({
            address: formData,
            paymentMethod,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-8 sm:pt-12">
            <div className="container mx-auto max-w-7xl px-4">
                {/* Header Navigation */}
                <div className="mb-8">
                    <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-amber-700 font-medium transition-colors">
                        <FiChevronLeft className="mr-1" />
                        Back to Cart
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
                    {/* Left Side: Checkout Form */}
                    <div className="flex-1 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Shipping Information */}
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-700">
                                        <FiTruck className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                                        Shipping Details
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            required
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                            placeholder="6 digits"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address</label>
                                        <textarea
                                            name="address"
                                            required
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                                            placeholder="House block, Street name, Area"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Surat"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            required
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Gujarat"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-700">
                                        <FiCreditCard className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                                        Payment Method
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-amber-600 bg-amber-50/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={() => setPaymentMethod('COD')}
                                            className="w-5 h-5 text-amber-600 focus:ring-amber-500 border-gray-300"
                                        />
                                        <div className="ml-4">
                                            <p className="font-bold text-gray-900">Cash on Delivery (COD)</p>
                                            <p className="text-sm text-gray-500">Pay when your jewelry arrives</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border border-gray-100 rounded-xl opacity-50 cursor-not-allowed bg-gray-50/50">
                                        <input
                                            disabled
                                            type="radio"
                                            name="paymentMethod"
                                            value="ONLINE"
                                            className="w-5 h-5 border-gray-300"
                                        />
                                        <div className="ml-4">
                                            <p className="font-bold text-gray-900">Online Payment (Coming Soon)</p>
                                            <p className="text-sm text-gray-500">Secure payment via UPI, Card, or NetBanking</p>
                                        </div>
                                    </label>
                                </div>
                            </section>
                            
                            {/* Submit Button (Mobile) */}
                            <div className="lg:hidden">
                                <button
                                    type="submit"
                                    disabled={createOrder.isPending}
                                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-amber-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    {createOrder.isPending ? 'Placing Order...' : `Pay ₹${total.toLocaleString('en-IN')}`}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:sticky lg:top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Order</h2>
                            
                            {/* Item List */}
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 thin-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                            <Image 
                                                src={item.product.images?.[0] || '/placeholder.jpg'}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.product.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            <p className="font-bold text-amber-700 text-sm mt-0.5">₹{(item.product.salePrice || item.product.price).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        GST (3%)
                                    </span>
                                    <span>₹{tax.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'text-green-600 font-bold' : ''}>
                                        {shipping === 0 ? 'FREE' : `+₹${shipping.toLocaleString('en-IN')}`}
                                    </span>
                                </div>
                                
                                <div className="pt-4 mt-2 border-t border-gray-200">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-amber-700">₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                    <p className="text-[10px] text-center text-gray-400 mt-2">All prices are inclusive of taxes where applicable</p>
                                </div>
                            </div>

                            {/* Submit Button (Desktop) */}
                            <button
                                onClick={handleSubmit}
                                disabled={createOrder.isPending}
                                className="hidden lg:block w-full mt-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-amber-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {createOrder.isPending ? 'Placing Order...' : `Confirm Order (₹${total.toLocaleString('en-IN')})`}
                            </button>
                            
                            {/* Security Trust */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-green-600 font-medium">
                                <FiCheckCircle className="w-4 h-4" />
                                <span>Safe and Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .thin-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .thin-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .thin-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
