'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface NewsletterSubscribeProps {
  source?: 'WEBSITE' | 'DASHBOARD' | 'COURSE_SIGNUP';
  userId?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Public newsletter subscription form component
 * Can be used anywhere on the site
 */
export const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({
  source = 'WEBSITE',
  userId,
  className = '',
  compact = false,
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          userId: userId || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 text-sm text-white border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
          disabled={status === 'loading'}
        />
        <Button type="submit" disabled={status === 'loading'} size="sm">
          {status === 'loading' ? '...' : 'Subscribe'}
        </Button>
      </form>
    );
  }

  return (
    <div className={`bg-[#111] border border-white/10 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Mail className="text-coinlect-accent" size={24} />
        <h3 className="text-xl font-bold text-white">Stay Updated</h3>
      </div>
      <p className="mb-4 text-sm text-gray-400">
        Subscribe to our newsletter for the latest crypto insights, trading tips, and platform updates.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
            disabled={status === 'loading'}
          />
        </div>

        {status === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <CheckCircle size={16} />
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle size={16} />
            {message}
          </div>
        )}

        <Button type="submit" disabled={status === 'loading'} className="w-full">
          {status === 'loading' ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </Button>

        <p className="text-xs text-center text-gray-500">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
};

