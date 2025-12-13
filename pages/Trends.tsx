'use client';

import React, { useState, useEffect } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { Ticker } from '../components/Ticker';
import { AdBanner } from '../components/AdBanner';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Clock, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { MarketCoin, MOCK_MARKET_DATA } from '../mockData';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  imageUrl: string;
  category: string;
  url: string;
}

const FALLBACK_NEWS: NewsItem[] = [
    {
        id: 'fallback-1',
        title: 'Bitcoin Halving Event: What You Need to Know',
        summary: 'As the next Bitcoin halving approaches, analysts predict major market movements. Here is a comprehensive guide to understanding the impact on miners and investors.',
        source: 'Coinlect Insights',
        time: 'Recent',
        imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80',
        category: 'Bitcoin',
        url: 'https://www.coindesk.com'
    },
    {
        id: 'fallback-2',
        title: 'Ethereum Layer 2 Solutions Gain Traction',
        summary: 'Optimism and Arbitrum see record transaction volumes as users seek lower fees and faster confirmation times during network congestion.',
        source: 'DeFi Daily',
        time: '1h ago',
        imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696c6c5c?auto=format&fit=crop&q=80',
        category: 'Ethereum',
        url: 'https://cointelegraph.com'
    },
    {
        id: 'fallback-3',
        title: 'Regulatory Landscape Shifts for Crypto Exchanges',
        summary: 'New compliance requirements are shaping how major exchanges operate in key markets across the globe, impacting user verification processes.',
        source: 'Regulatory Watch',
        time: '3h ago',
        imageUrl: 'https://images.unsplash.com/photo-1621504450162-e1529671963b?auto=format&fit=crop&q=80',
        category: 'Regulation',
        url: 'https://www.bloomberg.com/crypto'
    }
];

export const Trends: React.FC = () => {
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);

  // Helper to format relative time from UNIX timestamp (seconds)
  const getRelativeTime = (timestamp: number) => {
    // If timestamp is unreasonably small for ms, assume it's seconds
    const timeInMs = timestamp < 100000000000 ? timestamp * 1000 : timestamp;
    const seconds = Math.floor((new Date().getTime() - timeInMs) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min ago";
    return "Just now";
  };

  const fetchNews = async (isBackground = false) => {
    if (!isBackground) setNewsLoading(true);
    try {
        // Using CryptoCompare API which is more reliable for public news feeds than CoinGecko
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        
        if (!response.ok) throw new Error("API Limit or Error");

        const data = await response.json();
        
        if (data.Data && data.Data.length > 0) {
            const formattedNews = data.Data.slice(0, 9).map((item: any) => ({
                id: item.id,
                title: item.title,
                summary: item.body, // CryptoCompare uses 'body' for summary
                source: item.source_info?.name || 'CryptoNews',
                time: getRelativeTime(item.published_on),
                imageUrl: item.imageurl, 
                category: item.categories?.split('|')[0] || "Crypto",
                url: item.url
            }));
            setNews(formattedNews);
        } else {
            throw new Error("No data received");
        }
    } catch (err) {
        console.warn("Failed to fetch news, using fallback data:", err);
        // Ensure we show fallback data if the API fails
        if (news.length === 0) {
            setNews(FALLBACK_NEWS);
        }
    } finally {
        if (!isBackground) setNewsLoading(false);
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setCoins(data);
        setIsLive(true);
      } else {
        throw new Error('Invalid data format');
      }
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.warn("API Error, using fallback data:", err);
      setCoins(MOCK_MARKET_DATA);
      setIsLive(false);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMarketData();
    fetchNews();

    // Refresh market data every 60 seconds
    const marketInterval = setInterval(() => fetchMarketData(), 60000);
    
    // Refresh news every 10 minutes (600,000 ms)
    const newsInterval = setInterval(() => fetchNews(true), 600000);

    // Cleanup on unmount
    return () => {
        clearInterval(marketInterval);
        clearInterval(newsInterval);
    };
  }, []);

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
      notation: "compact",
      maximumFractionDigits: 1
    }).format(number);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <ScrollReveal>
          <div className="container px-6 mx-auto mb-12">
            <div className="flex flex-col items-end justify-between gap-4 md:flex-row">
                <div>
                    <h1 className="mb-4 text-4xl font-bold">Market <span className="text-coinlect-accent">Trends</span></h1>
                    <p className="text-gray-400">Real-time data powered by CoinGecko API.</p>
                </div>
                <div className="flex items-center gap-4">
                    {lastUpdate && (
                        <span className="text-xs text-gray-500">
                            Last updated: {lastUpdate.toLocaleTimeString()}
                        </span>
                    )}
                    <button 
                        onClick={() => { setLoading(true); fetchMarketData(); fetchNews(); }}
                        className="p-2 transition-colors border rounded-full bg-white/5 hover:bg-white/10 border-white/10"
                        title="Refresh Data"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className={`text-xs text-black font-bold flex items-center gap-2 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.4)] ${isLive ? 'bg-coinlect-accent shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-gray-500'}`}>
                        <span className={`w-2 h-2 rounded-full bg-white ${isLive ? 'animate-pulse' : ''}`}></span>
                        {isLive ? 'Live Market' : 'Offline Data'}
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
            <div className="glass-card rounded-2xl overflow-hidden border border-white/10 bg-[#0F0F0F] relative min-h-[400px]">
                {/* Decorative header glow */}
                <div className="absolute top-0 left-0 right-0 h-1 opacity-50 bg-gradient-to-r from-transparent via-coinlect-accent/50 to-transparent"></div>
                
                {error ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 gap-4">
                        <AlertCircle size={48} className="text-red-500" />
                        <p>{error}</p>
                        <Button onClick={() => { setLoading(true); fetchMarketData(); }}>Try Again</Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="text-xs font-semibold tracking-wider text-gray-500 uppercase border-b bg-white/5 border-white/10">
                                <tr>
                                    <th className="p-6 pl-8">Asset</th>
                                    <th className="p-6 text-right">Price</th>
                                    <th className="p-6 text-right">24h Change</th>
                                    <th className="hidden p-6 text-right md:table-cell">24h Volume</th>
                                    <th className="hidden p-6 text-right lg:table-cell">Market Cap</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading && coins.length === 0 ? (
                                    // Skeleton Loader
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="p-6 pl-8"><div className="w-32 h-10 rounded bg-white/5"></div></td>
                                            <td className="p-6"><div className="w-20 h-6 ml-auto rounded bg-white/5"></div></td>
                                            <td className="p-6"><div className="w-16 h-6 ml-auto rounded bg-white/5"></div></td>
                                            <td className="hidden p-6 md:table-cell"><div className="w-24 h-6 ml-auto rounded bg-white/5"></div></td>
                                            <td className="hidden p-6 lg:table-cell"><div className="h-6 ml-auto rounded w-28 bg-white/5"></div></td>
                                        </tr>
                                    ))
                                ) : (
                                    coins.map((coin) => (
                                        <tr key={coin.id} className="transition-colors hover:bg-white/5 group">
                                            <td className="p-6 pl-8">
                                                <div className="flex items-center gap-4">
                                                    <span className="hidden w-6 font-mono text-sm text-gray-600 md:block">#{coin.market_cap_rank}</span>
                                                    <img src={coin.image} alt={coin.name} className="w-8 h-8 transition-transform duration-300 rounded-full shadow-lg group-hover:scale-110" />
                                                    <div>
                                                        {/* Full name hidden on mobile */}
                                                        <div className="hidden text-sm font-bold text-white transition-colors group-hover:text-coinlect-accent md:block">{coin.name}</div>
                                                        {/* Ticker prominent on mobile, gray on desktop */}
                                                        <div className="text-sm font-bold text-white uppercase md:text-xs md:text-gray-500 md:font-normal">{coin.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="font-mono font-medium tracking-tight text-white">
                                                    {formatCurrency(coin.current_price)}
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${coin.price_change_percentage_24h >= 0 ? 'text-green-400 border-green-500/20 bg-green-500/10' : 'text-red-400 border-red-500/20 bg-red-500/10'}`}>
                                                    {coin.price_change_percentage_24h >= 0 ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                                                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                                </div>
                                            </td>
                                            <td className="hidden p-6 font-mono text-sm text-right text-gray-400 md:table-cell">
                                                ${formatCompactNumber(coin.total_volume)}
                                            </td>
                                            <td className="hidden p-6 font-mono text-sm text-right text-gray-400 lg:table-cell">
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
        <div className="relative">
            <ScrollReveal>
                <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        <TrendingUp className="text-coinlect-accent" />
                        Trending <span className="text-white">Crypto News</span>
                    </h2>
                    <Button variant="ghost" withArrow onClick={() => window.open('https://cryptopanic.com/', '_blank')} className="justify-center w-full md:w-auto md:justify-start">View More News</Button>
                </div>
            </ScrollReveal>

            {newsLoading && news.length === 0 ? (
               <div className="grid gap-8 md:grid-cols-3">
                   {Array.from({length: 6}).map((_, i) => (
                       <div key={i} className="h-64 glass-card rounded-2xl animate-pulse"></div>
                   ))}
               </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-3">
                    {news.map((newsItem, idx) => (
                        <ScrollReveal key={newsItem.id} delay={idx * 50}>
                            <article className="flex flex-col h-full overflow-hidden transition-all duration-300 border cursor-pointer group glass-card rounded-2xl border-white/10 hover:border-coinlect-accent/30" onClick={() => window.open(newsItem.url, '_blank')}>
                                <div className="relative h-48 overflow-hidden bg-black/50">
                                    <img 
                                        src={newsItem.imageUrl} 
                                        alt={newsItem.title} 
                                        className="object-cover w-full h-full transition-transform duration-700 transform group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1621504450162-e1529671963b?auto=format&fit=crop&q=80';
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
                                        <span className="flex items-center gap-1"><Clock size={10} /> {newsItem.time}</span>
                                    </div>
                                    
                                    <h3 className="mb-3 text-lg font-bold text-white transition-colors line-clamp-2 group-hover:text-coinlect-accent">
                                        {newsItem.title}
                                    </h3>
                                    
                                    <p className="flex-grow mb-6 text-sm text-gray-400 line-clamp-3">
                                        {newsItem.summary || "Click to read the full article..."}
                                    </p>
                                    
                                    <a 
                                        href={newsItem.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-2 mt-auto text-sm font-medium text-white transition-colors hover:text-coinlect-accent"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Read Full Story <ExternalLink size={14} />
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
