'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AdBanner } from '@/components/AdBanner';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { ComponentsLayout } from '../components-layout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto sm:px-6 md:pt-32 md:pb-20">
        <ScrollReveal className="w-full max-w-md">
          <div className="relative p-6 overflow-hidden border glass-card sm:p-8 rounded-2xl border-white/10">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-coinlect-accent/10 rounded-full blur-[50px] pointer-events-none"></div>

            <div className="mb-6 text-center sm:mb-8">
              <h1 className="mb-2 text-xl font-bold sm:text-2xl md:text-3xl">Welcome Back</h1>
              <p className="text-xs text-gray-500 sm:text-sm">Enter your credentials to access your account</p>
              <div className="mt-3 text-[10px] sm:text-xs text-gray-600 bg-white/5 p-2 sm:p-3 rounded">
                <span className="block sm:inline">Demo Admin: admin@coinlect.com / admin123</span>
              </div>
            </div>

            {error && (
              <div className="p-3 mb-4 text-xs text-center text-red-400 border rounded sm:text-sm bg-red-500/10 border-red-500/20">
                {error}
              </div>
            )}

            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-400 sm:text-sm">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-3 py-3 text-sm text-white transition-colors border rounded-lg sm:px-4 sm:py-3 sm:text-base bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent focus:ring-1 focus:ring-coinlect-accent/50" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-400 sm:text-sm">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    className="w-full px-3 py-3 pr-10 text-sm text-white transition-colors border rounded-lg sm:px-4 sm:py-3 sm:text-base bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent focus:ring-1 focus:ring-coinlect-accent/50" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 bg-transparent border-gray-600 rounded" />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="font-medium text-coinlect-accent hover:underline">Forgot password?</a>
              </div>

              <Button className="justify-center w-full py-3 text-sm font-semibold sm:py-4 sm:text-base" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-5 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase sm:text-sm">
                  <span className="px-3 text-gray-500 bg-[#0a0a0a]">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-5">
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
                <div className="p-3 mt-4 text-xs text-center text-red-400 border rounded sm:text-sm bg-red-500/10 border-red-500/20">
                  {googleError}
                </div>
              )}
            </div>

            <div className="mt-6 text-xs text-center text-gray-500 sm:mt-8 sm:text-sm">
              Don&apos;t have an account? <Link href="/register" className="font-semibold text-white transition-colors hover:text-coinlect-accent">Sign up</Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </ComponentsLayout>
  );
}

