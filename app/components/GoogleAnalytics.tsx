'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { readCookieConsent } from '@/components/CookieConsent';

const GA_MEASUREMENT_ID = 'G-CF5XWRM2XQ';

/**
 * Google Analytics, loaded only after the visitor accepts the cookie banner.
 *
 * Until a consent choice is made nothing is loaded; if the visitor declines,
 * gtag.js is never injected on this or future visits (the choice is persisted
 * in localStorage by CookieConsent).
 */
export function GoogleAnalytics() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setAccepted(readCookieConsent() === 'accepted');

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setAccepted(detail === 'accepted');
    };
    window.addEventListener('cookie-consent', onConsent);
    return () => window.removeEventListener('cookie-consent', onConsent);
  }, []);

  if (!accepted) return null;

  return (
    <>
      {/* Script Google Analytics (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}