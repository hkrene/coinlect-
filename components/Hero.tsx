'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative flex items-center justify-center min-h-screen pt-32 pb-20 overflow-hidden transition-colors duration-500 bg-white dark:bg-black">
      {/* Background Grid - Dark lines in dark mode, light grey in light mode */}
      <div className="absolute inset-0 text-slate-200 dark:text-[#222] bg-grid-pattern bg-[length:40px_40px] opacity-20 dark:opacity-40"></div>
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,1)_85%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_80%)]"></div>

      {/* Decorative Lines */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/20 to-transparent"></div>
      <div className="absolute left-1/4 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
      <div className="absolute right-1/4 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>

      <div className="container relative z-10 px-6 mx-auto text-center">
        <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-7xl">
          <span className="text-slate-900 dark:text-white">{t.hero.titlePrefix}</span>
          <span className="inline-block transition-transform duration-300 transform cursor-default text-coinlect-accent hover:scale-105">Bitcoin</span>
        </h1>
        
        <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-slate-500 dark:text-gray-400">
          {t.hero.subtitle}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/donate">
            <Button variant="primary" className="min-w-[140px] font-bold">
              {t.hero.ctaDonation}
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" className="min-w-[140px] bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/20">
              {t.hero.ctaStart}
            </Button>
          </Link>
        </div>

        {/* Decorative Technical Elements */}
        <div className="absolute right-[10%] bottom-[20%] w-24 h-24 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center animate-spin-slow opacity-30 dark:opacity-50 pointer-events-none">
           <div className="w-20 h-20 border border-dashed rounded-full border-slate-200 dark:border-white/10"></div>
        </div>
      </div>
    </section>
  );
};
