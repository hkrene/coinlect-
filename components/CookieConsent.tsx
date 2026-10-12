'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Cookie } from 'lucide-react';

const CONSENT_KEY = 'coinlect_cookie_consent';

export type CookieConsentChoice = 'accepted' | 'declined' | null;

export function readCookieConsent(): CookieConsentChoice {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(CONSENT_KEY);
  return stored === 'accepted' || stored === 'declined' ? stored : null;
}

/**
 * European-style cookie consent banner.
 *
 * Stores the visitor's choice in localStorage (`coinlect_cookie_consent`) and
 * broadcasts it via a `cookie-consent` CustomEvent so feature code such as
 * Google Analytics can load/unload accordingly. Declining never loads the
 * analytics scripts.
 */
export function CookieConsent() {
  const { t } = useLanguage();
  const [consent, setConsent] = useState<CookieConsentChoice>(null);

  useEffect(() => {
    setConsent(readCookieConsent());
  }, []);

  const choose = (choice: Exclude<CookieConsentChoice, null>) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // localStorage can throw (private mode/quota); fall through silently.
    }
    setConsent(choice);
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: choice }));
  };

  // Banner is only shown until a choice is made.
  if (consent !== null) return null;

  const copy = t.cookieBanner;

  return (
    <div
      role="dialog"
      aria-label={copy.title}
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-white/10 bg-[#111114]/95 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-start gap-3 sm:items-center">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coinlect-accent/15 text-coinlect-accent">
            <Cookie size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{copy.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
              {copy.description}{' '}
              <Link
                href="/privacy"
                className="font-medium text-coinlect-accent underline underline-offset-2 hover:text-yellow-400"
              >
                {copy.privacy}
              </Link>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose('declined')}
            className="flex-1 rounded-md border border-white/15 px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white sm:flex-none"
          >
            {copy.decline}
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="flex-1 rounded-md bg-coinlect-accent px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-yellow-500 sm:flex-none"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}