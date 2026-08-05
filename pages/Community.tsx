'use client';

import React from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, MessageCircle, Share2, TrendingUp, Instagram } from 'lucide-react';

// Icons matching Footer component
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
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
  ),
  Telegram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
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
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.436 2.503 1.163 3.473L6.539 18.3l3.018-.79c.801.433 1.709.68 2.473.681h.001c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.753-5.768-5.753zm3.435 8.165c-.141.396-.708.721-1.018.769-.301.048-.679.083-1.077-.101-.248-.115-1.053-.435-2.004-1.284-.738-.659-1.238-1.472-1.382-1.72-.144-.249-.015-.384.11-.508.112-.112.249-.292.373-.439.124-.146.166-.249.249-.415.083-.166.042-.311-.021-.436-.062-.125-.56-1.348-.767-1.846-.202-.485-.407-.419-.56-.426l-.478-.008c-.166 0-.436.062-.664.311-.229.249-.873.852-.873 2.077s.893 2.408 1.018 2.574c.125.166 1.756 2.682 4.254 3.759.595.256 1.058.41 1.419.524.598.19 1.141.163 1.571.099.479-.071 1.474-.602 1.681-1.183.208-.581.208-1.079.146-1.183-.063-.104-.229-.166-.478-.291zM12.036 0C5.402 0 .021 5.381.018 12.016c0 2.12.553 4.189 1.604 6.012L0 24l6.136-1.61a11.91 11.91 0 0 0 5.897 1.569h.005c6.632 0 12.014-5.381 12.017-12.016A11.94 11.94 0 0 0 12.036 0z"/>
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
  const lowerName = name.toLowerCase();
  
  // Check for specific patterns first (before removing special characters)
  if (/twitter.*x|^x\s*\(|\(.*x.*\)/i.test(name)) {
    return COMMUNITY_CONFIG['twitter'];
  }
  if (/telegram.*community|community.*telegram/i.test(name)) {
    return COMMUNITY_CONFIG['telegram_community'];
  }
  if (/telegram/i.test(name)) {
    return COMMUNITY_CONFIG['telegram_official'];
  }
  if (/whatsapp.*channel|channel.*whatsapp/i.test(name)) {
    return COMMUNITY_CONFIG['whatsapp_channel'];
  }
  if (/whatsapp.*group|whatsapp.*groupe|group.*whatsapp|groupe.*whatsapp/i.test(name)) {
    return COMMUNITY_CONFIG['whatsapp_group'];
  }
  if (/coinmarketcap|cmc/i.test(name)) {
    return COMMUNITY_CONFIG['coinmarketcap'];
  }
  if (/youtube/i.test(name)) {
    return COMMUNITY_CONFIG['youtube'];
  }
  if (/tiktok/i.test(name)) {
    return COMMUNITY_CONFIG['tiktok'];
  }
  if (/linkedin/i.test(name)) {
    return COMMUNITY_CONFIG['linkedin'];
  }
  if (/instagram/i.test(name)) {
    return COMMUNITY_CONFIG['instagram'];
  }
  
  // Fallback
  return COMMUNITY_CONFIG['twitter'] || { url: '#', icon: Icons.X, color: 'text-white' };
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
              <p className="max-w-3xl mx-auto mt-6 text-base font-medium leading-relaxed text-gray-300 md:text-sm lg:text-sm">
                {t.community.page.seoDescription}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="container px-6 pb-24 mx-auto max-w-7xl">
        {/* Intro paragraph removed per request */}
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