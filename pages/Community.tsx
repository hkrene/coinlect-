'use client';

import React from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { ArrowRight } from 'lucide-react';
import CardSwap, { Card } from '../components/CardSwap';

// Social Media Icons truncated...
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
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.347.223-.644.075-.297-.15-.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  ),
};

const COMMUNITIES = [
  {
    category: "Official Channels",
    items: [
      {
        name: 'Twitter (X)',
        desc: 'Follow for real-time news & updates.',
        icon: Icons.X,
        url: 'https://x.com/coinlect',
        members: '1K',
        color: 'text-white'
      },
      {
        name: 'LinkedIn',
        desc: 'Professional network & careers.',
        icon: Icons.LinkedIn,
        url: 'https://www.linkedin.com/company/coinlect-academie',
        members: '12K',
        color: 'text-blue-500'
      }
    ]
  },
  {
    category: "Community Chat",
    items: [
      {
        name: 'Telegram Group',
        desc: 'Join the discussion with traders.',
        icon: Icons.Telegram,
        url: 'https://t.me/coinlect_academy',
        members: '28K',
        color: 'text-sky-400'
      },
      {
        name: 'WhatsApp Community',
        desc: 'Connect with students & mentors.',
        icon: Icons.WhatsApp,
        url: 'https://chat.whatsapp.com/KQ1LprXC9Qv3mkCF7tsLkX?mode=ems_copy_t',
        members: '5K',
        color: 'text-green-500'
      }
    ]
  },
  {
    category: "Content & Media",
    items: [
      {
        name: 'YouTube',
        desc: 'Video tutorials & market analysis.',
        icon: Icons.YouTube,
        url: 'https://www.youtube.com/@Coinlect',
        members: '150K',
        color: 'text-red-500'
      },
      {
        name: 'WhatsApp Channel',
        desc: 'Direct announcements feed.',
        icon: Icons.WhatsApp,
        url: 'https://whatsapp.com/channel/0029Vaex60vDuMReflHWmH0S',
        members: '10K',
        color: 'text-green-400'
      }
    ]
  }
];

export const Community: React.FC = () => {
  // Flatten all community items into a single array
  const allCommunities = COMMUNITIES.flatMap(section => section.items);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      
      {/* Hero Section */}
      <div className="relative pb-20 mb-12 overflow-hidden border-b border-white/5">
         <div className="container relative z-10 px-6 mx-auto text-center">
             <ScrollReveal>
                <h1 className="mb-6 text-4xl font-extrabold text-white md:text-6xl">
                   Our <span className="text-coinlect-accent">Communities</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-400">
                   Connect, learn, and grow with thousands of like-minded individuals across our various platforms. 
                   Choose the channel that fits your needs.
                </p>
             </ScrollReveal>
         </div>
      </div>

      <div className="container px-6 mx-auto max-w-7xl">
         <div className="relative h-[600px] flex items-center justify-center">
           <ScrollReveal>
             <CardSwap
               cardDistance={50}
               verticalDistance={60}
               delay={5000}
               pauseOnHover={false}
               width={400}
               height={320}
             >
               {allCommunities.map((item, index) => (
                 <Card
                   key={index}
                   customClass="p-6 cursor-pointer hover:border-coinlect-accent transition-colors bg-black/90 backdrop-blur-sm"
                   onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                 >
                   <div className="flex flex-col h-full">
                     <div className={`w-12 h-12 rounded-full bg-[#111] flex items-center justify-center border border-white/10 mb-4 ${item.color}`}>
                       <item.icon />
                     </div>
                     <h3 className="mb-2 text-xl font-bold text-white">{item.name}</h3>
                     <p className="flex-grow mb-3 text-sm text-gray-400">{item.desc}</p>
                     <div className="flex items-center justify-between">
                       <span className="px-3 py-1 text-xs font-medium text-gray-500 rounded bg-white/5">
                         {item.members} members
                       </span>
                       <div className="flex items-center justify-center w-10 h-10 text-black transition-all bg-white rounded-full shadow-lg hover:bg-coinlect-accent hover:scale-110">
                         <ArrowRight size={20} />
                       </div>
                     </div>
                   </div>
                 </Card>
               ))}
             </CardSwap>
           </ScrollReveal>
         </div>
      </div>
    </div>
  );
};

export default Community;
