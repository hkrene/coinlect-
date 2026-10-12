'use client';

import React from 'react';
import Script from 'next/script';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { COINZILLA_SCRIPT_URL, isCoinzillaEnabled } from '@/lib/ads';

/**
 * Loads the shared Coinzilla ad library exactly once for the whole site.
 *
 * Rendered from the root layout next to Google Analytics. Like analytics, it is
 * gated on cookie consent: the script is never injected before the visitor
 * accepts, and never at all if they decline.
 */
export function CoinzillaScript() {
  const consent = useCookieConsent();

  if (!COINZILLA_SCRIPT_URL || !isCoinzillaEnabled() || consent !== 'accepted') {
    return null;
  }

  return (
    <Script id="coinzilla-loader" src={COINZILLA_SCRIPT_URL} strategy="afterInteractive" />
  );
}
