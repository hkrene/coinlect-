'use client';

import { useEffect, useRef, useState } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}

/** Whether a Turnstile site key is configured on the client. */
export function isTurnstileEnabled(): boolean {
  return Boolean(SITE_KEY);
}

// Cache the script load across every widget instance on the page.
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement('script');
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => {
      scriptPromise = null;
      reject(new Error('Failed to load Turnstile'));
    });
    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

interface TurnstileProps {
  /** Called with the verification token, or `null` when it expires or fails. */
  onVerify: (token: string | null) => void;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  /**
   * Change this value to reset (re-render) the widget — useful after a failed
   * submission, since Turnstile tokens are single-use.
   */
  resetKey?: number;
}

/**
 * Cloudflare Turnstile widget. Renders nothing when no site key is configured
 * (verification is then skipped server-side as well).
 */
export function Turnstile({ onVerify, theme = 'dark', className, resetKey = 0 }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const [failed, setFailed] = useState(false);

  // Keep the latest callback without re-rendering the widget on every render.
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!SITE_KEY) {
      onVerifyRef.current(null);
      return;
    }

    let cancelled = false;
    setFailed(false);

    const renderWidget = () => {
      if (cancelled || widgetIdRef.current || !containerRef.current || !window.turnstile) return;
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme,
          callback: (token: string) => onVerifyRef.current(token),
          'expired-callback': () => onVerifyRef.current(null),
          'timeout-callback': () => onVerifyRef.current(null),
          'error-callback': () => {
            setFailed(true);
            onVerifyRef.current(null);
          },
        });
      } catch {
        setFailed(true);
      }
    };

    loadTurnstileScript()
      .then(() => {
        if (!cancelled) renderWidget();
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // The widget may already be gone; nothing to clean up.
        }
      }
      widgetIdRef.current = null;
    };
  }, [theme, resetKey]);

  if (!SITE_KEY) return null;

  return (
    <div className={className}>
      <div ref={containerRef} />
      {failed && (
        <p className="mt-1 text-xs text-red-400">
          Anti-bot verification failed to load. Please refresh the page and try again.
        </p>
      )}
    </div>
  );
}
