'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { FiArrowRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const router = useRouter();

  return (
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
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full flex items-center justify-center overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={slide.id === 1}
                fetchPriority={slide.id === 1 ? "high" : undefined}
                sizes="(max-width: 1200px) 100vw, 1600px"
                quality={75}
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
                  className="bg-[#946f3a] text-white px-8 md:px-10 py-3 md:py-4 rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 font-semibold text-base md:text-lg animate-fade-in-up animation-delay-400"
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
  );
}
