import { NextRequest, NextResponse } from 'next/server';
import { parseFeed, type FeedItem } from '@/lib/rss';
import { enforceRateLimit } from '@/lib/rate-limit';

/**
 * Market news proxy.
 *
 * Returns crypto headlines in English or French for the market page:
 *   GET /api/market/news?lang=en|fr
 *
 * Strategy:
 *   - If CRYPTOCOMPARE_API_KEY is set, use CryptoCompare's news API (native
 *     EN/FR feeds).
 *   - Otherwise fall back to keyless RSS feeds (Cointelegraph/Decrypt/CoinDesk
 *     for English, Cryptoast/Journal du Coin for French).
 *
 * Responses are CDN-cached for 10 minutes so third-party sources are hit at
 * most a few times per hour, not once per visitor.
 */

export const revalidate = 600;

type NewsLang = 'en' | 'fr';

const FEEDS: Record<NewsLang, { url: string; source: string }[]> = {
  en: [
    { url: 'https://cointelegraph.com/rss', source: 'Cointelegraph' },
    { url: 'https://decrypt.co/feed', source: 'Decrypt' },
    { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  ],
  fr: [
    { url: 'https://cryptoast.fr/feed/', source: 'Cryptoast' },
    { url: 'https://journalducoin.com/feed/', source: 'Journal du Coin' },
  ],
};

const MAX_ARTICLES = 9;

async function fetchFeed(url: string, source: string): Promise<FeedItem[]> {
  const res = await fetch(url, {
    headers: {
      accept: 'application/rss+xml, application/xml, text/xml, */*',
      'user-agent': 'Coinlect/1.0 (+https://www.coinlect.org)',
    },
    next: { revalidate: 600 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Feed ${url} responded ${res.status}`);
  return parseFeed(await res.text(), { source, limit: MAX_ARTICLES + 3 });
}

async function fetchFromRss(lang: NewsLang): Promise<FeedItem[]> {
  const results = await Promise.allSettled(FEEDS[lang].map((feed) => fetchFeed(feed.url, feed.source)));
  const merged = results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));

  merged.sort((a, b) => {
    const at = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bt = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bt - at;
  });

  const seen = new Set<string>();
  const unique = merged.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return unique.slice(0, MAX_ARTICLES);
}

async function fetchFromCryptoCompare(lang: NewsLang): Promise<FeedItem[]> {
  const key = process.env.CRYPTOCOMPARE_API_KEY;
  if (!key) return [];

  const res = await fetch(
    `https://min-api.cryptocompare.com/data/v2/news/?lang=${lang.toUpperCase()}`,
    {
      headers: { authorization: `Apikey ${key}`, accept: 'application/json' },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    }
  );
  if (!res.ok) throw new Error(`CryptoCompare responded ${res.status}`);

  const data = await res.json();
  const list: any[] = Array.isArray(data?.Data) ? data.Data : [];

  return list.slice(0, MAX_ARTICLES).map((item) => ({
    id: String(item.id ?? item.url ?? ''),
    title: String(item.title ?? '').slice(0, 300),
    summary: String(item.body ?? '').slice(0, 600),
    url: String(item.url ?? ''),
    imageUrl: String(item.imageurl ?? ''),
    source: item.source_info?.name ?? 'CryptoCompare',
    category: String(item.categories ?? 'Crypto').split('|')[0],
    publishedAt: item.published_on ? new Date(item.published_on * 1000).toISOString() : null,
  }));
}

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req, 'market-news', 60, 60 * 1000);
  if (limited) return limited;

  const langParam = (req.nextUrl.searchParams.get('lang') ?? 'en').toLowerCase();
  const lang: NewsLang = langParam.startsWith('fr') ? 'fr' : 'en';
  const headers = { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' };

  try {
    let articles: FeedItem[] = [];
    let source = 'rss';

    try {
      articles = await fetchFromCryptoCompare(lang);
      if (articles.length > 0) source = 'cryptocompare';
    } catch (err) {
      console.warn('CryptoCompare news failed, falling back to RSS:', err);
    }

    if (articles.length === 0) {
      articles = await fetchFromRss(lang);
    }

    return NextResponse.json({ lang, source, articles }, { headers });
  } catch (err) {
    console.error('Market news error', err);
    // Return an empty list; the client keeps its last good data / fallback.
    return NextResponse.json({ lang, source: 'none', articles: [] }, { headers });
  }
}
