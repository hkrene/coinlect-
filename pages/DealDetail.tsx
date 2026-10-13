'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { dealService } from '../services/db';
import { Deal } from '../types';
import { Button } from '../components/Button';
import { ScrollReveal } from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { ExternalLink, Tag, ChevronRight, Check, Star, ShieldCheck, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';

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
  const [codeCopied, setCodeCopied] = useState(false);
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

  const handleCopyCode = async () => {
    if (!deal?.code) return;
    try {
      await navigator.clipboard.writeText(deal.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
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
      {/* HEADER */}
      <div className="container max-w-4xl px-6 pt-28 mx-auto">
        <nav className="flex flex-wrap items-center gap-2 mb-6 text-sm text-zinc-500">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <ChevronRight size={14} />
          <Link href="/deals" className="transition-colors hover:text-white">Deals</Link>
          <ChevronRight size={14} />
          <span className="text-coinlect-accent">{deal.category}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
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

        <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
          {deal.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-6 mt-8 border-y border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 border-2 rounded-full bg-coinlect-accent/10 border-white/5 ring-2 ring-white/10">
              <Tag className="text-coinlect-accent" size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">CoinLect Deals</p>
              <p className="text-xs text-zinc-500">Verified Deal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 transition-all duration-300 rounded-full bg-white/5 hover:bg-[#1DA1F2] hover:text-white"
              title="Share on Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 transition-all duration-300 rounded-full bg-white/5 hover:bg-[#4267B2] hover:text-white"
              title="Share on Facebook"
            >
              <Facebook size={18} />
            </a>
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-full bg-white/5 text-zinc-400 transition-all duration-300 ${copied ? 'bg-green-500 text-white' : 'hover:bg-green-500 hover:text-white'}`}
              title={copied ? 'Link copied!' : 'Copy link'}
            >
              {copied ? <Check size={18} /> : <LinkIcon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* HERO IMAGE */}
      <div className="container max-w-4xl px-6 mx-auto mt-10">
        <div className="relative w-full overflow-hidden border shadow-2xl aspect-[16/9] rounded-2xl border-white/10 bg-[#0a0a0a]">
          <img
            src={deal.image || 'https://via.placeholder.com/800x450/333/666?text=No+Image'}
            alt={deal.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/800x450/333/666?text=No+Image';
            }}
          />
          {deal.exclusive && (
            <div className="absolute px-3 py-1 text-xs font-black tracking-widest text-black uppercase rounded-lg shadow-lg top-4 left-4 bg-coinlect-accent">
              Exclusive Deal
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="container max-w-3xl px-6 mx-auto">
        <ScrollReveal>
          <p className="mt-12 text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
            {deal.details || deal.description}
          </p>

          <div className="mt-10 overflow-hidden border rounded-2xl border-white/10 bg-[#0a0a0a]">
            <h3 className="px-6 py-4 text-sm font-semibold text-white border-b border-white/5">
              Deal Information
            </h3>
            <dl className="divide-y divide-white/5">
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <dt className="text-sm text-zinc-500">Category</dt>
                <dd className="text-sm font-medium text-white">{deal.category}</dd>
              </div>
              {deal.discount && (
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <dt className="text-sm text-zinc-500">Discount</dt>
                  <dd className="text-sm font-medium text-white">{deal.discount}</dd>
                </div>
              )}
              {deal.code && (
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <dt className="text-sm text-zinc-500">Promo Code</dt>
                  <dd>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-2 px-3 py-1.5 font-mono text-sm transition-colors border border-dashed rounded-md bg-white/5 border-white/15 text-coinlect-accent hover:border-coinlect-accent/50"
                      title="Copy promo code"
                    >
                      {deal.code}
                      {codeCopied ? <Check size={14} className="text-green-400" /> : <LinkIcon size={14} className="text-zinc-500" />}
                    </button>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </ScrollReveal>

        <div className="flex flex-col items-center mt-12 text-center">
          <a
            href={deal.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full gap-2 px-8 py-4 text-sm font-bold tracking-widest text-black uppercase transition-all duration-300 rounded-full sm:w-auto bg-coinlect-accent hover:bg-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.2)]"
          >
            <ExternalLink size={18} />
            Claim This Deal Now
          </a>
          <p className="mt-4 text-sm text-zinc-500">
            Don&apos;t miss out on this limited-time offer!
          </p>
        </div>
      </div>

      {/* RELATED DEALS */}
      {relatedDeals.length > 0 && (
        <div className="container max-w-5xl px-6 mx-auto mt-24">
          <ScrollReveal>
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold text-white">Related Deals</h2>
              <p className="text-zinc-500">More deals in {deal.category}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedDeals.map((relatedDeal, idx) => (
                <ScrollReveal key={relatedDeal.id} delay={idx * 100} className="h-full">
                  <Link href={`/deals/${relatedDeal.id}`} className="block h-full group">
                    <article className="relative flex flex-col h-full overflow-hidden transition-all duration-300 border rounded-2xl border-white/10 bg-[#0a0a0a] hover:border-white/30 hover:-translate-y-1">
                      <div className="relative w-full overflow-hidden bg-black aspect-[16/10]">
                        <img
                          src={relatedDeal.image || 'https://via.placeholder.com/400x250/333/666?text=No+Image'}
                          alt={relatedDeal.title}
                          className="object-cover w-full h-full transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/400x250/333/666?text=No+Image';
                          }}
                        />
                        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {relatedDeal.exclusive && (
                          <div className="absolute z-20 px-2.5 py-1 text-[9px] font-black tracking-widest text-black uppercase rounded-md shadow-lg top-3 left-3 bg-coinlect-accent">
                            {t.deals.exclusive}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-grow p-5">
                        <span className="mb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-coinlect-accent">{relatedDeal.category}</span>
                        <h3 className="text-base font-bold leading-snug text-white line-clamp-2 transition-colors group-hover:text-coinlect-accent">{relatedDeal.title}</h3>
                        <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{relatedDeal.description}</p>
                        {relatedDeal.discount && (
                          <span className="mt-3 text-sm font-bold text-coinlect-accent">{relatedDeal.discount}</span>
                        )}
                      </div>
                    </article>
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
