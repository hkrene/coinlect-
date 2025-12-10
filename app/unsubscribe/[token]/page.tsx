'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ComponentsLayout } from '../../components-layout';
import { Button } from '@/components/Button';
import { CheckCircle, XCircle, Mail, AlertCircle } from 'lucide-react';

export default function UnsubscribePage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscriber, setSubscriber] = useState<{ email: string; alreadyUnsubscribed: boolean } | null>(null);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubscriberInfo();
  }, [params.token]);

  const loadSubscriberInfo = async () => {
    try {
      const res = await fetch(`/api/newsletter/unsubscribe/${params.token}`);
      if (res.ok) {
        const data = await res.json();
        setSubscriber(data);
        if (data.alreadyUnsubscribed) {
          setUnsubscribed(true);
        }
      } else {
        setError('Invalid unsubscribe link');
      }
    } catch (err) {
      setError('Failed to load unsubscribe information');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setUnsubscribing(true);
    setError('');

    try {
      const res = await fetch(`/api/newsletter/unsubscribe/${params.token}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setUnsubscribed(true);
        setSubscriber({ email: data.email || subscriber?.email || '', alreadyUnsubscribed: true });
      } else {
        setError(data.error || 'Failed to unsubscribe');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setUnsubscribing(false);
    }
  };

  return (
    <ComponentsLayout>
      <div className="container flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-20 mx-auto">
        <div className="w-full max-w-md">
          <div className="relative p-8 overflow-hidden border glass-card rounded-2xl border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px] pointer-events-none"></div>

            {loading && (
              <div className="py-8 text-center">
                <div className="w-8 h-8 mx-auto mb-4 border-2 rounded-full border-coinlect-accent border-t-transparent animate-spin"></div>
                <p className="text-gray-400">Loading...</p>
              </div>
            )}

            {error && !subscriber && (
              <div className="py-8 text-center">
                <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
                <h1 className="mb-2 text-2xl font-bold text-white">Invalid Link</h1>
                <p className="mb-6 text-gray-400">{error}</p>
                <Button onClick={() => router.push('/')}>Go to Homepage</Button>
              </div>
            )}

            {subscriber && !unsubscribed && (
              <>
                <div className="mb-8 text-center">
                  <Mail className="mx-auto mb-4 text-gray-400" size={48} />
                  <h1 className="mb-2 text-2xl font-bold text-white">Unsubscribe</h1>
                  <p className="text-sm text-gray-400">
                    Are you sure you want to unsubscribe from our newsletter?
                  </p>
                  {subscriber.email && (
                    <p className="mt-2 font-medium text-white">{subscriber.email}</p>
                  )}
                </div>

                {error && (
                  <div className="p-3 mb-4 text-xs text-center text-red-400 border rounded bg-red-500/10 border-red-500/20">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <Button
                    onClick={handleUnsubscribe}
                    disabled={unsubscribing}
                    className="justify-center w-full py-3 bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
                  >
                    {unsubscribing ? 'Unsubscribing...' : 'Yes, Unsubscribe'}
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                    className="justify-center w-full py-3"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}

            {unsubscribed && subscriber && (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                <h1 className="mb-2 text-2xl font-bold text-white">Unsubscribed</h1>
                <p className="mb-2 text-gray-400">
                  You have been successfully unsubscribed from our newsletter.
                </p>
                {subscriber.email && (
                  <p className="mb-6 font-medium text-white">{subscriber.email}</p>
                )}
                <p className="mb-6 text-xs text-gray-500">
                  You will no longer receive emails from us. You can resubscribe at any time.
                </p>
                <Button onClick={() => router.push('/')} className="justify-center w-full py-3">
                  Return to Homepage
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ComponentsLayout>
  );
}

