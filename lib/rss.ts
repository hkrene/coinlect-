/**
 * Minimal, dependency-free RSS 2.0 / Atom feed parser.
 *
 * The only consumer is the market news route, which reads a few fields from a
 * handful of trusted feeds. It is defensive by design: malformed entries are
 * skipped rather than throwing, and every field is HTML-decoded and
 * length-bounded before it reaches the client.
 */

export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  source: string;
  category: string;
  publishedAt: string | null;
}

const MAX_ITEMS_PER_FEED = 25;
const MAX_TITLE = 300;
const MAX_SUMMARY = 600;

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  eacute: 'é',
  egrave: 'è',
  ecirc: 'ê',
  euml: 'ë',
  agrave: 'à',
  acirc: 'â',
  ccedil: 'ç',
  ugrave: 'ù',
  ucirc: 'û',
  ocirc: 'ô',
  icirc: 'î',
  iuml: 'ï',
  uuml: 'ü',
  oelig: 'œ',
  deg: '°',
  euro: '€',
  pound: '£',
  dollar: '$',
};

/** Decode the handful of HTML/XML entities that appear in feed titles. */
export function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => safeCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => safeCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

function safeCodePoint(code: number): string {
  if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return '';
  try {
    return String.fromCodePoint(code);
  } catch {
    return '';
  }
}

/** Remove tags/scripts and collapse whitespace into a plain-text snippet. */
export function stripHtml(value: string): string {
  return decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function unwrapCdata(value: string): string {
  const match = value.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  return match ? match[1] : value;
}

function getTag(block: string, name: string): string {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i');
  const match = block.match(re);
  return match ? unwrapCdata(match[1]).trim() : '';
}

function getAttr(tag: string, attr: string): string {
  const match = tag.match(new RegExp(`\\b${attr}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return match ? match[1].trim() : '';
}

function extractLink(block: string): string {
  const rss = block.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i);
  if (rss) {
    const value = stripHtml(unwrapCdata(rss[1]));
    if (value) return value;
  }
  // Atom style: <link href="..." rel="alternate" />
  const atom = block.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i);
  if (atom) return decodeEntities(atom[1]);
  const guid = getTag(block, 'guid');
  return guid ? stripHtml(guid) : '';
}

function extractImage(block: string, rawHtml: string): string {
  // media:content / media:thumbnail (Cointelegraph, many WordPress feeds)
  const media = block.match(/<media:(?:content|thumbnail)\b[^>]*\burl=["']([^"']+)["']/i);
  if (media) return decodeEntities(media[1]);

  // <enclosure url="..." type="image/...">
  for (const match of block.matchAll(/<enclosure\b[^>]*>/gi)) {
    const url = getAttr(match[0], 'url');
    const type = getAttr(match[0], 'type');
    if (url && (type.startsWith('image') || /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(url))) {
      return decodeEntities(url);
    }
  }

  // First <img> in the entry HTML.
  const img = rawHtml.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  if (img) return decodeEntities(img[1]);

  return '';
}

function splitEntries(xml: string): string[] {
  const blocks: string[] = [];
  const re = /<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml)) !== null) {
    blocks.push(match[2]);
    if (blocks.length >= MAX_ITEMS_PER_FEED * 4) break;
  }
  return blocks;
}

export interface ParseFeedOptions {
  /** Human-readable name of the publication, used as the article source. */
  source: string;
  /** Maximum number of items to return from this feed. */
  limit?: number;
}

/** Parse an RSS/Atom document into normalised feed items. */
export function parseFeed(xml: string, options: ParseFeedOptions): FeedItem[] {
  const limit = options.limit ?? MAX_ITEMS_PER_FEED;
  const items: FeedItem[] = [];

  for (const block of splitEntries(xml)) {
    if (items.length >= limit) break;

    const title = stripHtml(getTag(block, 'title')).slice(0, MAX_TITLE);
    const url = extractLink(block);
    if (!title || !url) continue;

    const rawHtml =
      getTag(block, 'content:encoded') ||
      getTag(block, 'description') ||
      getTag(block, 'summary') ||
      getTag(block, 'content');
    const summary = stripHtml(rawHtml).slice(0, MAX_SUMMARY);

    const dateValue =
      getTag(block, 'pubDate') ||
      getTag(block, 'published') ||
      getTag(block, 'updated') ||
      getTag(block, 'dc:date');
    const parsedDate = dateValue ? new Date(dateValue) : null;
    const publishedAt =
      parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null;

    items.push({
      id: stripHtml(getTag(block, 'guid')) || url,
      title,
      summary,
      url,
      imageUrl: extractImage(block, rawHtml),
      source: options.source,
      category: stripHtml(getTag(block, 'category')).slice(0, 60),
      publishedAt,
    });
  }

  return items;
}
