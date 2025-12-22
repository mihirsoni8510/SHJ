'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiAward, FiUsers, FiHexagon, FiHeart } from 'react-icons/fi';

export default function AboutPage() {
    const stats = [
        { label: 'Years of Excellence', value: '25+', icon: <FiAward className="w-6 h-6" /> },
        { label: 'Happy Customers', value: '50k+', icon: <FiUsers className="w-6 h-6" /> },
        { label: 'Unique Designs', value: '10k+', icon: <FiHexagon className="w-6 h-6" /> },
        { label: 'Crafted with Love', value: '100%', icon: <FiHeart className="w-6 h-6" /> },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
                <Image
                    src="/about_hero_jewelry_1766407449305.png"
                    alt="Our Craftsmanship"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        Our Story
                    </h1>
                    <p className="text-gray-200 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Legacy of elegance, crafted for generations. Discover the heart behind Shree Harikrupa Jewellers.
                    </p>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                            A Heritage of Trust and Brillance
                        </h2>
                        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                            <p>
                                Since our inception, Shree Harikrupa Jewellers (SHJ) has been synonymous with purity,
                                exquisite craftsmanship, and timeless beauty. What started as a small boutique has grown
                                into a destination for those who seek more than just jewelry—they seek a legacy.
                            </p>
                            <p>
                                Every piece in our collection is a testament to our commitment to excellence.
                                We blend traditional techniques with modern aesthetics to create jewelry that
                                resonates with the contemporary woman while honoring our cultural heritage.
                            </p>
                            <p>
                                Our master craftsmen pour their skill and passion into every detail, ensuring
                                that each diamond spark, gold curve, and silver shine is nothing short of perfection.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/home/hero-bg.jpg"
                            alt="Exquisite Jewelry Display"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-amber-50/50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-[#d4a574]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#d4a574] transition-all group-hover:bg-[#d4a574] group-hover:text-white transform group-hover:scale-110 shadow-sm">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-gray-500 uppercase tracking-widest text-xs font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                        Our Core Values
                    </h2>
                    <p className="text-gray-500 text-lg">The principles that guide every masterpiece we create.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition-shadow text-center">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Uncompromising Purity</h3>
                        <p className="text-gray-600">
                            We use only the finest materials, from BIS Hallmarked gold to the most brilliant,
                            ethically sourced diamonds. Purity is not just a promise; it&apos;s our foundation.
                        </p>
                    </div>
                    <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition-shadow text-center">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Artistry in Every Detail</h3>
                        <p className="text-gray-600">
                            Our designs are born from a fusion of imagination and meticulous skill.
                            We believe that every piece of jewelry should tell a unique story.
                        </p>
                    </div>
                    <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition-shadow text-center">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Customer Centricity</h3>
                        <p className="text-gray-600">
                            Your trust is our greatest asset. From personalized consultations to lifetime
                            exchange policies, we are dedicated to providing an unparalleled experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 bg-[#d4a574]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-white text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                        Experience Elegance Like Never Before
                    </h2>
                    <p className="text-orange-50 text-xl mb-12 font-light">
                        Join the thousands of happy families who have made SHJ a part of their cherished moments.
                    </p>
                    <Link
                        href="/products"
                        className="bg-white text-[#d4a574] px-12 py-5 rounded-full font-bold text-lg shadow-2xl hover:bg-orange-50 transition-colors inline-block"
                    >
                        Browse Our Collection
                    </Link>
                </div>
            </section>
        </div>
    );
}
