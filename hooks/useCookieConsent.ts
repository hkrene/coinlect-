'use client';

import { useEffect, useState } from 'react';
import { readCookieConsent, type CookieConsentChoice } from '@/components/CookieConsent';

/**
 * Tracks the visitor's cookie-consent choice and updates live when the choice
 * changes. Returns `null` until the visitor has accepted or declined, which lets
 * cookie-setting features (analytics, advertising) stay inert beforehand.
 */
export function useCookieConsent(): CookieConsentChoice {
  const [choice, setChoice] = useState<CookieConsentChoice>(null);

  useEffect(() => {
    setChoice(readCookieConsent());

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setChoice(detail === 'accepted' || detail === 'declined' ? detail : null);
    };

    window.addEventListener('cookie-consent', onConsent);
    return () => window.removeEventListener('cookie-consent', onConsent);
  }, []);

  return choice;
}
