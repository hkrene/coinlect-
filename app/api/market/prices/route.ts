import { NextRequest, NextResponse } from 'next/server';
import { MOCK_MARKET_DATA, type MarketCoin } from '@/mockData';
import { enforceRateLimit } from '@/lib/rate-limit';

/**
 * Live crypto prices proxy.
 *
 *   GET /api/market/prices
 *
 * Fetches the top coins from CoinGecko on the server (avoids client-side CORS
 * and rate-limit exposure), normalises the payload and falls back to bundled
 * mock data when CoinGecko is unavailable so the market page never breaks.
 */

export const revalidate = 60;

const COINGECKO_MARKETS =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h';

function normalizeCoin(coin: any): MarketCoin | null {
  if (!coin || typeof coin.id !== 'string') return null;
  return {
    id: coin.id,
    symbol: String(coin.symbol ?? '').toUpperCase(),
    name: String(coin.name ?? coin.id),
    image: String(coin.image ?? ''),
    current_price: Number(coin.current_price ?? 0),
    market_cap: Number(coin.market_cap ?? 0),
    market_cap_rank: Number(coin.market_cap_rank ?? 0) || 0,
    total_volume: Number(coin.total_volume ?? 0),
    price_change_percentage_24h: Number(coin.price_change_percentage_24h ?? 0),
  };
}

export async function GET(req: NextRequest) {
  // Read-only endpoint, but throttled so a single client can't amplify load.
  const limited = enforceRateLimit(req, 'market-prices', 120, 60 * 1000);
  if (limited) return limited;

  try {
    const res = await fetch(COINGECKO_MARKETS, {
      headers: { accept: 'application/json', 'user-agent': 'Coinlect/1.0 (+https://www.coinlect.org)' },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Invalid CoinGecko payload');

    const coins = data
      .map(normalizeCoin)
      .filter((coin): coin is MarketCoin => coin !== null);

    if (coins.length === 0) throw new Error('No usable coins in CoinGecko payload');

    return NextResponse.json(
      { coins, live: true, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err) {
    console.warn('Market prices error, serving fallback data:', err);
    return NextResponse.json(
      { coins: MOCK_MARKET_DATA, live: false, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' } }
    );
  }
}
