'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useArticles } from '../hooks/useArticles';
import { Article } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const About: React.FC = () => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const isFr = language === 'fr';
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use React Query hook for articles
  const { data: allArticles = [], isLoading } = useArticles({ featured: true });

  // Process articles when data changes
  const featuredArticles = React.useMemo(() => {
    if (!allArticles.length) return [];
    const featured = allArticles.filter(a => a.featured);
    // Ensure we have at least 3 featured articles, if not use regular articles
    return featured.length >= 3 ? featured : allArticles.slice(0, Math.max(3, featured.length));
  }, [allArticles]);

  const latestArticles = React.useMemo(() => {
    if (!allArticles.length) return [];
    // Get latest non-featured articles for sidebar
    return allArticles.filter(a => !a.featured || !featuredArticles.some(f => f.id === a.id)).slice(0, 5);
  }, [allArticles, featuredArticles]);

    // React Query handles content updates automatically

  // Rotating featured article
  const featured = featuredArticles.length > 0 ? featuredArticles[currentIndex % featuredArticles.length] : null;

  // Auto-switch articles every 5 seconds (only if we have articles and not loading)
  useEffect(() => {
    if (featuredArticles.length === 0 || isLoading) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredArticles.length, isLoading]);

  const nextSlide = () => {
    if (featuredArticles.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    if (featuredArticles.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  return (
    <section className="relative py-24 overflow-hidden bg-[#020202]">
      <div className="container relative z-10 px-6 mx-auto">
        {/* FEATURED ARTICLES */}
        {featured && !isLoading && (
          <div className="relative w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#0a0a0a] p-4 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
            <Link 
              href={`/academy/article/${featured.slug}`} 
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
                  {isFr ? 'ARTICLE' : 'ARTICLE'}
                </span>
                
                <h2 className="max-w-3xl mb-4 text-2xl font-bold leading-tight text-white md:text-4xl line-clamp-3 drop-shadow-lg">
                  {featured.title}
                </h2>
                
                {(featured.excerpt || featured.seoDescription) && (
                  <p className="max-w-2xl mx-auto mb-6 text-sm text-gray-300 line-clamp-2 md:text-base">
                    {featured.excerpt || featured.seoDescription}
                  </p>
                )}
                
                <div className="flex items-center justify-center gap-4 mb-4 text-sm font-medium text-gray-300 sm:mb-8">
                  {featured.authorImage && (
                    <div className="flex items-center gap-2">
                      <img
                        src={featured.authorImage}
                        className="w-5 h-5 rounded-full"
                        alt={featured.author?.name || 'Coinlect'}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765185502/clclogo_p2v5bp.jpg';
                        }}
                      />
                      <span>{featured.author?.name || 'Coinlect'}</span>
                    </div>
                  )}
                  {featured.date && (
                    <>
                      {featured.authorImage && <span className="w-1 h-1 bg-gray-500 rounded-full"></span>}
                      <span>{featured.date}</span>
                    </>
                  )}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    router.push(`/academy/article/${featured.slug}`);
                  }}
                  className="inline-block px-8 py-3 text-sm font-bold text-black transition-colors bg-white rounded-full hover:bg-gray-200"
                >
                  {isFr ? 'Lire l\'article' : 'Read Article'}
                </button>
              </div>
            </Link>

            {/* Navigation buttons */}
            {featuredArticles.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute hidden p-2 transition-colors -translate-y-1/2 border rounded-full left-4 top-1/2 bg-black/50 border-white/10 hover:bg-black/70 md:block"
                  aria-label={isFr ? 'Article précédent' : 'Previous article'}
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute hidden p-2 transition-colors -translate-y-1/2 border rounded-full right-4 top-1/2 bg-black/50 border-white/10 hover:bg-black/70 md:block"
                  aria-label={isFr ? 'Article suivant' : 'Next article'}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>
        )}
        
        {/* Fallback if no featured articles */}
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