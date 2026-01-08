'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';

interface GoogleAuthButtonProps {
  onSuccess?: (user: any, tokens: any) => void;
  onError?: (error: string) => void;
  variant?: 'login' | 'register';
  className?: string;
}

/**
 * Google OAuth button component
 * Uses Google Identity Services (newest API)
 * Handles OAuth flow and calls backend API
 */
export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onError,
  variant = 'login',
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useAuth();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = !!clientId;

  useEffect(() => {
    // Load Google Identity Services script only once
    if (typeof window === 'undefined' || window.google) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google) {
        console.warn('Google API not loaded');
        return;
      }

      try {
        // Check if we're in development and warn about Google OAuth configuration
        const isDevelopment = process.env.NODE_ENV !== 'production';
        const currentOrigin = window.location.origin;

        if (isDevelopment) {
          console.warn('Google OAuth Configuration Check:', {
            currentOrigin,
            expectedOrigins: ['http://localhost:3000', 'https://your-production-domain.com'],
            action: 'Add current origin to Google Cloud Console OAuth client authorized origins'
          });
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: 'popup',
          callback: async (response: any) => {
            setIsLoading(true);
            try {
              const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: response.credential }),
              });

              if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Authentication failed');
              }

              const data = await res.json();

              // Refresh user data from the server
              await refreshUser();

              onSuccess?.(data.user, {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              });
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
              onError?.(errorMessage);
            } finally {
              setIsLoading(false);
            }
          },
        });
      } catch (err) {
        console.error('Failed to initialize Google Sign-In:', err);
        onError?.('Failed to initialize Google Sign-In');
      }
    };

    script.onerror = () => {
      console.error('Failed to load Google Identity Services');
      onError?.('Failed to load Google Sign-In');
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      // Script cleanup handled by browser
    };
  }, [clientId, onSuccess, onError, refreshUser]);

  // Only disable Google Sign-In if not configured, not in development
  if (!isGoogleConfigured) {
    return null;
  }

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      // Fallback: redirect to Google OAuth
      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
      window.location.href = googleAuthUrl;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-400 rounded-full border-t-transparent animate-spin"></div>
          <span className="text-sm font-medium text-gray-300">
            Connecting...
          </span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-300">
            Continue with Google
          </span>
        </>
      )}
    </button>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
        };
        oauth2: {
          initTokenClient: (config: any) => any;
        };
      };
    };
  }
}

