'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useLanguage();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 bg-black">
      <div className="container max-w-3xl px-6 mx-auto">
        <h2 className="mb-16 text-3xl font-bold text-center">
          {t.faq.title} <span className="text-coinlect-accent">{t.faq.titleSuffix}</span>
        </h2>

        <div className="space-y-4">
          {t.faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`rounded-xl transition-all duration-300 overflow-hidden border ${
                    isOpen ? 'bg-[#111] border-coinlect-accent/30' : 'bg-transparent border-white/10 hover:border-white/20'
                }`}
              >
                <button 
                  onClick={() => toggle(index)}
                  className="flex items-center justify-between w-full p-5 text-left"
                >
                  <span className={`text-sm md:text-base font-medium ${isOpen ? 'text-white' : 'text-gray-400'}`}>
                    {item.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                      isOpen 
                      ? 'border-coinlect-accent text-coinlect-accent bg-coinlect-accent/10' 
                      : 'border-white/10 text-gray-500 bg-white/5'
                  }`}>
                    {isOpen ? <X size={14} /> : <Plus size={14} />}
                  </div>
                </button>
                
                <div 
                  className={`px-5 text-gray-500 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
