'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ComponentsLayout } from '../../../components-layout';
import { Button } from '@/components/Button';
import { ArrowLeft, Send, Edit, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        setCampaign(data.campaign);
      }
    } catch (err) {
      console.error('Failed to load campaign', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!confirm('Send this campaign to all active subscribers?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/newsletter/campaigns/${params.id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        alert('Campaign sent successfully!');
        loadCampaign();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to send campaign');
      }
    } catch (err) {
      alert('Failed to send campaign');
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

  return (
    <ComponentsLayout>
      <div className="min-h-screen pt-24 pb-20 bg-[#0a0a0a]">
        <div className="container max-w-4xl px-6 mx-auto">
          <Link href="/admin/newsletter">
            <button className="flex items-center gap-2 mb-6 text-gray-400 transition-colors hover:text-white">
              <ArrowLeft size={20} /> Back to Newsletter Dashboard
            </button>
          </Link>

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white">{campaign.title}</h1>
              <p className="text-gray-400">{campaign.subject}</p>
            </div>
            <div className="flex gap-2">
              {campaign.status === 'DRAFT' && (
                <>
                  <Link href={`/admin/newsletter/campaigns/${params.id}/edit`}>
                    <Button variant="outline">
                      <Edit size={16} /> Edit
                    </Button>
                  </Link>
                  <Button onClick={handleSend}>
                    <Send size={16} /> Send Now
                  </Button>
                </>
              )}
            </div>
          </div>

          {campaign.stats && (
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-[#111] border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{campaign.stats.sent}</div>
                <div className="text-sm text-gray-400">Sent</div>
              </div>
              <div className="bg-[#111] border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">{campaign.stats.delivered}</div>
                <div className="text-sm text-gray-400">Delivered</div>
              </div>
              <div className="bg-[#111] border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">{campaign.stats.opened}</div>
                <div className="text-sm text-gray-400">Opened</div>
              </div>
              <div className="bg-[#111] border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-400">{campaign.stats.failed}</div>
                <div className="text-sm text-gray-400">Failed</div>
              </div>
            </div>
          )}

          <div className="bg-[#111] border border-white/10 rounded-xl p-6">
            <h2 className="mb-4 text-xl font-bold text-white">HTML Preview</h2>
            <div
              className="p-4 overflow-auto rounded-lg bg-white/5 max-h-96"
              dangerouslySetInnerHTML={{ __html: campaign.htmlContent }}
            />
          </div>
        </div>
      </div>
    </ComponentsLayout>
  );
}

