'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ComponentsLayout } from '../../../components-layout';
import { Button } from '@/components/Button';
import { ArrowLeft, Save, Send, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function NewCampaignPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    htmlContent: '',
    plainTextContent: '',
    scheduledAt: '',
  });

  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/newsletter/campaigns', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          scheduledAt: formData.scheduledAt || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/newsletter/campaigns/${data.campaign.id}`);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create campaign');
      }
    } catch (err) {
      alert('Failed to create campaign');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentsLayout>
      <div className="min-h-screen pt-24 pb-20 bg-[#0a0a0a]">
        <div className="container max-w-4xl px-6 mx-auto">
          <Link href="/admin/newsletter">
            <button className="flex items-center gap-2 mb-6 text-gray-400 transition-colors hover:text-white">
              <ArrowLeft size={20} /> Back to Newsletter Dashboard
            </button>
          </Link>

          <h1 className="mb-8 text-4xl font-bold text-white">Create Newsletter Campaign</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Campaign Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 text-white border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
                placeholder="Q1 2025 Newsletter"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Email Subject
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 text-white border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
                placeholder="Your Monthly Crypto Update"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">
                HTML Content
                <span className="ml-2 text-xs text-gray-500">
                  (Use {'{{UNSUBSCRIBE_URL}}'} for unsubscribe link)
                </span>
              </label>
              <textarea
                required
                rows={15}
                value={formData.htmlContent}
                onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                className="w-full px-4 py-3 font-mono text-sm text-white border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
                placeholder="<html><body><h1>Your Newsletter Content</h1><p>...</p><a href='{{UNSUBSCRIBE_URL}}'>Unsubscribe</a></body></html>"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Plain Text Content (Optional)
              </label>
              <textarea
                rows={10}
                value={formData.plainTextContent}
                onChange={(e) => setFormData({ ...formData, plainTextContent: e.target.value })}
                className="w-full px-4 py-3 font-mono text-sm text-white border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
                placeholder="Plain text version for email clients that don't support HTML"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Schedule Send (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="w-full px-4 py-3 text-white border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                <Save size={16} /> {loading ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ComponentsLayout>
  );
}

