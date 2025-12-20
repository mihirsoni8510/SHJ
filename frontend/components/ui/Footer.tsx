'use client';

import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 p-4">
            <div className="container mx-auto max-w-7xl py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* About */}
                    <div>
                        <h3 className="text-white text-xl font-bold mb-6">
                            Shree Harikrupa Jewellers
                        </h3>
                        <p className="text-sm leading-relaxed mb-6">
                            Discover timeless elegance with our handcrafted gold, diamond, and silver jewelry.
                            Celebrating beauty and tradition since 1990.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[var(--color-primary,#D4AF37)] transition-colors"
                                aria-label="Facebook"
                            >
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[var(--color-primary,#D4AF37)] transition-colors"
                                aria-label="Instagram"
                            >
                                <FiInstagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[var(--color-primary,#D4AF37)] transition-colors"
                                aria-label="Twitter"
                            >
                                <FiTwitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="hover:text-[var(--color-primary,#D4AF37)] transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections" className="hover:text-[var(--color-primary,#D4AF37)] transition-colors text-sm">
                                    Collections
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-[var(--color-primary,#D4AF37)] transition-colors text-sm">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-[var(--color-primary,#D4AF37)] transition-colors text-sm">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Customer Service</h4>
                        <ul className="space-y-3">
                            {/* <li>
                                <Link href="/shipping" className="hover:text-[var(--color-primary,#D4AF37)] transition-colors text-sm">
                                    Shipping Information
                                </Link>
                            </li> */}
                            <li>
                                <Link href="/returns" className="hover:text-[var(--color-primary,#D4AF37)] transition-colors text-sm">
                                    Exchange Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-[var(--color-primary,#D4AF37)] transition-colors text-sm">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-[var(--color-primary,#D4AF37)] transition-colors text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact Info</h4>
                        <ul className="space-y-4 mb-2">
                            <li className="flex items-start gap-3 text-sm">
                                <FiMapPin className="w-5 h-5 text-[var(--color-primary,#D4AF37)] flex-shrink-0 mt-0.5" />
                                <span>123 Jewelry Street, Mumbai, Maharashtra 400001</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <FiPhone className="w-5 h-5 text-[var(--color-primary,#D4AF37)] flex-shrink-0" />
                                <a href="tel:+911234567890" className="hover:text-[var(--color-primary,#D4AF37)] transition-colors">
                                    +91 123 456 7890
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <FiMail className="w-5 h-5 text-[var(--color-primary,#D4AF37)] flex-shrink-0" />
                                <a href="mailto:info@shreeharikrupa.com" className="hover:text-[var(--color-primary,#D4AF37)] transition-colors">
                                    info@shreeharikrupajewellers.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto max-w-7xl py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mt-2 gap-4">
                        <p className="text-sm text-gray-400">
                            © {currentYear} Shree Harikrupa Jewellers. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <Link href="/terms" className="text-gray-400 hover:text-[var(--color-primary,#D4AF37)] transition-colors">
                                Terms & Conditions
                            </Link>
                            <Link href="/privacy" className="text-gray-400 hover:text-[var(--color-primary,#D4AF37)] transition-colors">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
