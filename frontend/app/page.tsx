'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useApi';
import { FiArrowRight, FiPenTool } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function HomePage() {
  const router = useRouter();
  const { data, isLoading } = useProducts({ limit: 8 });

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
      {/* Hero Slider Section */}
      <section className="hero-slider-section">
            <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          loop={true}
          className="hero-swiper h-[500px] md:h-[600px]"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full flex items-center justify-center overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                  <h2
                    className="text-white text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight animate-fade-in-up px-4"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {slide.title}
                  </h2>
                  <p className="text-gray-100 text-lg sm:text-xl md:text-2xl mb-8 md:mb-10 max-w-2xl font-light animate-fade-in-up animation-delay-200 px-4">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => router.push(slide.buttonLink)}
                    className="bg-[#d4a574] text-white px-8 md:px-10 py-3 md:py-4 rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 font-semibold text-base md:text-lg animate-fade-in-up animation-delay-400"
                  >
                    {slide.buttonText}
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </section>

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
                />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                  <h3
                    className="text-white text-2xl md:text-3xl font-bold mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {category.name}
                  </h3>
                  <div className="flex items-center text-[#d4a574] font-semibold group-hover:translate-x-2 transition-transform cursor-pointer">
                    View Collection
                    <FiArrowRight className="ml-2" />
                  </div>
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

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-64 md:h-96 rounded-lg"></div>
              ))}
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
