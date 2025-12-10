'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ComponentsLayout } from '../../../../../components-layout';
import { Button } from '@/components/Button';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    htmlContent: '',
    plainTextContent: '',
    scheduledAt: '',
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login');
      return;
    }
    loadCampaign();
  }, [isAuthenticated, isAdmin, router]);

  const loadCampaign = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/newsletter/campaigns/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const camp = data.campaign;
        setCampaign(camp);
        setFormData({
          title: camp.title,
          subject: camp.subject,
          htmlContent: camp.htmlContent,
          plainTextContent: camp.plainTextContent || '',
          scheduledAt: camp.scheduledAt 
            ? new Date(camp.scheduledAt).toISOString().slice(0, 16)
            : '',
        });
      }
    } catch (err) {
      console.error('Failed to load campaign', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/newsletter/campaigns/${params.id}`, {
        method: 'PATCH',
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
        router.push(`/admin/newsletter/campaigns/${params.id}`);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update campaign');
      }
    } catch (err) {
      alert('Failed to update campaign');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ComponentsLayout>
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </ComponentsLayout>
    );
  }

  if (!campaign) {
    return (
      <ComponentsLayout>
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-white">Campaign not found</div>
        </div>
      </ComponentsLayout>
    );
  }

  if (campaign.status === 'SENT') {
    return (
      <ComponentsLayout>
        <div className="min-h-screen pt-24 pb-20 bg-[#0a0a0a]">
          <div className="container max-w-4xl px-6 mx-auto">
            <div className="p-4 text-red-400 border rounded-lg bg-red-500/10 border-red-500/20">
              Cannot edit sent campaigns
            </div>
            <Link href={`/admin/newsletter/campaigns/${params.id}`}>
              <Button className="mt-4">Back to Campaign</Button>
            </Link>
          </div>
        </div>
      </ComponentsLayout>
    );
  }

  return (
    <ComponentsLayout>
      <div className="min-h-screen pt-24 pb-20 bg-[#0a0a0a]">
        <div className="container max-w-4xl px-6 mx-auto">
          <Link href={`/admin/newsletter/campaigns/${params.id}`}>
            <button className="flex items-center gap-2 mb-6 text-gray-400 transition-colors hover:text-white">
              <ArrowLeft size={20} /> Back to Campaign
            </button>
          </Link>

          <h1 className="mb-8 text-4xl font-bold text-white">Edit Campaign</h1>

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
              <label htmlFor="scheduledAt" className="block mb-2 text-sm font-medium text-gray-400">
                Schedule Send (Optional)
              </label>
              <input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="w-full px-4 py-3 text-white border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
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

