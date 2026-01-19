'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ComponentsLayout } from '../components-layout';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params?.get('token') || '';
  const userId = params?.get('uid') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(() => {
    if (!token || !userId) return false;
    if (password.length < 8) return false;
    if (password !== confirm) return false;
    return true;
  }, [token, userId, password, confirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Failed to reset password' }));
        throw new Error(data.error || 'Failed to reset password');
      }
      setMessage('Votre mot de passe a été mis à jour. Vous pouvez vous connecter.');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComponentsLayout>
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto sm:px-6 md:pt-32 md:pb-20">
        <ScrollReveal className="w-full max-w-md">
          <div className="relative p-6 overflow-hidden border glass-card sm:p-8 rounded-2xl border-white/10">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-coinlect-accent/10 rounded-full blur-[50px] pointer-events-none"></div>

            <div className="mb-6 text-center sm:mb-8">
              <h1 className="mb-2 text-xl font-bold sm:text-2xl md:text-3xl">Reset Password</h1>
              <p className="text-xs text-gray-500 sm:text-sm">Choose a new password for your account</p>
            </div>

            {!token || !userId ? (
              <div className="p-3 mb-4 text-xs text-center text-red-400 border rounded sm:text-sm bg-red-500/10 border-red-500/20">
                Invalid or missing reset token. Please request a new link.
              </div>
            ) : null}

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
                <label className="block mb-2 text-xs font-medium text-gray-400 sm:text-sm">New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="w-full px-3 py-3 text-sm text-white transition-colors border rounded-lg sm:px-4 sm:py-3 sm:text-base bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent focus:ring-1 focus:ring-coinlect-accent/50"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-400 sm:text-sm">Confirm Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="w-full px-3 py-3 text-sm text-white transition-colors border rounded-lg sm:px-4 sm:py-3 sm:text-base bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent focus:ring-1 focus:ring-coinlect-accent/50"
                  placeholder="********"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              <Button className="justify-center w-full py-3 text-sm font-semibold sm:py-4 sm:text-base" disabled={isLoading || !canSubmit}>
                {isLoading ? 'Saving...' : 'Reset Password'}
              </Button>
            </form>

            <div className="mt-6 text-xs text-center text-gray-500 sm:mt-8 sm:text-sm">
              <Link href="/login" className="font-semibold text-white transition-colors hover:text-coinlect-accent">
                Back to login
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </ComponentsLayout>
  );
}

