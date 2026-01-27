'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { Star } from 'lucide-react';

interface TestimonialItem {
  name: string;
  role: string;
  avatar: string;
  content: string;
}

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => (
  <div className="flex-shrink-0 w-full max-w-sm p-6 md:p-4 md:max-w-xs transition-all duration-300 bg-white/[0.02] border border-white/5 rounded-xl hover:border-coinlect-accent/50 group">
    <div className="flex items-center gap-4 mb-4 md:gap-3 md:mb-3">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="flex-shrink-0 object-cover w-12 h-12 border rounded-full md:w-10 md:h-10 border-white/10"
      />
      <div>
        <h4 className="font-semibold text-white md:text-sm">{testimonial.name}</h4>
        <p className="text-sm text-gray-400 md:text-xs">{testimonial.role}</p>
      </div>
    </div>
    <div className="flex gap-1 mb-4 md:mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className="text-yellow-400 md:w-3 md:h-3 fill-yellow-400" />
      ))}
    </div>
    <blockquote className="text-base leading-relaxed text-gray-300 md:text-sm font-body">
      {testimonial.content}
    </blockquote>
  </div>
);

export const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Split testimonials into chunks for scrolling animation
  const testimonials = t.testimonials.items;
  const chunkSize = 3;
  const testimonialChunks = [];

  for (let i = 0; i < testimonials.length; i += chunkSize) {
    testimonialChunks.push(testimonials.slice(i, i + chunkSize));
  }

  // For desktop: only show first 2 rows
  const desktopChunks = testimonialChunks.slice(0, 2);

  // Create repeated arrays for smooth scrolling (more repetitions for seamless scrolling)
  const displayChunks = [...testimonialChunks, ...testimonialChunks, ...testimonialChunks, ...testimonialChunks, ...testimonialChunks, ...testimonialChunks];

  // Reset interaction state when component mounts or user interaction times out
  useEffect(() => {
    if (isUserInteracting) {
      const timer = setTimeout(() => {
        setIsUserInteracting(false);
      }, 3000); // Resume auto-scroll after 3 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [isUserInteracting]);

  return (
    <section className="relative py-24 overflow-hidden bg-black">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px]"></div>

      <div className="container relative z-10 px-6 mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold font-heading">
              {t.testimonials.title} <span className="text-coinlect-accent">{t.testimonials.titleSuffix}</span>
            </h2>
            <p className="max-w-xl mx-auto text-base text-gray-500 font-body">
              {t.testimonials.desc}
            </p>
          </div>
        </ScrollReveal>

        {/* Mobile: Single row scrolling with manual control */}
        <div className="md:hidden">
          <div className="relative w-full overflow-x-auto scrollbar-hide">
            <div
              ref={mobileScrollRef}
              className={`flex gap-6 py-4 transition-all duration-300 min-w-max ${
                isUserInteracting ? '' : 'animate-scroll-left-mobile'
              } cursor-grab active:cursor-grabbing select-none`}
              onMouseDown={(e) => {
                if (!mobileScrollRef.current) return;
                setIsUserInteracting(true);
                const container = mobileScrollRef.current;
                let isDown = true;
                let startX = e.pageX - container.offsetLeft;
                let scrollLeft = container.scrollLeft;

                const handleMouseMove = (e: MouseEvent) => {
                  if (!isDown) return;
                  e.preventDefault();
                  const x = e.pageX - container.offsetLeft;
                  const walk = (x - startX) * 2;
                  container.scrollLeft = scrollLeft - walk;
                };

                const handleMouseUp = () => {
                  isDown = false;
                  // Resume automatic scrolling after a delay
                  setTimeout(() => setIsUserInteracting(false), 2000);
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
              onTouchStart={(e) => {
                if (!mobileScrollRef.current) return;
                setIsUserInteracting(true);
                const container = mobileScrollRef.current;
                const touch = e.touches[0];
                let startX = touch.pageX - container.offsetLeft;
                let scrollLeft = container.scrollLeft;

                const handleTouchMove = (e: TouchEvent) => {
                  const touch = e.touches[0];
                  const x = touch.pageX - container.offsetLeft;
                  const walk = (x - startX) * 2;
                  container.scrollLeft = scrollLeft - walk;
                };

                const handleTouchEnd = () => {
                  // Resume automatic scrolling after a delay
                  setTimeout(() => setIsUserInteracting(false), 2000);
                  container.removeEventListener('touchmove', handleTouchMove);
                  container.removeEventListener('touchend', handleTouchEnd);
                };

                container.addEventListener('touchmove', handleTouchMove);
                container.addEventListener('touchend', handleTouchEnd);
              }}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayChunks.flat().map((testimonial, idx) => (
                <TestimonialCard
                  key={`mobile-${testimonial.name}-${idx}`}
                  testimonial={testimonial}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: Only 2 rows scrolling */}
        <div className="hidden gap-8 md:flex md:flex-col">
          {desktopChunks.map((chunk, chunkIndex) => (
            <div key={`chunk-${chunkIndex}`} className="relative w-full overflow-hidden mask-image-gradient-sides">
              <div className={`flex gap-6 py-4 ${chunkIndex % 2 === 0 ? 'animate-scroll-left' : 'animate-scroll-right'} hover:pause-animation`}>
                {[...chunk, ...chunk, ...chunk, ...chunk].map((testimonial, idx) => (
                  <TestimonialCard
                    key={`${chunkIndex}-${testimonial.name}-${idx}`}
                    testimonial={testimonial}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-16.666%); } /* Move 1/6 since we have 6 repetitions */
        }
        @keyframes scrollRight {
          0% { transform: translateX(-16.666%); }
          100% { transform: translateX(0); }
        }

        /* Mobile: Continuous scrolling with frequent card passing */
        @keyframes scrollLeftMobile {
          0% { transform: translateX(0); }
          100% { transform: translateX(-16.666%); } /* Move 1/6 for 6 repetitions */
        }

        .animate-scroll-left {
          animation: scrollLeft 30s linear infinite;
        }
        .animate-scroll-right {
          animation: scrollRight 30s linear infinite;
        }
        .animate-scroll-left-mobile {
          animation: scrollLeftMobile 25s linear infinite;
        }

        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }

        /* Remove mask for mobile to allow full manual scrolling */
        .md\\:hidden .mask-image-gradient-sides {
          mask-image: none;
          -webkit-mask-image: none;
        }

        .mask-image-gradient-sides {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};