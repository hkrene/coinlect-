'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
export const generateStaticParams = () => [];
import Link from 'next/link';
import { ScrollReveal } from '../components/ScrollReveal';
import { Button } from '../components/Button';
import { dealService } from '../services/db';
import { Deal } from '../types';
import { Tag, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AdBanner } from '../components/AdBanner';

export const Deals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const fetchedDeals = await dealService.getAll();
        setDeals(fetchedDeals);
      } catch (error) {
        console.error('Error fetching deals:', error);
      }
    };

    fetchDeals();
  }, []);

  const displayCategories = t.deals.filters;
  const canonicalCategories = ["All", "Exchange", "Wallet", "Tax", "Trading Tool", "Security"];

  const filteredDeals = deals.filter(deal => {
    const isAll = activeCategory === 'All';
    return isAll || deal.category === activeCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      
      {/* SECTION HEADER: Style Dokploy avec marge ajustée */}
      <section className="relative w-full pt-48 pb-24 overflow-hidden bg-black">
        {/* Background Grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 w-full px-6 mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="mb-8 text-5xl font-bold leading-[1.1] tracking-tighter text-white md:text-7xl lg:text-8xl">
                <span className="text-[#a1a1aa]">{t.deals.title}</span>{' '}
                <span className="relative inline-block text-white">
                  <span className="absolute inset-x-0 top-1/2 h-[2px] w-[110%] -translate-x-[5%] bg-white -rotate-2 z-10" />
                  {t.deals.titleSuffix}
                </span>
              </h1>
              <p className="max-w-3xl mx-auto text-base leading-relaxed text-[#71717a] md:text-xl lg:text-2xl">
                {t.deals.subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="container px-6 py-12 mx-auto">
        {/* Filtres Catégories */}
        <ScrollReveal>
          <div className="flex w-full gap-2 pb-2 mb-16 overflow-x-auto md:w-auto md:pb-0 scrollbar-hide">
            {canonicalCategories.map((catKey, index) => (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`whitespace-nowrap px-6 py-2 rounded-none text-xs font-bold border transition-all ${
                  activeCategory === catKey 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {/* Traduction via le contexte de langue */}
                {displayCategories[index] || catKey}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Liste des Offres */}
        <div className="flex flex-col gap-8 mb-20">
            {filteredDeals.length > 0 ? (
                filteredDeals.map((deal, idx) => (
                    <ScrollReveal key={deal.id} delay={idx * 50}>
                        <Link href={`/deals/${deal.id}`} className="block h-full">
                          <div className="relative flex flex-col md:flex-row h-full overflow-hidden transition-all duration-300 border rounded-none bg-[#0a0a0a] border-white/10 hover:border-white/30 group cursor-pointer">
                            
                            <div className="relative w-full md:w-[380px] h-56 md:h-auto overflow-hidden bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                                <img
                                  src={deal.image}
                                  alt={deal.title}
                                  className="object-cover w-full h-full transition-all duration-700 opacity-60 group-hover:opacity-100 group-hover:scale-105"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/400x300/333/666?text=No+Image';
                                  }}
                                />
                                {deal.exclusive && (
                                    <div className="absolute top-0 left-0 bg-white text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 z-20 flex items-center gap-1 shadow-2xl">{t.deals.exclusive}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col flex-grow p-8">
                                <div className="flex flex-col mb-4">
                                    <span className="text-[10px] font-bold text-coinlect-accent uppercase tracking-[0.2em] mb-3">{deal.category}</span>
                                    <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{deal.title} {deal.discount && ` — ${deal.discount}`}</h3>
                                </div>
                                <p className="mb-6 text-sm leading-relaxed text-[#71717a] max-w-2xl font-medium">{deal.details || deal.description}</p>
                                
                                <div className="flex items-center gap-6 mt-auto wrap">
                                    <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          window.open(deal.link, '_blank');
                                        }}
                                        className="px-10 py-4 text-xs font-bold tracking-widest text-black uppercase transition-all bg-white rounded-none hover:bg-coinlect-accent"
                                    >
                                        {t.deals.claim}
                                    </button>
                                    {deal.code && (
                                        <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-gray-500 uppercase">
                                            <span>{t.deals.coupon} :</span>
                                            <span className="px-4 py-2 text-white border border-dashed bg-white/5 border-white/10">{deal.code}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                          </div>
                        </Link>
                    </ScrollReveal>
                ))
            ) : (
                <div className="py-20 text-center">
                    <p className="text-gray-500">{t.deals.noDealsFound}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Deals;