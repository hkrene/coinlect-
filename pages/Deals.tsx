'use client';

import React, { useState, useEffect } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { Button } from '../components/Button';
import { dealService } from '../services/db';
import { Deal } from '../mockData';
import { Search, Tag, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AdBanner } from '../components/AdBanner';

export const Deals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // We use the English keys as the source of truth for logic, regardless of display language
  const [activeCategory, setActiveCategory] = useState('All');
  const { t } = useLanguage();

  useEffect(() => {
    setDeals(dealService.getAll());
  }, []);

  // Display labels from translation
  const displayCategories = t.deals.filters;
  // Canonical keys matching mockData.ts
  const canonicalCategories = ["All", "Exchange", "Wallet", "Tax", "Trading Tool", "Security"];

  // Filter Logic
  const filteredDeals = deals.filter(deal => {
    // Check search
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          deal.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check Category using canonical keys
    const isAll = activeCategory === 'All';
    const matchesCategory = isAll || deal.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 min-h-screen bg-[#0a0a0a]">
      
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-coinlect-accent/10 to-transparent pointer-events-none"></div>

        <div className="container relative z-10 px-6 mx-auto text-center">
           <ScrollReveal>
             <h1 className="mb-6 text-4xl font-extrabold md:text-6xl">
               {t.deals.title} <span className="text-coinlect-accent">{t.deals.titleSuffix}</span>
             </h1>
             <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-gray-400">
               {t.deals.subtitle}
             </p>

             {/* Search Bar */}
             <div className="relative max-w-lg mx-auto group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-coinlect-accent to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex items-center p-2 bg-black border rounded-lg border-white/10">
                    <Search className="ml-3 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder={t.deals.searchPlaceholder}
                        className="w-full py-2 pl-3 pr-4 text-white placeholder-gray-600 bg-transparent focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
             </div>
           </ScrollReveal>
        </div>
      </div>

      <div className="container px-6 py-12 mx-auto">
        {/* Category Filters */}
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {canonicalCategories.map((catKey, index) => (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeCategory === catKey 
                    ? 'bg-coinlect-accent text-black border-coinlect-accent' 
                    : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {/* Display the translated label using the index */}
                {displayCategories[index] || catKey}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Deals Grid */}
        <div className="grid gap-8 mb-20 md:grid-cols-2 lg:grid-cols-3">
            {filteredDeals.map((deal, idx) => (
                <ScrollReveal key={deal.id} delay={idx * 50}>
                    <div className="relative flex flex-col h-full p-6 overflow-hidden transition-all duration-300 border group glass-card rounded-2xl border-white/10 hover:border-coinlect-accent/30 hover:-translate-y-1">
                        
                        {/* Exclusive Badge */}
                        {deal.exclusive && (
                            <div className="absolute top-0 right-0 bg-coinlect-accent text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20 flex items-center gap-1 shadow-lg">
                                <ShieldCheck size={12} /> {t.deals.exclusive}
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-6">
                            {/* Logo Display - Direct, no card container */}
                            <div className="flex items-center w-auto h-12">
                                <img src={deal.logo} alt={deal.name} className="object-contain w-auto h-full" />
                            </div>
                            <span className="bg-white/5 border border-white/10 text-gray-400 text-[10px] px-2 py-1 rounded uppercase tracking-wider font-bold">
                                {deal.category}
                            </span>
                        </div>

                        <h3 className="mb-2 text-xl font-bold text-white">{deal.name}</h3>
                        <div className="flex items-center gap-2 mb-4 text-sm font-bold text-green-400">
                            <Tag size={16} /> {deal.discount}
                        </div>
                        
                        <p className="flex-grow mb-6 text-sm leading-relaxed text-gray-400">
                            {deal.description}
                        </p>

                        {/* Coupon Code Section */}
                        {deal.code && (
                            <div className="flex items-center justify-between p-3 mb-6 transition-colors border border-dashed rounded-lg bg-white/5 border-white/20 group-hover:bg-white/10">
                                <span className="text-xs text-gray-500">{t.deals.coupon}</span>
                                <span className="font-mono font-bold tracking-widest cursor-pointer select-all text-coinlect-accent">{deal.code}</span>
                            </div>
                        )}

                        <a href={deal.link} target="_blank" rel="noopener noreferrer" className="mt-auto">
                            <Button className="justify-center w-full group-hover:bg-coinlect-accent group-hover:text-black">
                                {t.deals.claim} <ExternalLink size={16} />
                            </Button>
                        </a>
                    </div>
                </ScrollReveal>
            ))}
        </div>
        
        {filteredDeals.length === 0 && (
            <div className="py-20 text-center">
                <p className="text-lg text-gray-500">No deals found matching your criteria.</p>
                <button onClick={() => {setSearchQuery(''); setActiveCategory('All')}} className="mt-2 text-coinlect-accent hover:underline">Clear filters</button>
            </div>
        )}

        <ScrollReveal>
            <AdBanner variant="wide" />
        </ScrollReveal>

      </div>
    </div>
  );
};

export default Deals;
