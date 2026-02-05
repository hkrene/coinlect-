'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-CF5XWRM2XQ';

/**
 * Composant Google Analytics pour le tracking des événements
 * Utilise le composant Script de Next.js pour un chargement optimisé
 */
export function GoogleAnalytics() {
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
