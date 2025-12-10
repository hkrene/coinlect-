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

export default function RegisterPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const { register, error } = useAuth();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await register(formData.firstName, formData.lastName, formData.email, formData.password);
    setIsLoading(false);
    router.push('/academy');
  };

  return (
    <ComponentsLayout>
      <div className="container flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-20 mx-auto">
        <ScrollReveal className="w-full max-w-md">
          <div className="relative p-8 overflow-hidden border glass-card rounded-2xl border-white/10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold">Create Account</h1>
              <p className="text-sm text-gray-500">Join Coinlect and start your crypto journey</p>
            </div>

            {error && (
              <div className="p-3 mb-4 text-xs text-center text-red-400 border rounded bg-red-500/10 border-red-500/20">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-xs font-medium text-gray-400">First Name</label>
                  <input id="firstName" type="text" required onChange={handleChange} className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent" />
                </div>
                <div>
                  <label className="block mb-2 text-xs font-medium text-gray-400">Last Name</label>
                  <input id="lastName" type="text" required onChange={handleChange} className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent" />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-400">Email Address</label>
                <input id="email" type="email" required onChange={handleChange} className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block mb-2 text-xs font-medium text-gray-400">Password</label>
                <input id="password" type="password" required onChange={handleChange} className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent" placeholder="••••••••" />
              </div>
              
              <div className="my-4 text-xs text-gray-500">
                By clicking Sign Up, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
              </div>

              <Button className="justify-center w-full py-3" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
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
                  variant="register"
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
              Already have an account? <Link href="/login" className="font-semibold text-white transition-colors hover:text-coinlect-accent">Sign in</Link>
            </div>
          </div>
          <AdBanner variant="compact" />
        </ScrollReveal>
      </div>
    </ComponentsLayout>
  );
}

