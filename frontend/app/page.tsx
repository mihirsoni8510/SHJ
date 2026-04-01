import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProductsAction } from '@/app/actions/products';
import { FiArrowRight, FiPenTool } from 'react-icons/fi';
import HeroSlider from '@/components/HeroSlider';

export default async function HomePage() {
  const result = await getProductsAction({ limit: 8 });
  const products = result.products || [];

  const categories = [
    { name: 'Gold Jewelry', slug: 'gold', image: '/home/gold.webp' },
    { name: 'Diamond Jewelry', slug: 'diamond', image: '/home/diamond.jpg' },
    { name: 'Silver Jewelry', slug: 'silver', image: '/home/silver.jpg' },
  ];

  // Hero slider data
  const heroSlides = [
    {
      id: 1,
      image: '/home/hero-bg.jpg',
      title: 'Exquisite Jewellery Collection',
      subtitle: 'Discover timeless elegance with our handcrafted gold, diamond, and silver jewelry',
      buttonText: 'Shop Now',
      buttonLink: '/products'
    },
    {
      id: 2,
      image: '/home/gold.webp',
      title: 'Premium Gold Collection',
      subtitle: 'Crafted with precision, designed to perfection. Explore our exclusive gold jewelry',
      buttonText: 'Explore Gold',
      buttonLink: '/products?category=gold'
    },
    {
      id: 3,
      image: '/home/diamond.jpg',
      title: 'Brilliant Diamond Designs',
      subtitle: 'Experience luxury with our stunning diamond jewelry collection',
      buttonText: 'View Diamonds',
      buttonLink: '/products?category=diamond'
    },
    {
      id: 4,
      image: '/home/silver.jpg',
      title: 'Elegant Silver Jewelry',
      subtitle: 'Contemporary designs meeting traditional craftsmanship',
      buttonText: 'Shop Silver',
      buttonLink: '/products?category=silver'
    }
  ];

  return (
    <div>
      {/* Hero Slider Section - Client Component with Server-defined Data */}
      <HeroSlider slides={heroSlides} />

      {/* Shop by Category */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container px-4">
          {/* Heading */}
          <div className="text-center mb-10 md:14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Shop by Category
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Explore our curated collections
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 place-items-center">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="group relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                {/* Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                  <h3
                    className="text-white text-2xl md:text-3xl font-bold mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {category.name}
                  </h3>
                  <Link href={`/products?category=${category.slug}`} className="flex items-center text-[#d4a574] font-semibold group-hover:translate-x-2 transition-transform cursor-pointer">
                    View Collection
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 bg-amber-50/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Featured Products
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Handpicked selections just for you
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available yet.</p>
              <p className="text-gray-400 mt-2">Check back soon for our amazing collection!</p>
            </div>
          )}

          <div className="text-center mt-10 md:mt-12">
            <Link href="/products" className="btn btn-outline text-base md:text-lg px-6 md:px-8 py-3 md:py-4 inline-flex items-center gap-2 rounded-full">
              View All Products
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#d4a574]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Certified Jewelry</h3>
              <p className="text-gray-600 text-sm leading-relaxed">All our jewelry comes with BIS Hallmark certification ensuring maximum purity and trust.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#d4a574]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl"><FiPenTool /></span>
              </div>
              <h3 className="font-bold text-lg mb-2">Custom Design</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Create your dream jewelry with our expert designers. We bring your vision to life.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#d4a574]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">↩</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Exchange Policy</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Lifetime exchange on all gold jewelry purchases. Upgrade your style anytime you want.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
