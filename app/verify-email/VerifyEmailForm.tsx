'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ScrollReveal } from '@/components/ScrollReveal';

type VerifyStatus = 'idle' | 'loading' | 'success' | 'error';

export function VerifyEmailForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const attemptedRef = useRef(false);

  const uid = params?.get('uid') || '';
  const token = params?.get('token') || '';

  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    setStatus('loading');

    const verify = async () => {
      if (!uid || !token) {
        setStatus('error');
        setMessage('This verification link is missing required parameters. Please use the link from the email we sent you.');
        return;
      }
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: uid, token }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setStatus('error');
          setMessage(
            typeof data.error === 'string'
              ? data.error
              : 'This verification link is invalid or has expired. Please request a new one.'
          );
          return;
        }

        setStatus('success');
        setMessage(data.message || 'Your email address has been verified.');
      } catch {
        setStatus('error');
        setMessage('Something went wrong while verifying your email. Please try again.');
      }
    };

    verify();
  }, [uid, token]);

  return (
    <ScrollReveal className="w-full max-w-md">
      <div className="p-6 text-center sm:p-8">

        <div className="mb-6 text-center sm:mb-8">
          <h1 className="mb-2 text-xl font-bold sm:text-2xl md:text-3xl">Email Verification</h1>
          <p className="text-xs text-gray-500 sm:text-sm">Confirm your email address to activate your account</p>
        </div>

        {status === 'loading' && (
          <div className="py-10">
            <div className="w-8 h-8 mx-auto border-b-2 rounded-full animate-spin border-coinlect-accent"></div>
            <p className="mt-4 text-sm text-gray-500">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6">
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 border rounded-full bg-green-500/10 border-green-500/20">
              <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mb-8 text-sm text-gray-300 sm:text-base">{message}</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-black rounded-lg bg-coinlect-accent hover:bg-coinlect-accent/90"
            >
              Sign in
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6">
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 border rounded-full bg-red-500/10 border-red-500/20">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="mb-8 text-sm text-gray-300 sm:text-base">{message}</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-black rounded-lg bg-coinlect-accent hover:bg-coinlect-accent/90"
            >
              Go to Sign in
            </Link>
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}