'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { toast } from 'sonner';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success('Thank you for contacting us! We will get back to you soon.');
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src="/contact_hero_jewelry_1766407469488.png"
                    alt="Contact Us"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 shadow-inner" />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-white text-5xl md:text-7xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        Contact Us
                    </h1>
                    <p className="text-gray-100 text-xl font-light">We&apos;re here to help you find your perfect piece.</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                                Reach Out
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Whether you have a question about our collections, need help with sizing,
                                or want to discuss a custom design, our team is ready to assist you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-5 group">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#d4a574] shrink-0 transform group-hover:scale-110 transition-transform">
                                    <FiPhone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                                    <p className="text-gray-600">+91 98765 43210</p>
                                    <p className="text-gray-600">+91 12345 67890</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#d4a574] shrink-0 transform group-hover:scale-110 transition-transform">
                                    <FiMail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                                    <p className="text-gray-600">contact@shj.com</p>
                                    <p className="text-gray-600">support@shj.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#d4a574] shrink-0 transform group-hover:scale-110 transition-transform">
                                    <FiMapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                                    <p className="text-gray-600">
                                        Shree Harikrupa Jewellers<br />
                                        Main Street, Diamond Lane,<br />
                                        Surat, Gujarat - 395006
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#d4a574] shrink-0 transform group-hover:scale-110 transition-transform">
                                    <FiClock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Store Hours</h3>
                                    <p className="text-gray-600">Mon - Sat: 10:00 AM - 8:30 PM</p>
                                    <p className="text-gray-600">Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                                Send a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        placeholder="Enter your name"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d4a574]/20 focus:border-[#d4a574] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        placeholder="Enter your email"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d4a574]/20 focus:border-[#d4a574] outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label htmlFor="subject" className="text-sm font-semibold text-gray-700 ml-1">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        required
                                        placeholder="What is this regarding?"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d4a574]/20 focus:border-[#d4a574] outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-gray-700 ml-1">Your Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={6}
                                        placeholder="Write your message here..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d4a574]/20 focus:border-[#d4a574] outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto bg-[#d4a574] hover:bg-[#c19468] text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-[#d4a574]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Sending...' : (
                                            <>
                                                Send Message
                                                <FiSend className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Mockup */}
                <div className="mt-24 h-[500px] rounded-3xl overflow-hidden shadow-xl grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.52982230407!2d72.75711684343118!3d21.159200203713045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1703248400000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
