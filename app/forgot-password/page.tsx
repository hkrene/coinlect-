'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Turnstile, isTurnstileEnabled } from '@/components/Turnstile';
// import { useAuth } from '@/contexts/AuthContext';
import { ComponentsLayout } from '../components-layout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  // const { forgotPassword } = useAuth(); // TODO: Implement forgot password functionality

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTurnstileEnabled() && !captchaToken) {
      setCaptchaError('Please complete the anti-bot verification.');
      return;
    }
    setCaptchaError(null);

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), captchaToken: captchaToken ?? undefined }),
      });
      if (!res.ok) {
        throw new Error('Failed to send password reset email');
      }
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
      console.error(err);
      // Turnstile tokens are single-use — reset so the visitor can retry.
      setCaptchaToken(null);
      setCaptchaKey((key) => key + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComponentsLayout>
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto sm:px-6 md:pt-32 md:pb-20">
        <ScrollReveal className="w-full max-w-md">
          <div className="p-6 sm:p-8">
            <div className="mb-6 text-center sm:mb-8">
              <h1 className="mb-2 text-xl font-bold sm:text-2xl md:text-3xl">Forgot Password</h1>
              <p className="text-xs text-gray-500 sm:text-sm">Enter your email to receive a password reset link</p>
            </div>

            {message && (
              <div className="p-3 mb-4 text-xs text-center text-green-400 border rounded sm:text-sm bg-green-500/10 border-green-500/20">
                {message}
              </div>
            )}

            {error && (
              <div className="p-3 mb-4 text-xs text-center text-red-400 border rounded sm:text-sm bg-red-500/10 border-red-500/20">
                {error}
              </div>
            )}

            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-400 sm:text-sm">Email Address</label>
                <input 
                  id="forgot-email"
                  name="email"
                  type="email" 
                  required
                  maxLength={254}
                  autoComplete="email"
                  className="w-full px-3 py-3 text-sm text-white transition-colors border rounded-lg sm:px-4 sm:py-3 sm:text-base bg-white/5 border-white/20 focus:outline-none focus:border-coinlect-accent focus:ring-1 focus:ring-coinlect-accent/60" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <Turnstile onVerify={setCaptchaToken} resetKey={captchaKey} className="flex justify-center" />
                {captchaError && <p className="mt-1 text-xs text-red-400">{captchaError}</p>}
              </div>

              <Button size="sm" className="justify-center w-full rounded-lg py-3 text-sm font-semibold shadow-none" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-xs text-center text-gray-500 sm:mt-8 sm:text-sm">
              Remember your password? <Link href="/login" className="font-semibold text-white transition-colors hover:text-coinlect-accent">Sign in</Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </ComponentsLayout>
  );
}

