'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Features: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container flex flex-col gap-24 px-6 py-24 mx-auto bg-black">
        
        {/* Feature 1: Phone UI */}
        <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Text Section - Order 1 on mobile (default) */}
            <div className="p-4 md:p-12">
                <h2 className="mb-6 text-3xl font-bold text-white">
                    {t.features.buyTitle} <span className="text-coinlect-accent">{t.features.buyTitleSuffix}</span>
                </h2>
                <div className="mb-8 space-y-6 text-sm leading-relaxed text-gray-500">
                    <p>{t.features.buyDesc1}</p>
                    <p>{t.features.buyDesc2}</p>
                </div>
                <Link href="/register">
                    <div className="inline-flex items-center justify-between w-full md:w-auto min-w-[200px] border border-white/20 rounded-lg px-6 py-4 hover:bg-white/5 transition-colors group cursor-pointer">
                        <span className="font-bold text-white">{t.features.buyCta}</span>
                        <ArrowUpRight className="text-white transition-colors group-hover:text-coinlect-accent" size={20} />
                    </div>
                </Link>
            </div>
            
            {/* Image Section - Order 2 on mobile (default) */}
            <div className="relative h-[400px] w-full bg-[#0F0F0F] rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
                {/* Simulated Phone UI */}
                <div className="w-[200px] h-[350px] border-4 border-gray-800 rounded-[2rem] bg-black relative shadow-2xl rotate-[-12deg] transform translate-y-4 hover:translate-y-0 transition-transform duration-500">
                    <div className="absolute z-20 w-20 h-4 -translate-x-1/2 bg-gray-800 top-2 left-1/2 rounded-b-xl"></div>
                    <img src="https://picsum.photos/400/700?random=1" className="w-full h-full object-cover rounded-[1.7rem] opacity-60" alt="App Interface" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <div className="mb-2 text-2xl font-bold text-white">55,231.98</div>
                        <div className="text-xs text-green-500">+0.24%</div>
                        {/* Fake Chart */}
                        <div className="flex items-end justify-between w-full h-20 gap-1 mt-8">
                             {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                 <div key={i} style={{height: `${h}%`}} className="w-2 rounded-t-sm bg-gradient-to-t from-coinlect-accent to-transparent"></div>
                             ))}
                        </div>
                    </div>
                </div>
                {/* Matrix Background Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px] -z-10"></div>
            </div>
        </div>

        {/* Feature 2: 3D Gold Assets */}
        <div className="grid items-center gap-12 md:grid-cols-2">
             {/* Text Section - Order 1 on mobile */}
             <div className="p-4 md:order-2 md:p-12">
                <h2 className="mb-6 text-3xl font-bold text-white">
                    {t.features.communityTitle} <span className="text-coinlect-accent">{t.features.communityTitleSuffix}</span>
                </h2>
                <div className="mb-8 space-y-6 text-sm leading-relaxed text-gray-500">
                    <p>{t.features.communityDesc1}</p>
                    <p>{t.features.communityDesc2}</p>
                </div>
                <Link href="/community">
                    <div className="inline-flex items-center justify-between w-full md:w-auto min-w-[200px] border border-white/20 rounded-lg px-6 py-4 hover:bg-white/5 transition-colors group cursor-pointer">
                        <span className="font-bold text-white">{t.features.communityCta}</span>
                        <ArrowUpRight className="text-white transition-colors group-hover:text-coinlect-accent" size={20} />
                    </div>
                </Link>
            </div>

            {/* Image Section - Order 2 on mobile */}
             <div className="md:order-1 relative h-[400px] w-full rounded-2xl overflow-hidden bg-[#0F0F0F] border border-white/5 flex items-center justify-center">
                <img 
                    src="https://res.cloudinary.com/drsd8adkq/image/upload/v1765187097/coinlect-0_denz8g.jpg" 
                    alt="Gold Coins and Chess" 
                    className="object-cover w-full h-full transition-all duration-700 opacity-80 mix-blend-luminosity hover:mix-blend-normal" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
        </div>

    </div>
  );
};
