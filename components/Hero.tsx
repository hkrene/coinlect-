'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../hooks/useCourses';
import { Play, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
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
    <section className="relative min-h-screen flex flex-col items-center pt-32 lg:pt-48 overflow-hidden bg-[#020202]">
      
      {/* ATMOSPHERIC BACKGROUND (The "Horizon" Effect) */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[160%] lg:w-[120%] aspect-[2/1] bg-amber-600/20 rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none" />

      <div className="container relative z-10 px-6 mx-auto text-center">
        
        {/* NEW VERSION PILL */}
        <Link href="/academy" className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl group cursor-pointer hover:border-amber-500/50 transition-all">
          <span className="text-[10px] md:text-xs font-medium text-zinc-400">
            {isFr ? "Un nouvaux cours est disponible ! voir mennant" : "New course is out! view now"}
          </span>
          <div className="p-1 rounded-full bg-amber-500">
             <ArrowRight className="w-3 h-3 text-black group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
        {/* MAIN HEADLINE */}
        <h1 className="mx-auto mb-8 text-2xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          {t.hero.titlePrefix}
          <span className="ml-3 italic text-amber-500">Web3.0</span>
        </h1>
        
        {/* SUBTITLE */}
        <p className="max-w-4xl mx-auto mb-12 text-sm font-light leading-relaxed text-zinc-400 md:text-lg">
           {isFr ? t.hero.subtitle : t.hero.subtitle}
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 mb-24 sm:flex-row">
          <Link href="https://t.me/coinlect_academy">
            <button className="flex items-center gap-3 px-8 py-4 font-semibold text-white transition-all border rounded-full bg-white/5 border-white/10 hover:bg-white/10">
              <div className="p-1 text-black bg-white rounded-full">
                <Play className="w-3 h-3 fill-current" />
              </div>
              {t.hero.ctaDonation}
            </button>
          </Link>
          
          <Link href={isAuthenticated ? "/academy" : "/register"}>
            <button className="px-10 py-4 rounded-full bg-amber-500 text-black font-black hover:bg-white transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)]">
              {t.hero.ctaStart}
            </button>
          </Link>
        </div>

        {/* FEATURED VIDEO COURSES */}
        {featured && !isLoading && (
          <div className="relative w-full max-w-6xl mx-auto rounded-t-3xl border-x border-t border-white/10 bg-[#0a0a0a] p-4 lg:p-8 shadow-[0_-20px_80px_rgba(0,0,0,0.8)]">
            <Link 
              href={`/academy/${featured.slug}`} 
              className="relative block w-full overflow-hidden border cursor-pointer md:min-h-[500px] rounded-2xl border-white/5 group min-h-[250px]"
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
                
                <h2 className="max-w-3xl mb-4 text-2xl font-bold leading-tight text-white md:text-4xl drop-shadow-lg">
                  {featured.title}
                </h2>
                
                {featured.description && (
                  <p className="max-w-2xl mx-auto mb-6 text-sm text-gray-300 line-clamp-2 md:text-base">
                    {featured.description}
                  </p>
                )}
                
                <div className="flex items-center justify-center gap-4 mb-8 text-sm font-medium text-gray-300">
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
                
                <Link 
                  href={`/academy/${featured.slug}`}
                  className="inline-block px-8 py-3 text-sm font-bold text-black transition-colors bg-white rounded-full hover:bg-gray-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isFr ? 'Voir le cours' : 'View Course'}
                </Link>
              </div>
            </Link>
            {/* Fade out bottom to blend with next section */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020202] to-transparent pointer-events-none" />
          </div>
        )}
        
        {/* Fallback if no featured courses */}
        {!featured && !isLoading && (
          <div className="relative w-full max-w-6xl mx-auto rounded-t-3xl border-x border-t border-white/10 bg-[#0a0a0a] p-4 lg:p-8 shadow-[0_-20px_80px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-center w-full overflow-hidden border aspect-video rounded-2xl bg-gradient-to-br from-zinc-900 to-black border-white/5">
              <span className="font-bold tracking-widest uppercase text-zinc-800">Academy Interface Preview</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020202] to-transparent" />
          </div>
        )}

      </div>
    </section>
  );
};