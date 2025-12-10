'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AdBannerProps {
  className?: string;
  variant?: 'wide' | 'compact';
}

const ADS = [
  {
    title: "Sécurisez vos cryptos avec Ledger",
    desc: "La référence en matière de sécurité pour vos actifs numériques. Achetez votre Nano X aujourd'hui.",
    cta: "Acheter Maintenant",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2555&auto=format&fit=crop", // Abstract tech/security
    link: "#",
    color: "from-orange-900/40 to-black"
  },
  {
    title: "Bonus de Bienvenue Binance",
    desc: "Inscrivez-vous et recevez jusqu'à 100 USDT de bonus de trading. La plus grande plateforme mondiale.",
    cta: "Réclamer le Bonus",
    image: "https://images.unsplash.com/photo-1622630998477-20aa696c6c5c?q=80&w=2664&auto=format&fit=crop", // Abstract trading
    link: "#",
    color: "from-yellow-900/40 to-black"
  },
  {
    title: "Gérez vos impôts avec Koinly",
    desc: "Calculez vos gains et générez votre rapport fiscal en moins de 20 minutes. Compatible avec +300 exchanges.",
    cta: "Essai Gratuit",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2626&auto=format&fit=crop", // Calculator/Finance
    link: "#",
    color: "from-blue-900/40 to-black"
  }
];

export const AdBanner: React.FC<AdBannerProps> = ({ className = "", variant = 'wide' }) => {
  // Simple random selection. In a real app, this might come from an ad server.
  const [ad, setAd] = React.useState(ADS[0]);

  React.useEffect(() => {
    setAd(ADS[Math.floor(Math.random() * ADS.length)]);
  }, []);

  if (variant === 'compact') {
    return (
       <div className={`w-full max-w-md mx-auto my-6 ${className}`}>
        <div className="bg-[#111] border border-white/5 rounded-lg p-3 flex items-center justify-between gap-3 relative overflow-hidden group hover:bg-[#161616] transition-colors">
            <div className="absolute top-0 right-0 bg-white/10 text-[8px] text-gray-400 px-1.5 py-0.5 rounded-bl">AD</div>
            <div className="flex items-center gap-3 overflow-hidden">
                 <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded bg-white/5">
                    <img src={ad.image} alt="Ad" className="object-cover w-full h-full" />
                 </div>
                 <div className="min-w-0">
                     <h4 className="pr-4 text-xs font-bold text-gray-200 truncate">{ad.title}</h4>
                     <p className="text-[10px] text-gray-500 truncate">{ad.desc}</p>
                 </div>
            </div>
            <a href={ad.link} className="flex-shrink-0 text-[10px] font-bold text-coinlect-accent border border-coinlect-accent/20 px-2 py-1 rounded hover:bg-coinlect-accent hover:text-black transition-colors whitespace-nowrap">
                Voir
            </a>
        </div>
       </div>
    );
  }

  return (
    <div className={`container mx-auto px-6 my-16 ${className}`}>
      <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r ${ad.color}`}>
        {/* Background Image with overlay */}
        <div className="absolute inset-0 z-0">
             <img src={ad.image} alt="Ad Background" className="object-cover w-full h-full opacity-10 mix-blend-overlay" />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 p-6 md:flex-row md:p-8">
            <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white/10 text-gray-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/5">
                        SPONSORED
                    </span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">{ad.title}</h3>
                <p className="text-sm text-gray-400">{ad.desc}</p>
            </div>
            <a 
                href={ad.link} 
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
                {ad.cta} <ExternalLink size={14} />
            </a>
        </div>
      </div>
    </div>
  );
};