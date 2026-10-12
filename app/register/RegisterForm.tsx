'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AdBanner } from '@/components/AdBanner';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { ComponentsLayout } from '../components-layout';

export function RegisterForm() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', website: '' });
  const [fieldErrors, setFieldErrors] = useState<{ firstName?: string; lastName?: string; email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register, error } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Timestamp when the form first rendered — used as a bot-detection signal
  // (bots submit instantly, humans take a few seconds to fill the form).
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const errors: typeof fieldErrors = {};
    const first = formData.firstName.trim();
    const last = formData.lastName.trim();

    if (!first) errors.firstName = 'First name is required';
    else if (first.length > 50) errors.firstName = 'First name must be 50 characters or fewer';

    if (!last) errors.lastName = 'Last name is required';
    else if (last.length > 50) errors.lastName = 'Last name must be 50 characters or fewer';

    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (formData.email.length > 254 || !EMAIL_RE.test(formData.email.trim())) errors.email = 'Enter a valid email address';

    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (formData.password.length > 128) errors.password = 'Password must be 128 characters or fewer';
    else if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      errors.password = 'Password must contain at least one letter and one number';
    }

    return errors;
  };

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    if (!searchParams) return;
    
    const params = searchParams;
    const errorParam = params.get('error');
    const messageParam = params.get('message');
    
    if (errorParam === 'oauth_config' || errorParam === 'oauth_error') {
      setGoogleError(messageParam || 'OAuth configuration error. Please check your Google Cloud Console settings.');
    } else if (errorParam === 'auth_failed') {
      setGoogleError('Authentication failed. Please try again.');
    } else if (errorParam === 'server_config_error') {
      setGoogleError('Server configuration error. Please contact support.');
    }
    
    // Clean up URL parameters after displaying error
    if (errorParam) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

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

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);
    try {
      await register(
        `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        formData.email.trim(),
        formData.password,
        {
          website: formData.website,
          elapsedMs: Date.now() - (startedAtRef.current || Date.now()),
        }
      );
      router.push('/academy');
    } catch (err) {
      // Error is already handled by the AuthContext
      console.error('Registration failed:', err);
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
              <h1 className="mb-2 text-xl font-bold sm:text-2xl md:text-3xl">Create Account</h1>
              <p className="text-xs text-gray-500 sm:text-sm">Join Coinlect and start your crypto journey</p>
            </div>

            {error && (
              <div className="p-3 mb-4 text-xs text-center text-red-400 border rounded sm:text-sm bg-red-500/10 border-red-500/20">
                {error}
              </div>
            )}

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit} noValidate>
              {/* Honeypot: invisible to humans, bots auto-fill it. DO NOT remove. */}
              <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
                <label htmlFor="website">Please leave this field empty</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block mb-2 text-xs font-medium text-gray-400 sm:text-sm">First Name</label>
                    <input 
                      id="firstName" 
                      type="text" 
                      required
                      maxLength={50}
                      autoComplete="given-name"
                      value={formData.firstName}
                      aria-invalid={!!fieldErrors.firstName}
                      onChange={handleChange} 
                      className="w-full px-3 py-3 text-sm text-white transition-colors border rounded-lg sm:px-4 sm:text-base bg-white/5 border-white/20 focus:outline-none focus:border-coinlect-accent focus:ring-1 focus:ring-coinlect-accent/60" 
                      placeholder="John"
                    />
                  {fieldErrors.firstName && <p className="mt-1 text-xs text-red-400">{fieldErrors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-2 text-xs font-medium text-gray-400 sm:text-sm">Last Name</label>
                    <input 
                      id="lastName" 
                      type="text" 
                      required
                      maxLength={50}
                      autoComplete="family-name"
                      value={formData.lastName}
                      aria-invalid={!!fieldErrors.lastName}
                      onChange={handleChange} 
                      className="w-full px-3 py-3 text-sm text-white transition-colors border rounded-lg sm:px-4 sm:text-base bg-white/5 border-white/20 focus:outline-none focus:border-coinlect-accent focus:ring-1 focus:ring-coinlect-accent/60" 
                      placeholder="Doe"
                    />
                  {fieldErrors.lastName && <p className="mt-1 text-xs text-red-400">{fieldErrors.lastName}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-xs font-medium text-gray-400 sm:text-sm">Email Address</label>
                  <input 
                    id="email" 
                    type="email" 
                    required 
                    maxLength={254}
                    autoComplete="email"
                    value={formData.email}
                    aria-invalid={!!fieldErrors.email}
                    onChange={handleChange} 
                    className="w-full px-3 py-3 text-sm text-white transition-colors border rounded-lg sm:px-4 sm:text-base bg-white/5 border-white/20 focus:outline-none focus:border-coinlect-accent focus:ring-1 focus:ring-coinlect-accent/60" 
                    placeholder="you@example.com" 
                  />
                {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-xs font-medium text-gray-400 sm:text-sm">Password</label>
                <div className="relative">
                  <input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    value={formData.password}
                    aria-invalid={!!fieldErrors.password}
                    onChange={handleChange} 
                      className="w-full px-3 py-3 pr-10 text-sm text-white transition-colors border rounded-lg sm:px-4 sm:text-base bg-white/5 border-white/20 focus:outline-none focus:border-coinlect-accent focus:ring-1 focus:ring-coinlect-accent/60" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">At least 8 characters, with a letter and a number.</p>
                )}
              </div>
              
              <div className="pt-2 text-xs text-gray-500 sm:text-sm">
                By clicking Sign Up, you agree to our <a href="/terms" className="font-medium underline text-coinlect-accent">Terms</a> and <a href="/privacy" className="font-medium underline text-coinlect-accent">Privacy Policy</a>.
              </div>

              <Button size="sm" className="justify-center w-full py-3 text-sm font-semibold rounded-lg shadow-none" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
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
                <div className="p-3 mt-4 text-xs text-center text-red-400 border rounded sm:text-sm bg-red-500/10 border-red-500/20">
                  {googleError}
                </div>
              )}
            </div>

            <div className="mt-6 text-xs text-center text-gray-500 sm:mt-8 sm:text-sm">
              Already have an account? <Link href="/login" className="font-semibold text-white transition-colors hover:text-coinlect-accent">Sign in</Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </ComponentsLayout>
  );
}
