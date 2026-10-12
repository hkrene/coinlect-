/**
 * Coinzilla ad-network configuration.
 *
 * Coinzilla (https://coinzilla.com) is the crypto/finance ad network used to
 * monetise Coinlect. Placements ("zones") are created per page position in the
 * Coinzilla publisher dashboard (https://app.coinzilla.com) and referenced here
 * by id, so the rest of the app never hard-codes network details.
 *
 * Everything is optional. When the env vars are absent the site falls back to
 * the built-in house ads in `components/AdBanner.tsx`, so local development,
 * tests and preview deployments keep working without any ad code.
 *
 * ── TODO(coinzilla) ───────────────────────────────────────────────────────────
 * Fill in the values below with the real ones from your Coinzilla dashboard.
 * The exact place where the network tag is injected lives in
 * `components/CoinzillaAd.tsx`.
 * ──────────────────────────────────────────────────────────────────────────────
 */

/**
 * URL of the shared Coinzilla ad library. Coinzilla provides this once your
 * publisher site is approved. Loaded globally (see `components/CoinzillaScript`)
 * and fills every container carrying a `data-coinzilla-zone` attribute.
 */
export const COINZILLA_SCRIPT_URL = process.env.NEXT_PUBLIC_COINZILLA_SCRIPT_URL ?? '';

/**
 * Optional per-zone tag URL template. Use `%ZONE%` where the zone id belongs,
 * e.g. `https://cdn.coinzilla.io/tags/%ZONE%.js`.
 *
 * Some Coinzilla accounts hand out one self-contained `<script>` per zone
 * instead of a single shared loader. Set this if that is your case; leave it
 * blank to rely on the shared loader + `[data-coinzilla-zone]` containers.
 */
export const COINZILLA_TAG_URL = process.env.NEXT_PUBLIC_COINZILLA_TAG_URL ?? '';

/** Ad zone ids, one per placement, from the Coinzilla dashboard. */
export const COINZILLA_ZONES = {
  header: process.env.NEXT_PUBLIC_COINZILLA_ZONE_HEADER ?? '',
  inline: process.env.NEXT_PUBLIC_COINZILLA_ZONE_INLINE ?? '',
  sidebar: process.env.NEXT_PUBLIC_COINZILLA_ZONE_SIDEBAR ?? '',
} as const;

export type CoinzillaZoneName = keyof typeof COINZILLA_ZONES;

/**
 * Either one of the named zones above (for editor autocompletion) or a raw zone
 * id string straight from the dashboard.
 */
export type CoinzillaZone = CoinzillaZoneName | (string & {});

/** Resolve a zone name such as `inline` — or a raw id — to a zone id. */
export function resolveCoinzillaZone(zone: CoinzillaZone): string {
  if (zone in COINZILLA_ZONES) {
    return COINZILLA_ZONES[zone as CoinzillaZoneName];
  }
  return zone;
}

/** True when a real Coinzilla placement can be rendered. */
export function isCoinzillaEnabled(zone?: CoinzillaZone): boolean {
  if (!COINZILLA_SCRIPT_URL && !COINZILLA_TAG_URL) return false;
  if (zone === undefined) {
    return Object.values(COINZILLA_ZONES).some(Boolean);
  }
  return Boolean(resolveCoinzillaZone(zone));
}

/** Build the per-zone tag URL, or `null` when only the shared loader is used. */
export function buildCoinzillaTagUrl(zoneId: string): string | null {
  if (!COINZILLA_TAG_URL) return null;
  const encoded = encodeURIComponent(zoneId);
  return COINZILLA_TAG_URL.includes('%ZONE%')
    ? COINZILLA_TAG_URL.replace('%ZONE%', encoded)
    : `${COINZILLA_TAG_URL}${encoded}`;
}
