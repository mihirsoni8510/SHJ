'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useApi';
import { FiArrowRight, FiPenTool } from 'react-icons/fi';

export default function HomePage() {
  const router = useRouter();
  const { data, isLoading } = useProducts({ limit: 8 });

  const categories = [
    { name: 'Gold Jewelry', slug: 'gold', image: '/home/gold.webp' },
    { name: 'Diamond Jewelry', slug: 'diamond', image: '/home/diamond.jpg' },
    { name: 'Silver Jewelry', slug: 'silver', image: '/home/silver.jpg' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section>
        <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <Image
            src="/home/hero-bg.jpg"
            alt="Exquisite Jewelry Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <h2 className="text-white text-5xl md:text-7xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Exquisite jewellery Collection
            </h2>
            <p className="text-gray-100 text-xl md:text-2xl mb-10 max-w-2xl font-light">
              Discover timeless elegance with our handcrafted gold, diamond, and silver jewelry
            </p>
            <button
              onClick={() => router.push('/products')}
              className="bg-[#d4a574]  text-white px-10 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 font-semibold text-lg"
            >
              Shop Now
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 bg-white">
        <div className="container">
          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Explore our curated collections
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="group relative w-full max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

                {/* Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20">
                  <h3
                    className="text-white text-2xl sm:text-3xl font-bold mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {category.name}
                  </h3>
                  {/* <div className="flex items-center text-[var(--color-primary,#D4AF37)] font-semibold group-hover:translate-x-2 transition-transform">
                    Explore Collection
                    <FiArrowRight className="ml-2" />
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Featured Products */}
      <section className="section bg-amber-50/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked selections just for you
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-96 rounded-lg"></div>
              ))}
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available yet.</p>
              <p className="text-gray-400 mt-2">Check back soon for our amazing collection!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products" className="btn btn-outline text-lg px-8 py-4 inline-flex items-center gap-2">
              View All Products
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary,#D4AF37)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Certified Jewelry</h3>
              <p className="text-gray-600 text-sm">All our jewelry comes with BIS Hallmark certification</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary,#D4AF37)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl"><FiPenTool /></span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Custom Design</h3>
              <p className="text-gray-600 text-sm">Create your dream jewelry with our expert designers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary,#D4AF37)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">↩</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Exchange Policy</h3>
              <p className="text-gray-600 text-sm">Lifetime exchange on all gold jewelry purchases</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
