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
      <section className="relative w-full pt-16 pb-6 overflow-hidden bg-black">
        {/* Background Grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 w-full px-6 mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="mb-8 text-3xl font-bold leading-[1.1] tracking-tighter text-white sm:text-4xl md:text-6xl lg:text-6xl">
                <span className="text-[#a1a1aa]">{t.deals.title}</span>{' '}
                <span className="relative inline-block text-white">
                  <span className="absolute inset-x-0 top-1/2 h-[2px] w-[110%] -translate-x-[5%] bg-white -rotate-2 z-10" />
                  {t.deals.titleSuffix}
                </span>
              </h1>
              <p className="max-w-3xl mx-auto text-sm leading-relaxed text-[#71717a] md:text-sm lg:text-sm">
                {t.deals.heroDescription}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="container max-w-7xl px-6 py-12 mx-auto">
        {/* Filtres Catégories */}
        <ScrollReveal>
          <div className="flex w-full gap-2 pb-2 mb-8 overflow-x-auto md:mb-16 md:w-auto md:pb-0 scrollbar-hide">
            {canonicalCategories.map((catKey, index) => (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`whitespace-nowrap px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-xs font-bold border transition-all ${
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
        <div className="grid grid-cols-1 gap-6 mb-20 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDeals.length > 0 ? (
                filteredDeals.map((deal, idx) => (
                    <ScrollReveal key={deal.id} delay={idx * 50} className="h-full">
                        <Link href={`/deals/${deal.id}`} className="block h-full">
                          <article className="relative flex flex-col h-full overflow-hidden transition-all duration-300 border rounded-2xl bg-[#0a0a0a] border-white/10 hover:border-white/30 hover:-translate-y-1 group cursor-pointer">

                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                                <img
                                  src={deal.image || 'https://via.placeholder.com/400x250/333/666?text=No+Image'}
                                  alt={deal.title}
                                  className="object-cover w-full h-full transition-all duration-700 opacity-70 group-hover:opacity-100 group-hover:scale-105"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/400x250/333/666?text=No+Image';
                                  }}
                                />
                                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                {deal.exclusive && (
                                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 text-[9px] font-black tracking-widest text-black uppercase rounded-md shadow-lg bg-coinlect-accent">{t.deals.exclusive}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col flex-grow p-5">
                                <span className="mb-2 text-[10px] font-bold text-coinlect-accent uppercase tracking-[0.2em]">{deal.category}</span>
                                <h3 className="text-lg font-bold leading-snug tracking-tight text-white line-clamp-2">
                                    {deal.title}
                                    {deal.discount && <span className="ml-1 text-sm text-zinc-400">— {deal.discount}</span>}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-2">{deal.details || deal.description}</p>

                                <div className="mt-auto flex flex-col gap-3 pt-5 border-t border-white/5">
                                    {deal.code && (
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{t.deals.coupon}</span>
                                            <span className="px-2.5 py-1 font-mono text-xs text-white border border-dashed rounded-md bg-white/5 border-white/15">{deal.code}</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          window.open(deal.link, '_blank');
                                        }}
                                        className="w-full px-6 py-3 text-[11px] font-bold tracking-widest text-black uppercase transition-all bg-white rounded-full hover:bg-coinlect-accent"
                                    >
                                        {t.deals.claim}
                                    </button>
                                </div>
                            </div>
                          </article>
                        </Link>
                    </ScrollReveal>
                ))
            ) : (
                <div className="py-20 text-center col-span-full">
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