'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { Ticker } from '../components/Ticker';
import { AdBanner } from '../components/AdBanner';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Clock, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { MarketCoin, MOCK_MARKET_DATA } from '../mockData';
import { useLanguage } from '../contexts/LanguageContext';

type Language = 'fr' | 'en';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string | null;
  imageUrl: string;
  category: string;
  url: string;
}

/**
 * Localised fallback headlines shown only when the news API is unreachable.
 * The live feed (see /api/market/news) already returns per-language content.
 */
const FALLBACK_NEWS: Record<Language, NewsItem[]> = {
  fr: [
    {
      id: 'fallback-fr-1',
      title: "Halving du Bitcoin : ce qu'il faut savoir",
      summary:
        "À l'approche du prochain halving du Bitcoin, les analystes anticipent des mouvements majeurs. Guide complet pour comprendre l'impact sur les mineurs et les investisseurs.",
      source: 'Coinlect Insights',
      publishedAt: null,
      imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80',
      category: 'Bitcoin',
      url: 'https://www.coindesk.com',
    },
    {
      id: 'fallback-fr-2',
      title: 'Les solutions Layer 2 d\u2019Ethereum gagnent du terrain',
      summary:
        "Optimism et Arbitrum enregistrent des volumes record alors que les utilisateurs recherchent des frais réduits et des confirmations plus rapides.",
      source: 'DeFi Daily',
      publishedAt: null,
      imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696c6c5c?auto=format&fit=crop&q=80',
      category: 'Ethereum',
      url: 'https://cointelegraph.com',
    },
    {
      id: 'fallback-fr-3',
      title: 'La régulation des exchanges crypto évolue',
      summary:
        "De nouvelles exigences de conformité transforment le fonctionnement des grandes plateformes et impactent la vérification des utilisateurs.",
      source: 'Regulatory Watch',
      publishedAt: null,
      imageUrl: 'https://images.unsplash.com/photo-1621504450162-e1529671963b?auto=format&fit=crop&q=80',
      category: 'Régulation',
      url: 'https://www.bloomberg.com/crypto',
    },
  ],
  en: [
    {
      id: 'fallback-en-1',
      title: 'Bitcoin Halving Event: What You Need to Know',
      summary:
        'As the next Bitcoin halving approaches, analysts predict major market movements. Here is a comprehensive guide to understanding the impact on miners and investors.',
      source: 'Coinlect Insights',
      publishedAt: null,
      imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80',
      category: 'Bitcoin',
      url: 'https://www.coindesk.com',
    },
    {
      id: 'fallback-en-2',
      title: 'Ethereum Layer 2 Solutions Gain Traction',
      summary:
        'Optimism and Arbitrum see record transaction volumes as users seek lower fees and faster confirmation times during network congestion.',
      source: 'DeFi Daily',
      publishedAt: null,
      imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696c6c5c?auto=format&fit=crop&q=80',
      category: 'Ethereum',
      url: 'https://cointelegraph.com',
    },
    {
      id: 'fallback-en-3',
      title: 'Regulatory Landscape Shifts for Crypto Exchanges',
      summary:
        'New compliance requirements are shaping how major exchanges operate in key markets across the globe, impacting user verification processes.',
      source: 'Regulatory Watch',
      publishedAt: null,
      imageUrl: 'https://images.unsplash.com/photo-1621504450162-e1529671963b?auto=format&fit=crop&q=80',
      category: 'Regulation',
      url: 'https://www.bloomberg.com/crypto',
    },
  ],
};

/** Localised relative time (e.g. "il y a 2 h" / "2 hours ago"). */
function formatRelativeTime(publishedAt: string | null, language: Language): string {
  if (!publishedAt) {
    return language === 'fr' ? "À l'instant" : 'Just now';
  }
  const timestamp = Date.parse(publishedAt);
  if (Number.isNaN(timestamp)) {
    return language === 'fr' ? "À l'instant" : 'Just now';
  }

  const diffSeconds = Math.round((timestamp - Date.now()) / 1000);
  const abs = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });

  if (abs < 60) return rtf.format(diffSeconds, 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSeconds / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diffSeconds / 3600), 'hour');
  if (abs < 2592000) return rtf.format(Math.round(diffSeconds / 86400), 'day');
  if (abs < 31536000) return rtf.format(Math.round(diffSeconds / 2592000), 'month');
  return rtf.format(Math.round(diffSeconds / 31536000), 'year');
}

export const Trends: React.FC = () => {
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const { language, t } = useLanguage();
  // Language the currently displayed news was fetched for, so a failed
  // background refresh never mixes languages.
  const newsLangRef = useRef<Language | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      const response = await fetch('/api/market/prices', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      const data = await response.json();
      const list: MarketCoin[] = Array.isArray(data.coins) ? data.coins : [];
      if (list.length === 0) throw new Error('Invalid data format');

      setCoins(list);
      setIsLive(Boolean(data.live));
      setError(null);
    } catch (err) {
      console.warn('Market prices unavailable, using fallback data:', err);
      setCoins(MOCK_MARKET_DATA);
      setIsLive(false);
    } finally {
      setLastUpdate(new Date());
      setLoading(false);
    }
  }, []);

  const fetchNews = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setNewsLoading(true);
      try {
        const response = await fetch(`/api/market/news?lang=${language}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);

        const data = await response.json();
        const list: NewsItem[] = Array.isArray(data.articles) ? data.articles : [];
        if (list.length === 0) throw new Error('No news received');

        setNews(list);
        newsLangRef.current = language;
      } catch (err) {
        console.warn('Failed to fetch news, using fallback data:', err);
        setNews((current) =>
          current.length === 0 || newsLangRef.current !== language ? FALLBACK_NEWS[language] : current
        );
        newsLangRef.current = language;
      } finally {
        if (!isBackground) setNewsLoading(false);
      }
    },
    [language]
  );

  useEffect(() => {
    fetchMarketData();
    const marketInterval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(marketInterval);
  }, [fetchMarketData]);

  useEffect(() => {
    fetchNews();
    const newsInterval = setInterval(() => fetchNews(true), 600000);
    return () => clearInterval(newsInterval);
  }, [fetchNews]);

  const refreshAll = () => {
    setLoading(true);
    fetchMarketData();
    fetchNews();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatCompactNumber = (number: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(number);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <ScrollReveal>
        <div className="container px-6 mx-auto mb-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h1 className="mb-4 text-4xl font-bold text-center md:text-left">
                {t.trends.title} <span className="text-coinlect-accent">Crypto</span>
              </h1>
              <p className="max-w-3xl mt-3 text-xs leading-relaxed text-center text-gray-300 md:text-sm md:text-left">
                {t.trends.heroText}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshAll}
                className="p-2 transition-colors border rounded-full bg-white/5 hover:bg-white/10 border-white/10"
                title={t.trends.lastUpdate}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <div
                className={`text-xs text-black font-bold flex items-center gap-2 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.4)] ${
                  isLive ? 'bg-coinlect-accent shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-gray-500'
                }`}
              >
                <span className={`w-2 h-2 rounded-full bg-white ${isLive ? 'animate-pulse' : ''}`}></span>
                {isLive ? t.trends.live : t.trends.offline}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Ticker for visual flair */}
      <Ticker />

      <div className="container px-6 mx-auto mt-12 space-y-24">
        {/* MARKET TABLE SECTION */}
        <ScrollReveal delay={200}>
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0F0F0F] relative min-h-[400px]">
            {/* Decorative header glow */}
            <div className="absolute top-0 left-0 right-0 h-1 opacity-50 bg-gradient-to-r from-transparent via-coinlect-accent/50 to-transparent"></div>

            {error ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 gap-4">
                <AlertCircle size={48} className="text-red-500" />
                <p>{error}</p>
                <Button onClick={refreshAll}>{t.common.tryAgain}</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="text-xs font-semibold tracking-wider text-gray-500 uppercase border-b bg-white/5 border-white/10">
                    <tr>
                      <th className="p-3 pl-4 pr-2 text-left sm:p-3 sm:pl-4 sm:pr-2 md:p-6 md:pl-8 md:pr-6">{t.trends.table.asset}</th>
                      <th className="p-3 px-2 text-left sm:p-3 sm:px-2 md:p-6 md:px-6">{t.trends.table.price}</th>
                      <th className="p-3 px-2 text-left sm:p-3 sm:px-2 md:p-6 md:px-6">{t.trends.table.change}</th>
                      <th className="hidden p-3 px-2 text-right sm:p-3 sm:px-2 md:table-cell md:p-6 md:px-6">{t.trends.table.volume}</th>
                      <th className="hidden p-3 pl-2 pr-4 text-right sm:p-3 sm:pl-2 sm:pr-4 md:table-cell md:p-6 md:pl-6 md:pr-8">{t.trends.table.cap}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading && coins.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
                            <p className="text-white">{t.common.loading}</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      coins.map((coin) => (
                        <tr key={coin.id} className="transition-colors hover:bg-white/5 group">
                          <td className="p-3 pl-4 pr-2 sm:p-3 sm:pl-4 sm:pr-2 md:p-6 md:pl-8 md:pr-6">
                            <div className="flex items-center gap-2 md:gap-4">
                              <span className="hidden w-6 text-sm text-gray-600 md:block">#{coin.market_cap_rank}</span>
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-6 h-6 transition-transform duration-300 rounded-full shadow-lg md:w-8 md:h-8 group-hover:scale-110"
                              />
                              <div>
                                <div className="hidden text-sm font-bold text-white transition-colors group-hover:text-coinlect-accent md:block">
                                  {coin.name}
                                </div>
                                <div className="text-xs font-bold text-white uppercase md:text-gray-500 md:font-normal">{coin.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 px-2 sm:p-3 sm:px-2 md:p-6 md:px-6">
                            <div className="text-xs font-medium tracking-tight text-white md:text-sm">
                              {formatCurrency(coin.current_price)}
                            </div>
                          </td>
                          <td className="p-3 px-2 sm:p-3 sm:px-2 md:p-6 md:px-6">
                            <div
                              className={`inline-flex items-center gap-1 text-[10px] md:text-xs font-bold ${
                                coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}
                            >
                              {coin.price_change_percentage_24h >= 0 ? (
                                <ArrowUpRight size={10} strokeWidth={3} className="md:w-3 md:h-3" />
                              ) : (
                                <ArrowDownRight size={10} strokeWidth={3} className="md:w-3 md:h-3" />
                              )}
                              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                            </div>
                          </td>
                          <td className="hidden p-3 px-2 text-xs text-right text-gray-400 sm:p-3 sm:px-2 md:table-cell md:text-sm md:p-6 md:px-6">
                            ${formatCompactNumber(coin.total_volume)}
                          </td>
                          <td className="hidden p-3 pl-2 pr-4 text-xs text-right text-gray-400 sm:p-3 sm:pl-2 sm:pr-4 md:table-cell md:text-sm md:p-6 md:pl-6 md:pr-8">
                            ${formatCompactNumber(coin.market_cap)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <AdBanner />
        </ScrollReveal>

        {/* NEWS SECTION */}
        <div id="news" className="relative">
          <ScrollReveal>
            <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <TrendingUp className="text-coinlect-accent" id="news" />
                {t.trends.newsTitle} <span className="text-white">{t.trends.newsSubtitle}</span>
              </h2>
              <Button
                variant="ghost"
                withArrow
                onClick={() => window.open('https://cryptopanic.com/', '_blank')}
                className="justify-center w-full md:w-auto md:justify-start"
              >
                {t.trends.viewMoreNews}
              </Button>
            </div>
          </ScrollReveal>

          {newsLoading && news.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
              <p className="text-white">{t.common.loading}</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {news.map((newsItem, idx) => (
                <ScrollReveal key={newsItem.id} delay={idx * 50}>
                  <article
                    className="flex flex-col h-full overflow-hidden transition-all duration-300 border cursor-pointer group bg-[#0F0F0F] rounded-2xl border-white/10 hover:border-coinlect-accent/30"
                    onClick={() => window.open(newsItem.url, '_blank')}
                  >
                    <div className="relative h-48 overflow-hidden bg-black/50">
                      <img
                        src={newsItem.imageUrl}
                        alt={newsItem.title}
                        className="object-cover w-full h-full transition-transform duration-700 transform group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1621504450162-e1529671963b?auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute px-3 py-1 text-xs font-semibold text-white border rounded-full top-4 left-4 bg-black/60 backdrop-blur-md border-white/10">
                        {newsItem.category}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    </div>

                    <div className="flex flex-col flex-grow p-6">
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <span className="font-semibold text-coinlect-accent">{newsItem.source}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {formatRelativeTime(newsItem.publishedAt, language)}
                        </span>
                      </div>

                      <h3 className="mb-3 text-lg font-bold text-white transition-colors line-clamp-2 group-hover:text-coinlect-accent">
                        {newsItem.title}
                      </h3>

                      <p className="flex-grow mb-6 text-sm text-gray-400 line-clamp-3">
                        {newsItem.summary || (language === 'fr' ? 'Cliquez pour lire l’article complet...' : 'Click to read the full article...')}
                      </p>

                      <a
                        href={newsItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-auto text-sm font-medium text-white transition-colors hover:text-coinlect-accent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t.trends.readFull} <ExternalLink size={14} />
                      </a>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trends;
