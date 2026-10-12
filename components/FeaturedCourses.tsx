'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useCourses } from '../hooks/useCourses';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FeaturedCourses: React.FC = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const isFr = language === 'fr';
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use React Query hook for courses - filter for video courses
  const { data: allCourses = [], isLoading } = useCourses();

  // Process video courses (courses with videoLink)
  const featuredCourses = useMemo(() => {
    if (!allCourses.length) return [];
    const videoCourses = allCourses.filter(c => c.videoLink && c.videoLink.trim() !== '');
    // Ensure we have at least 3 video courses, if not use available ones
    return videoCourses.length >= 3 ? videoCourses.slice(0, 3) : videoCourses;
  }, [allCourses]);

  // Rotating featured course
  const featured = featuredCourses.length > 0 ? featuredCourses[currentIndex % featuredCourses.length] : null;

  // Auto-switch courses every 5 seconds (only if we have courses and not loading)
  useEffect(() => {
    if (featuredCourses.length === 0 || isLoading) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCourses.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredCourses.length, isLoading]);

  const nextSlide = () => {
    if (featuredCourses.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % featuredCourses.length);
  };

  const prevSlide = () => {
    if (featuredCourses.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + featuredCourses.length) % featuredCourses.length);
  };

  return (
    <section className="relative py-24 overflow-hidden bg-[#020202]">
      <div className="container relative z-10 px-6 mx-auto">
        {/* FEATURED VIDEO COURSES */}
        {featured && !isLoading && (
          <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#0a0a0a] p-4 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
            <Link 
              href={`/academy/${featured.slug}`} 
              className="relative block w-full overflow-hidden border cursor-pointer rounded-2xl border-white/5 group min-h-[340px] sm:min-h-[400px] md:min-h-[500px]"
            >
              <img
                src={featured.image || 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765185502/clclogo_p2v5bp.jpg'}
                alt={featured.title}
                className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765185502/clclogo_p2v5bp.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center md:p-12">
                <span className="bg-[#222] text-gray-200 text-[10px] font-bold px-2 py-1 rounded mb-4 uppercase tracking-wider backdrop-blur-md">
                  {isFr ? 'COURS VIDÉO' : 'VIDEO COURSE'}
                </span>
                
                <h2 className="max-w-3xl mb-4 text-2xl font-bold leading-tight text-white md:text-4xl line-clamp-3 drop-shadow-lg">
                  {featured.title}
                </h2>
                
                {featured.description && (
                  <p className="max-w-2xl mx-auto mb-6 text-sm text-gray-300 line-clamp-2 md:text-base">
                    {featured.description}
                  </p>
                )}
                
                <div className="flex items-center justify-center gap-4 mb-4 text-sm font-medium text-gray-300 sm:mb-8">
                  {featured.level && (
                    <>
                      <span className="px-2 py-1 text-xs rounded bg-white/10">{featured.level}</span>
                      {featured.duration && <span className="w-1 h-1 bg-gray-500 rounded-full"></span>}
                    </>
                  )}
                  {featured.duration && (
                    <span>{featured.duration}</span>
                  )}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    router.push(`/academy/${featured.slug}`);
                  }}
                  className="inline-block px-8 py-3 text-sm font-bold text-black transition-colors bg-white rounded-full hover:bg-gray-200"
                >
                  {isFr ? 'Voir le cours' : 'View Course'}
                </button>
              </div>
            </Link>

            {/* Navigation buttons */}
            {featuredCourses.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute hidden p-2 transition-colors -translate-y-1/2 border rounded-full left-4 top-1/2 bg-black/50 border-white/10 hover:bg-black/70 md:block"
                  aria-label={isFr ? 'Cours précédent' : 'Previous course'}
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute hidden p-2 transition-colors -translate-y-1/2 border rounded-full right-4 top-1/2 bg-black/50 border-white/10 hover:bg-black/70 md:block"
                  aria-label={isFr ? 'Cours suivant' : 'Next course'}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>
        )}
        
        {/* Fallback if no featured courses */}
        {!featured && !isLoading && (
          <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#0a0a0a] p-4 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-center w-full overflow-hidden border aspect-video rounded-2xl bg-gradient-to-br from-zinc-900 to-black border-white/5">
              <span className="font-bold tracking-widest uppercase text-zinc-800">Academy Interface Preview</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
