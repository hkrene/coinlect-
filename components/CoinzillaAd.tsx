'use client';

import React from 'react';
import Script from 'next/script';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import {
  buildCoinzillaTagUrl,
  isCoinzillaEnabled,
  resolveCoinzillaZone,
  type CoinzillaZone,
} from '@/lib/ads';

interface CoinzillaAdProps {
  /** A named zone from `lib/ads` (`inline`, `header`, `sidebar`) or a raw id. */
  zone?: CoinzillaZone;
  /** `wide` = horizontal banner, `compact` = small inline unit. */
  variant?: 'wide' | 'compact';
  className?: string;
}

/**
 * A single Coinzilla ad placement.
 *
 * By default the shared library (`NEXT_PUBLIC_COINZILLA_SCRIPT_URL`, loaded once
 * in `components/CoinzillaScript`) fills any element carrying a
 * `data-coinzilla-zone` attribute. If your account uses a self-contained tag per
 * zone, set `NEXT_PUBLIC_COINZILLA_TAG_URL` with a `%ZONE%` placeholder and that
 * tag is injected straight into the slot instead.
 *
 * Ads set tracking cookies, so this follows the same consent gate as Google
 * Analytics: nothing renders or loads until the visitor accepts.
 *
 * ── TODO(coinzilla) ──────────────────────────────────────────────────────────
 * This is the only place that talks to the network. If Coinzilla send a tag
 * whose markup differs from the two modes above, adapt it here.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function CoinzillaAd({
  zone = 'inline',
  variant = 'wide',
  className = '',
}: CoinzillaAdProps) {
  const { t } = useLanguage();
  const consent = useCookieConsent();

  const zoneId = resolveCoinzillaZone(zone);

  if (!isCoinzillaEnabled(zone) || !zoneId || consent !== 'accepted') {
    return null;
  }

  const tagUrl = buildCoinzillaTagUrl(zoneId);
  const isCompact = variant === 'compact';

  const wrapperClass = isCompact
    ? `mx-auto my-6 w-full max-w-md ${className}`
    : `container mx-auto my-16 px-6 ${className}`;

  const slotClass = isCompact
    ? 'relative flex w-full min-h-[80px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#111]'
    : 'relative flex w-full min-h-[100px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#111]';

  return (
    <div className={wrapperClass} data-ad-placement="coinzilla">
      <div
        id={`coinzilla-slot-${zoneId}`}
        className={`coinzilla-ad ${slotClass}`}
        data-coinzilla-zone={zoneId}
      >
        <span className="pointer-events-none absolute right-0 top-0 rounded-bl bg-white/10 px-1.5 py-0.5 text-[8px] uppercase tracking-wide text-gray-400">
          {t.ads.label}
        </span>
        {tagUrl ? (
          <Script id={`coinzilla-tag-${zoneId}`} src={tagUrl} strategy="afterInteractive" />
        ) : null}
      </div>
    </div>
  );
}
