'use client';

import React from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, MessageCircle, Share2, TrendingUp, Instagram } from 'lucide-react';

// Icônes sociales personnalisées et Lucide
const Icons = {
  YouTube: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
  ),
  Telegram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  CMC: () => (
    <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full">
      <span className="text-[10px] font-black text-white italic">C</span>
    </div>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.33 2.1-.1.7.1 1.41.53 1.98.5.73 1.37 1.19 2.26 1.2.81.06 1.62-.24 2.22-.81.52-.49.82-1.18.82-1.88V.02z"/>
    </svg>
  ),
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.347.223-.644.075-.297-.15-.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  ),
};

// URL, icon, and color mapping using canonical keys
const COMMUNITY_CONFIG: { [key: string]: { url: string; icon: React.ComponentType<any>; color: string } } = {
  'twitter': { url: 'https://x.com/coinlect', icon: Icons.X, color: 'text-white' },
  'linkedin': { url: 'https://www.linkedin.com/company/coinlect-academie', icon: Icons.LinkedIn, color: 'text-blue-500' },
  'telegram_official': { url: 'https://t.me/coinlect_academy', icon: Icons.Telegram, color: 'text-sky-400' },
  'whatsapp_channel': { url: 'https://whatsapp.com/channel/0029Vaex60vDuMReflHWmH0S', icon: Icons.WhatsApp, color: 'text-green-500' },
  'instagram': { url: 'https://www.instagram.com/coinlectacademy', icon: () => <Instagram className="w-6 h-6" />, color: 'text-pink-500' },
  'coinmarketcap': { url: 'https://coinmarketcap.com/community/profile/coinlect_Academy', icon: Icons.CMC, color: 'text-blue-400' },
  'telegram_community': { url: 'https://t.me/cryptacadem', icon: Icons.Telegram, color: 'text-sky-400' },
  'whatsapp_group': { url: 'https://chat.whatsapp.com/D7BRG2oBl8o6ES0FnoUJ2H', icon: Icons.WhatsApp, color: 'text-green-400' },
  'youtube': { url: 'https://www.youtube.com/@Coinlect', icon: Icons.YouTube, color: 'text-red-500' },
  'tiktok': { url: 'https://www.tiktok.com/@coinlect_academy', icon: Icons.TikTok, color: 'text-cyan-400' }
};

// Helper function to get config by name (handles both language variants)
const getCommunityConfig = (name: string) => {
  const key = name.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/twitter.*x/i, 'twitter')
    .replace(/telegram.*community/i, 'telegram_community')
    .replace(/telegram/i, 'telegram_official')
    .replace(/whatsapp.*channel/i, 'whatsapp_channel')
    .replace(/whatsapp.*group/i, 'whatsapp_group')
    .replace(/whatsapp.*groupe/i, 'whatsapp_group')
    .replace(/coinmarketcap|cmc/i, 'coinmarketcap')
    .replace(/youtube/i, 'youtube')
    .replace(/tiktok/i, 'tiktok')
    .replace(/linkedin/i, 'linkedin')
    .replace(/instagram/i, 'instagram');
  
  return COMMUNITY_CONFIG[key] || { url: '#', icon: Icons.Telegram, color: 'text-sky-400' };
};

export const Community: React.FC = () => {
  const { t } = useLanguage();
  const communities = t.community.page.categories;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      
      {/* SECTION HEADER: Style Dokploy */}
      <section className="relative w-full pt-16 pb-12 overflow-hidden bg-black">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 w-full px-6 mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="mb-8 text-4xl font-bold leading-[1.1] tracking-tighter text-white md:text-6xl lg:text-6xl">
                <span className="text-[#a1a1aa]">{t.community.page.titlePrefix}</span>{' '}
                <span className="relative inline-block text-white">
                  <span className="absolute inset-x-0 top-1/2 h-[2px] w-[110%] -translate-x-[5%] bg-white -rotate-2 z-10" />
                  {t.community.page.titleMain}
                </span>
              </h1>
              <p className="max-w-3xl mx-auto text-base leading-relaxed text-[#71717a] md:text-sm lg:text-sm font-medium">
                {t.community.page.subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="container px-6 pb-24 mx-auto max-w-7xl">
         {communities.map((section, sectionIndex) => (
           <div key={sectionIndex} className="mb-16">
             <ScrollReveal delay={sectionIndex * 100}>
               <h2 className="mb-8 text-xs font-black tracking-[0.3em] text-[#a1a1aa] uppercase border-l border-white/20 pl-4">
                 {section.name}
               </h2>
             </ScrollReveal>
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
               {section.items.map((item, itemIndex) => {
                 const config = getCommunityConfig(item.name);
                 const IconComponent = config.icon;
                 
                 return (
                   <ScrollReveal key={itemIndex} delay={(sectionIndex * 100) + (itemIndex * 50)}>
                     <div
                       className="flex items-center justify-between p-6 transition-all duration-500 border rounded-none cursor-pointer bg-[#0a0a0a] border-white/5 hover:border-white/20 group"
                       onClick={() => window.open(config.url, '_blank', 'noopener,noreferrer')}
                     >
                       <div className="flex items-center gap-5">
                         <div className={`transition-all duration-500 group-hover:scale-110 ${config.color}`}>
                           <IconComponent />
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[15px] font-bold text-white tracking-tight">{item.name}</span>
                           <span className="text-[11px] text-[#71717a] font-medium uppercase tracking-tight">{item.desc}</span>
                         </div>
                       </div>
                       <ArrowRight size={18} className="text-[#333] group-hover:text-white transition-all translate-x-0 group-hover:translate-x-1" />
                     </div>
                   </ScrollReveal>
                 );
               })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;