'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AdBanner } from '@/components/AdBanner';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { ComponentsLayout } from '../components-layout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const { login, error } = useAuth();
  const router = useRouter();

  // Load Google Identity Services script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
    if (!error) {
      router.push('/academy');
    }
  };

  return (
    <ComponentsLayout>
      <div className="container flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-20 mx-auto">
        <ScrollReveal className="w-full max-w-md">
          <div className="relative p-8 overflow-hidden border glass-card rounded-2xl border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-coinlect-accent/10 rounded-full blur-[50px] pointer-events-none"></div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold">Welcome Back</h1>
              <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
              <div className="mt-2 text-[10px] text-gray-600 bg-white/5 p-2 rounded">
                Demo Admin: admin@coinlect.com / admin123
              </div>
            </div>

            {error && (
              <div className="p-3 mb-4 text-xs text-center text-red-400 border rounded bg-red-500/10 border-red-500/20">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-400">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="bg-transparent border-gray-600 rounded" />
                  Remember me
                </label>
                <a href="#" className="text-coinlect-accent hover:underline">Forgot password?</a>
              </div>

              <Button className="justify-center w-full py-3" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-gray-500 bg-transparent">Or continue with</span>
                </div>
              </div>

              <div className="mt-4">
                <GoogleAuthButton
                  variant="login"
                  onSuccess={(user, tokens) => {
                    router.push('/academy');
                  }}
                  onError={(error) => {
                    setGoogleError(error);
                  }}
                />
              </div>

              {googleError && (
                <div className="p-3 mt-4 text-xs text-center text-red-400 border rounded bg-red-500/10 border-red-500/20">
                  {googleError}
                </div>
              )}
            </div>

            <div className="mt-8 text-xs text-center text-gray-500">
              Don't have an account? <Link href="/register" className="font-semibold text-white transition-colors hover:text-coinlect-accent">Sign up</Link>
            </div>
          </div>
          <AdBanner variant="compact" />
        </ScrollReveal>
      </div>
    </ComponentsLayout>
  );
}

