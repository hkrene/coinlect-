'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { dealService } from '../services/db';
import { Deal } from '../types';
import { Button } from '../components/Button';
import { ScrollReveal } from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, ExternalLink, Tag, ChevronRight, Check, Star, ShieldCheck, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const dynamic = 'force-dynamic';
export const generateStaticParams = () => [];

const DealDetail: React.FC = () => {
  const params = useParams();
  const dealId = params?.dealId as string;
  const [deal, setDeal] = useState<Deal | null>(null);
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/deals/${dealId}`);
        if (response.ok) {
          const data = await response.json();
          setDeal(data.deal);

          const deals = await dealService.getAll();
          const related = deals.filter(d => d.id !== data.deal.id && d.category === data.deal.category).slice(0, 3);
          setRelatedDeals(related);
        } else {
          setError('Deal not found');
        }
      } catch (error) {
        console.error('Error fetching deal:', error);
        setError('Failed to load deal');
      } finally {
        setLoading(false);
      }
    };

    if (dealId) {
      fetchData();
    }
  }, [dealId]);

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareText = encodeURIComponent(deal?.title || '');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center bg-black">
        <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
        <p className="text-white">Chargement de l&apos;offre...</p>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen px-6 pt-32 mx-auto text-center">
        <h2 className="mb-4 text-2xl font-bold">{error || 'Deal Not Found'}</h2>
        <Link href="/deals">
          <Button variant="secondary">Back to Deals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-black">
      <div className="fixed top-0 left-0 z-50 w-full h-1 bg-white/5">
         <div className="w-1/3 h-full bg-coinlect-accent"></div>
      </div>

      <div className="container max-w-4xl px-6 pb-10 mx-auto pt-28">
         <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
             <Link href="/" className="transition-colors hover:text-white">Home</Link>
             <ChevronRight size={14} />
             <Link href="/deals" className="transition-colors hover:text-white">Deals</Link>
             <ChevronRight size={14} />
             <span className="text-coinlect-accent">{deal.category}</span>
         </div>

         <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase border rounded-full bg-coinlect-accent/10 text-coinlect-accent border-coinlect-accent/20">
               {deal.category}
            </span>
            {deal.exclusive && (
              <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wider uppercase border rounded-full bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                <Star size={12} /> Exclusive
              </span>
            )}
            {deal.verified && (
              <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wider uppercase border rounded-full bg-green-500/10 text-green-500 border-green-500/20">
                <ShieldCheck size={12} /> Verified
              </span>
            )}
            {deal.discount && (
              <span className="px-3 py-1 text-xs font-bold tracking-wider text-blue-500 uppercase border rounded-full bg-blue-500/10 border-blue-500/20">
                {deal.discount}
              </span>
            )}
         </div>

         <h1 className="mb-8 text-3xl font-extrabold leading-tight text-white md:text-5xl">
            {deal.title}
         </h1>

         <div className="flex items-center justify-between py-6 border-y border-white/10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-coinlect-accent/10 border-2 border-[#0a0a0a] ring-2 ring-white/10 flex items-center justify-center">
                  <Tag className="text-coinlect-accent" size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">CoinLect Deals</p>
                    <p className="text-xs text-gray-500">Verified Deal</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
                 <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300"
                    title="Share on Twitter"
                 >
                     <Twitter size={18} />
                 </a>
                 <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-[#4267B2] hover:text-white transition-all duration-300"
                    title="Share on Facebook"
                 >
                     <Facebook size={18} />
                 </a>
                 <button
                    onClick={handleCopyLink}
                    className={`p-2 rounded-full bg-white/5 text-gray-400 transition-all duration-300 ${copied ? 'bg-green-500 text-white' : 'hover:bg-green-500 hover:text-white'}`}
                    title={copied ? 'Link copied!' : 'Copy link'}
                 >
                     {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                 </button>
             </div>
         </div>
      </div>

      <div className="container max-w-5xl px-6 mx-auto mb-12">
          <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={deal.image || 'https://via.placeholder.com/800x400/333/666?text=No+Image'}
                alt={deal.title}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x400/333/666?text=No+Image';
                }}
              />
              {deal.exclusive && (
                <div className="absolute top-0 left-0 px-4 py-2 text-sm font-black text-black uppercase bg-white rounded-full shadow-lg">
                  Exclusive Deal
                </div>
              )}
          </div>
      </div>

      <div className="container max-w-3xl px-6 mx-auto">
         <ScrollReveal>
             <div className="prose prose-lg prose-invert max-w-none">
                 <p className="mb-10 text-xl font-medium leading-relaxed text-white lead md:text-2xl">
                     {deal.details || deal.description}
                 </p>

                 <div className="p-6 mt-12 border bg-white/5 rounded-xl border-white/10">
                   <h3 className="mb-4 text-xl font-bold text-white">Deal Information</h3>
                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div>
                       <p className="text-sm text-gray-400">Category</p>
                       <p className="font-medium text-white">{deal.category}</p>
                     </div>
                     {deal.discount && (
                       <div>
                         <p className="text-sm text-gray-400">Discount</p>
                         <p className="font-medium text-white">{deal.discount}</p>
                       </div>
                     )}
                     {deal.code && (
                       <div className="md:col-span-2">
                         <p className="text-sm text-gray-400">Promo Code</p>
                         <div className="flex items-center gap-3 mt-1">
                           <code className="px-3 py-1 font-mono bg-gray-800 rounded text-coinlect-accent">{deal.code}</code>
                           <button
                             onClick={() => navigator.clipboard.writeText(deal.code!)}
                             className="text-xs text-gray-400 transition-colors hover:text-white"
                           >
                             Copy
                           </button>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
             </div>
         </ScrollReveal>

         <div className="mt-12 text-center">
           <a href={deal.link} target="_blank" rel="noopener noreferrer">
             <Button size="lg" className="px-8 py-4">
               <ExternalLink size={20} className="mr-2" />
               Claim This Deal Now
             </Button>
           </a>
           <p className="mt-4 text-sm text-gray-400">
             Don&apos;t miss out on this limited-time offer!
           </p>
         </div>
      </div>

      {relatedDeals.length > 0 && (
        <div className="container max-w-5xl px-6 mx-auto mt-24">
          <ScrollReveal>
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-white">Related Deals</h2>
              <p className="text-gray-400">More deals in {deal.category}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedDeals.map((relatedDeal, idx) => (
                <ScrollReveal key={relatedDeal.id} delay={idx * 100}>
                  <Link href={`/deals/${relatedDeal.id}`} className="block h-full group">
                    <div className="bg-[#111] rounded-xl overflow-hidden border border-white/5 group-hover:border-coinlect-accent/30 transition-all duration-300 h-full flex flex-col">
                      <div className="relative aspect-video">
                        <img
                          src={relatedDeal.image || 'https://via.placeholder.com/400x225/333/666?text=No+Image'}
                          alt={relatedDeal.title}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/400x225/333/666?text=No+Image';
                          }}
                        />
                        {relatedDeal.exclusive && (
                          <div className="absolute px-2 py-1 text-xs font-bold text-black bg-yellow-500 rounded shadow-lg top-2 left-2">
                            EXC
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-grow p-4">
                        <span className="mb-2 text-xs font-bold tracking-widest uppercase text-coinlect-accent">{relatedDeal.category}</span>
                        <h3 className="mb-2 font-bold text-white transition-colors line-clamp-2 group-hover:text-coinlect-accent">{relatedDeal.title}</h3>
                        <p className="flex-grow text-sm text-gray-400 line-clamp-2">{relatedDeal.description}</p>
                        {relatedDeal.discount && (
                          <span className="mt-2 font-bold text-coinlect-accent">{relatedDeal.discount}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      )}
    </div>
  );
};

export default DealDetail;
