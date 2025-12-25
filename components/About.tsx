'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { articleService } from '../services/db';
import { Article } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);

  useEffect(() => {
    const allArticles = articleService.getAll();
    const featured = allArticles.filter(a => a.featured);
    
    // Ensure we have at least 3 featured articles, if not use regular articles
    const articlesToShow = featured.length >= 3 ? featured : allArticles.slice(0, Math.max(3, featured.length));
    setFeaturedArticles(articlesToShow);
    
    // Get latest non-featured articles for sidebar
    const latest = allArticles.filter(a => !a.featured || !articlesToShow.some(f => f.id === a.id)).slice(0, 5);
    setLatestArticles(latest);
  }, []);

  // Listen for content updates
  useEffect(() => {
    const handleContentUpdate = () => {
      const allArticles = articleService.getAll();
      const featured = allArticles.filter(a => a.featured);
      const articlesToShow = featured.length >= 3 ? featured : allArticles.slice(0, Math.max(3, featured.length));
      setFeaturedArticles(articlesToShow);
      const latest = allArticles.filter(a => !a.featured || !articlesToShow.some(f => f.id === a.id)).slice(0, 5);
      setLatestArticles(latest);
    };

    window.addEventListener('contentUpdated', handleContentUpdate);
    return () => window.removeEventListener('contentUpdated', handleContentUpdate);
  }, []);

  // Rotating featured article
  const featured = featuredArticles[currentIndex % featuredArticles.length] || featuredArticles[0];
  
  // Auto-switch articles every 5 seconds (only if we have articles)
  useEffect(() => {
    if (featuredArticles.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredArticles.length]);

  const nextSlide = () => {
    if (featuredArticles.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    if (featuredArticles.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  if (!featured || featuredArticles.length === 0) {
    return null; // Don't show section if no featured articles
  }

  return (
    <section className="py-24 bg-[#0a0a0a]">
       <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
             
             {/* Featured Main Card */}
             <div className="lg:col-span-2 relative min-h-[500px] rounded-xl overflow-hidden group cursor-pointer border border-white/5">
                <img 
                    src={featured.image} 
                    alt={featured.title} 
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-12">
                    <span className="bg-[#222] text-gray-200 text-[10px] font-bold px-2 py-1 rounded mb-4 uppercase tracking-wider backdrop-blur-md">
                        ARTICLE
                    </span>
                    
                    <h2 className="max-w-2xl mb-6 text-3xl font-bold leading-tight text-white md:text-5xl drop-shadow-lg">
                        {featured.title}
                    </h2>
                    
                    <div className="flex items-center gap-4 mb-8 text-sm font-medium text-gray-300">
                        <div className="flex items-center gap-2">
                             <img src="https://res.cloudinary.com/drsd8adkq/image/upload/v1765187097/coinlect-0_denz8g.jpg" className="w-5 h-5 rounded-full" alt="Coinlect" />
                             <span>Coinlect</span>
                        </div>
                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                        <span>{featured.date}</span>
                    </div>
                    
                    <Link href={`/academy/article/${featured.id}`}>
                        <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                            Read Article
                        </button>
                    </Link>

                    {/* Navigation Buttons */}
                    <div className="absolute z-20 flex gap-3 bottom-12 right-12">
                        <button 
                            onClick={(e) => { e.preventDefault(); prevSlide(); }}
                            className="flex items-center justify-center w-10 h-10 text-white transition-colors border rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/10"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            onClick={(e) => { e.preventDefault(); nextSlide(); }}
                            className="flex items-center justify-center w-10 h-10 text-white transition-colors border rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/10"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
             </div>

             {/* Sidebar List */}
             <div className="bg-[#111] rounded-xl p-8 border border-white/5 flex flex-col h-full">
                <h3 className="mb-8 text-xs font-bold tracking-widest text-white uppercase">LATEST</h3>
                
                <div className="flex flex-col justify-between flex-1 gap-6">
                    {latestArticles.map((article) => (
                        <Link href={`/academy/article/${article.id}`} key={article.id} className="block group">
                            <h4 className="mb-2 text-base font-bold leading-snug text-white transition-colors group-hover:text-coinlect-accent line-clamp-2">
                                {article.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                <span className="text-gray-400">{article.category || 'Trending'}</span>
                                <span className="w-0.5 h-0.5 bg-gray-600 rounded-full"></span>
                                <span>{article.date}</span>
                                <span className="w-0.5 h-0.5 bg-gray-600 rounded-full"></span>
                                <span>{article.readTime} read</span>
                            </div>
                        </Link>
                    ))}
                </div>
             </div>

          </div>
       </div>
    </section>
  );
};
