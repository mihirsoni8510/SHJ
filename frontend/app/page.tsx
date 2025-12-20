'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useApi';
import { FiArrowRight } from 'react-icons/fi';

export default function HomePage() {
  const router = useRouter();
  const { data, isLoading } = useProducts({ limit: 8 });

  const categories = [
    { name: 'Gold Jewelry', slug: 'gold', image: '/images/gold.jpg' },
    { name: 'Diamond Jewelry', slug: 'diamond', image: '/images/diamond.jpg' },
    { name: 'Silver Jewelry', slug: 'silver', image: '/images/silver.jpg' },
  ];

  return (
    <div>
      {/* Hero Section */}

      <div className="relative h-[600px] flex items-center justify-center bg-red-500 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white mb-4">
            Exquisite Jewelry Collection
          </h2>
          <p className="text-xl mb-8 max-w-xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Discover timeless elegance with our handcrafted gold, diamond, and silver jewelry
          </p>
          <button
            onClick={() => router.push('/products')}
            className="btn btn-primary bg-amber-700  text-white px-8 py-3 rounded-md transition-colors "
          >
            Shop Now
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>


      {/* Shop by Category */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our curated collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col items-center text-center">
                  <h3 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center text-[var(--color-primary,#D4AF37)] font-semibold group-hover:translate-x-2 transition-transform">
                    Explore Collection
                    <FiArrowRight className="ml-2" />
                  </div>
                </div>
              </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary,#D4AF37)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Certified Jewelry</h3>
              <p className="text-gray-600 text-sm">100% hallmarked & certified</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary,#D4AF37)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">Safe & secure transactions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary,#D4AF37)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">On orders above ₹25,000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary,#D4AF37)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">↩</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">15-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
