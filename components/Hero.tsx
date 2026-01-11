'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <section id="home" className="relative flex items-center justify-center min-h-screen pt-32 pb-20 overflow-hidden transition-colors duration-500 bg-black">
      {/* Background Grid */}
      <div className="absolute inset-0 text-[#222] bg-grid-pattern bg-[length:40px_40px] opacity-40"></div>
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_80%)]"></div>

      {/* Decorative Lines */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute left-1/4 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
      <div className="absolute right-1/4 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

      <div className="container relative z-10 px-6 mx-auto text-center">
        <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-7xl">
          <span className="text-white">{t.hero.titlePrefix}</span>
          <span className="inline-block transition-transform duration-300 transform cursor-default text-coinlect-accent hover:scale-105">Web3</span>
        </h1>
        
        <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-gray-400">
          {t.hero.subtitle}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="https://t.me/coinlect_academy">
            <Button variant="primary" className="min-w-[140px] font-bold">
              {t.hero.ctaDonation}
            </Button>
          </Link>
          <Link href={isAuthenticated ? "/academy" : "/register"}>
            <Button variant="secondary" className="min-w-[140px] bg-white/10 border border-white/10 text-gray-300 hover:bg-white/20">
              {t.hero.ctaStart}
            </Button>
          </Link>
        </div>

        {/* Decorative Technical Elements */}
        <div className="absolute right-[10%] bottom-[20%] w-24 h-24 border border-white/10 rounded-full flex items-center justify-center animate-spin-slow opacity-50 pointer-events-none">
           <div className="w-20 h-20 border border-dashed rounded-full border-white/10"></div>
        </div>
      </div>
    </section>
  );
};
