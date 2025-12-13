'use client';

import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { MarketCoin, MOCK_MARKET_DATA } from '../mockData';

export const Ticker: React.FC = () => {
  const [items, setItems] = useState<MarketCoin[]>(MOCK_MARKET_DATA);
  const [isUsingRealtime, setIsUsingRealtime] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h'
        );
        
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setItems(data);
            setIsUsingRealtime(true);
          }
        }
      } catch (error) {
        // Silently fail to mock data for ticker
        setIsUsingRealtime(false);
        setItems(MOCK_MARKET_DATA);
      }
    };

    fetchPrices();
    // Refresh every 2 minutes to be safe with rate limits
    const interval = setInterval(fetchPrices, 120000); 
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  return (
    <div className="sticky top-[80px] z-40 w-full py-3 overflow-hidden border-y border-white/5 bg-black/80 backdrop-blur-sm">
      <div className="flex min-w-full gap-12 animate-scroll whitespace-nowrap hover:pause-animation">
        {/* Triple list for seamless loop */}
        {[...items, ...items, ...items].map((coin, index) => {
          const change = coin.price_change_percentage_24h || 0;
          return (
            <div key={`${coin.id}-${index}`} className="flex items-center gap-2 text-xs cursor-default group">
              {coin.image ? (
                  <img src={coin.image} alt={coin.symbol} className="w-4 h-4 rounded-full" />
              ) : (
                  <Activity className="w-4 h-4 text-gray-500" />
              )}
              
              <span className="font-bold text-gray-200 uppercase">{coin.symbol}</span>
              <span className="font-mono text-gray-400">{formatPrice(coin.current_price)}</span>
              
              <span className={`font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}
                {change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
      
      {!isUsingRealtime && (
         <div className="absolute -translate-y-1/2 right-2 top-1/2 group">
             <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
             <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                Cached Data
             </div>
         </div>
      )}

      {isUsingRealtime && (
         <div className="absolute -translate-y-1/2 right-2 top-1/2 group">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black border border-white/10 px-2 py-1 rounded text-[10px] text-green-400 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                Live Data
             </div>
         </div>
      )}

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .hover\\:pause-animation:hover {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
