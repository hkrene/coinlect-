'use client';

import React from 'react';
import { Partner } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

const partners: Partner[] = [
  { name: 'Binance', description: 'Binance est une plateforme crypto mondiale offrant des outils fiables pour trader et gérer des actifs numériques.', logo: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765268653/binance_wice95.png' },
  { name: 'OKX', description: 'OKX est une plateforme crypto mondiale offrant des outils fiables pour trader et gérer des actifs numériques pro.', logo: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/okx_tofb2z.png' },
  { name: 'Bybit', description: 'Bybit est une plateforme crypto mondiale offrant des outils fiables pour trader et gérer des actifs numériques.', logo: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/byit_lc7stv.png' },
  { name: 'Kucoin', description: 'Kucoin est une plateforme crypto mondiale offrant fiables pour trader et gérer des actifs numériques.', logo: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/kucoin_sbnxez.png' },
  { name: 'Mexc', description: 'MEXC est une plateforme crypto mondiale offrant des outils fiables pour trader et gérer des actifs numériques ++.', logo: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/mexc_w3lupl.png' },
  { name: 'Maxuschain', description: 'Maxuschain est une plateforme crypto congolaise facilitant l\'accès aux actifs numériques.', logo: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765268653/maxus_zx68dt.png' },
  { name: 'Weex', description: 'Weex est une plateforme crypto mondiale offrant des outils fiables pour trader et gérer des actifs numériques', logo: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/weex_weulov.png' },
  { name: 'Mbiyopay', description: 'MbiyoPay est une plateforme fintech africaine simplifiant palements numériques, les transferts d\'argent et les solutions de palement mobile et crypto.', logo: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/mbiyopay_gll2cd.png' },
];

interface PartnerCardProps {
  partner: Partner;
  index: number;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, index }) => (
  <div className="w-[120px] md:w-[280px] flex-shrink-0 group p-4 md:p-6 rounded-xl transition-all duration-300 border border-white/20 hover:border-coinlect-accent relative overflow-hidden flex flex-col cursor-pointer bg-black">
      <div className="flex items-center justify-center h-12 mb-0 md:justify-start md:h-8 md:mb-3">
          <img src={partner.logo} alt={partner.name} className="object-contain max-h-full transition-transform duration-300 filter group-hover:scale-110" />
      </div>
      <h3 className="hidden mb-2 text-sm font-semibold text-left text-white md:block md:text-base">{partner.name}</h3>
      <p className="hidden md:block text-[10px] md:text-xs text-gray-400 leading-relaxed text-left">{partner.description}</p>
  </div>
);

export const Partners: React.FC = () => {
  const { t } = useLanguage();
  
  // Split partners into two rows
  const midPoint = Math.ceil(partners.length / 2);
  const row1 = partners.slice(0, midPoint);
  const row2 = partners.slice(midPoint);

  const row1Display = [...row1, ...row1, ...row1, ...row1];
  const row2Display = [...row2, ...row2, ...row2, ...row2];

  return (
    <section className="relative py-24 overflow-hidden bg-black">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px]"></div>

       <div className="container relative z-10 px-6 mx-auto">
        <ScrollReveal>
            <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
                {t.partners.title} <span className="text-coinlect-accent">{t.partners.titleSuffix}</span>
            </h2>
            <p className="max-w-xl mx-auto text-sm text-gray-500">
                {t.partners.desc}
            </p>
            </div>
        </ScrollReveal>

        {/* Connection Line Graphic */}
        <ScrollReveal delay={200}>
            <div className="relative flex flex-col items-center justify-center mb-12">
                {/* Center "Powered by" box */}
                <div className="relative z-20 border border-coinlect-accent/50 rounded-lg px-6 py-2 bg-[#111] shadow-lg">
                    <span className="text-xs font-semibold tracking-widest text-gray-300 uppercase">Powered by</span>
                </div>
                
                {/* The Bracket Line Structure - Updated to point to partner cards */}
                <div className="absolute top-[50%] left-0 right-0 h-[60px] pointer-events-none">
                    {/* Vertical connecting line from box */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[30px] w-[1px] bg-white/20"></div>

                    {/* Horizontal fork line extending to both sides */}
                    <div className="absolute top-[30px] left-[5%] right-[5%] h-[1px] bg-white/20"></div>

                    {/* Left vertical drop line pointing to first row */}
                    <div className="absolute top-[30px] left-[5%] h-[30px] w-[1px] bg-gradient-to-b from-white/20 to-transparent">
                        <div className="absolute bottom-0 w-2 h-2 -translate-x-1/2 bg-transparent border rounded-full left-1/2 border-white/30"></div>
                    </div>
                    
                    {/* Right vertical drop line pointing to second row - highlighted */}
                    <div className="absolute top-[30px] right-[5%] h-[30px] w-[1px] bg-gradient-to-b from-coinlect-accent/50 to-transparent">
                        <div className="absolute bottom-0 w-2 h-2 -translate-x-1/2 bg-transparent border rounded-full left-1/2 border-coinlect-accent/50"></div>
                    </div>
                </div>
            </div>
        </ScrollReveal>

        <div className="flex flex-col gap-6">
            {/* Top Row: Right to Left */}
            <div className="relative w-full overflow-hidden mask-image-gradient-sides">
                <div className="flex gap-4 py-2 animate-scroll-left hover:pause-animation w-max">
                    {row1Display.map((partner, idx) => (
                        <PartnerCard key={`row1-${partner.name}-${idx}`} partner={partner} index={idx} />
                    ))}
                </div>
            </div>

            {/* Bottom Row: Left to Right */}
            <div className="relative w-full overflow-hidden mask-image-gradient-sides">
                <div className="flex gap-4 py-2 animate-scroll-right hover:pause-animation w-max">
                    {row2Display.map((partner, idx) => (
                        <PartnerCard key={`row2-${partner.name}-${idx}`} partner={partner} index={idx} />
                    ))}
                </div>
            </div>
        </div>
       </div>

       <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); } /* Move 1/4 since we duplicated 4 times */
        }
        @keyframes scrollRight {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scrollLeft 40s linear infinite;
        }
        .animate-scroll-right {
          animation: scrollRight 40s linear infinite;
        }
        .hover\\:pause-animation:hover {
            animation-play-state: paused;
        }
        .mask-image-gradient-sides {
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>
    </section>
  );
};
