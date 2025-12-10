'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ComponentsLayout } from '../../components-layout';
import { 
  Mail, 
  Users, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/Button';
import Link from 'next/link';

interface Subscriber {
  id: string;
  email: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  source: string;
  subscribedAt: string;
  user?: { name: string; email: string } | null;
}

interface Campaign {
  id: string;
  title: string;
  subject: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    failed: number;
  };
}

export default function NewsletterDashboardPage() {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns'>('campaigns');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalCampaigns: 0,
    sentCampaigns: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!isAdmin) {
      router.push('/');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin, router]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const [subsRes, campaignsRes] = await Promise.all([
        fetch('/api/newsletter/subscribers', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/newsletter/campaigns', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setSubscribers(subsData.subscribers || []);
        setStats(prev => ({
          ...prev,
          totalSubscribers: subsData.pagination?.total || 0,
          activeSubscribers: subsData.subscribers?.filter((s: Subscriber) => s.status === 'ACTIVE').length || 0,
        }));
      }

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.campaigns || []);
        setStats(prev => ({
          ...prev,
          totalCampaigns: campaignsData.pagination?.total || 0,
          sentCampaigns: campaignsData.campaigns?.filter((c: Campaign) => c.status === 'SENT').length || 0,
        }));
      }
    } catch (err) {
      console.error('Failed to load newsletter data', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <ComponentsLayout>
      <div className="min-h-screen pt-24 pb-20 bg-[#0a0a0a]">
        <div className="container px-6 mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-white">Newsletter Dashboard</h1>
            <p className="text-gray-400">Manage subscribers and campaigns</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-blue-400" size={24} />
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalSubscribers}</div>
              <div className="mt-1 text-sm text-gray-400">Subscribers</div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="text-green-400" size={24} />
                <span className="text-xs text-gray-500">Active</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.activeSubscribers}</div>
              <div className="mt-1 text-sm text-gray-400">Active Subscribers</div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Mail className="text-purple-400" size={24} />
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalCampaigns}</div>
              <div className="mt-1 text-sm text-gray-400">Campaigns</div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Send className="text-coinlect-accent" size={24} />
                <span className="text-xs text-gray-500">Sent</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.sentCampaigns}</div>
              <div className="mt-1 text-sm text-gray-400">Sent Campaigns</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-white/10">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'campaigns'
                  ? 'text-coinlect-accent border-b-2 border-coinlect-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'subscribers'
                  ? 'text-coinlect-accent border-b-2 border-coinlect-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Subscribers
            </button>
          </div>

          {/* Content */}
          {activeTab === 'campaigns' && (
            <CampaignsTab campaigns={campaigns} loading={loading} onRefresh={loadData} />
          )}

          {activeTab === 'subscribers' && (
            <SubscribersTab subscribers={subscribers} loading={loading} />
          )}
        </div>
      </div>
    </ComponentsLayout>
  );
}

function CampaignsTab({ 
  campaigns, 
  loading, 
  onRefresh 
}: { 
  campaigns: Campaign[]; 
  loading: boolean; 
  onRefresh: () => void;
}) {
  const router = useRouter();

  const handleSend = async (campaignId: string) => {
    if (!confirm('Send this campaign to all active subscribers?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/newsletter/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        alert('Campaign sent successfully!');
        onRefresh();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to send campaign');
      }
    } catch (err) {
      alert('Failed to send campaign');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-white">Loading campaigns...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Campaigns</h2>
        <Link href="/admin/newsletter/campaigns/new">
          <Button>
            <Plus size={16} /> Create Campaign
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12 bg-[#111] rounded-xl border border-white/10">
          <Mail className="mx-auto mb-4 text-gray-500" size={48} />
          <p className="mb-4 text-gray-400">No campaigns yet</p>
          <Link href="/admin/newsletter/campaigns/new">
            <Button>Create Your First Campaign</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-[#111] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <p className="mb-4 text-gray-400">{campaign.subject}</p>

                  {campaign.stats && (
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">Sent:</span>{' '}
                        <span className="font-medium text-white">{campaign.stats.sent}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Delivered:</span>{' '}
                        <span className="font-medium text-green-400">{campaign.stats.delivered}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Opened:</span>{' '}
                        <span className="font-medium text-blue-400">{campaign.stats.opened}</span>
                      </div>
                      {campaign.stats.failed > 0 && (
                        <div>
                          <span className="text-gray-500">Failed:</span>{' '}
                          <span className="font-medium text-red-400">{campaign.stats.failed}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    {campaign.scheduledAt && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        Scheduled: {new Date(campaign.scheduledAt).toLocaleString()}
                      </div>
                    )}
                    {campaign.sentAt && (
                      <div className="flex items-center gap-1">
                        <Send size={14} />
                        Sent: {new Date(campaign.sentAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Link href={`/admin/newsletter/campaigns/${campaign.id}`}>
                    <button className="p-2 transition-colors rounded-lg bg-white/5 hover:bg-white/10">
                      <Eye size={18} className="text-gray-400" />
                    </button>
                  </Link>
                  {campaign.status === 'DRAFT' && (
                    <>
                      <Link href={`/admin/newsletter/campaigns/${campaign.id}/edit`}>
                        <button className="p-2 transition-colors rounded-lg bg-white/5 hover:bg-white/10">
                          <Edit size={18} className="text-gray-400" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleSend(campaign.id)}
                        className="p-2 transition-colors rounded-lg bg-green-500/10 hover:bg-green-500/20"
                      >
                        <Send size={18} className="text-green-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubscribersTab({ subscribers, loading }: { subscribers: Subscriber[]; loading: boolean }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');

  const filtered = subscribers.filter((s) => {
    if (filter === 'active') return s.status === 'ACTIVE';
    if (filter === 'unsubscribed') return s.status === 'UNSUBSCRIBED';
    return true;
  });

  if (loading) {
    return <div className="text-white">Loading subscribers...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Subscribers</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-coinlect-accent text-black'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('unsubscribed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unsubscribed'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Unsubscribed
          </button>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b bg-white/5 border-white/10">
            <tr>
              <th className="p-4 text-sm font-semibold text-left text-gray-400">Email</th>
              <th className="p-4 text-sm font-semibold text-left text-gray-400">Status</th>
              <th className="p-4 text-sm font-semibold text-left text-gray-400">Source</th>
              <th className="p-4 text-sm font-semibold text-left text-gray-400">Subscribed</th>
              <th className="p-4 text-sm font-semibold text-left text-gray-400">User Account</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((subscriber) => (
              <tr key={subscriber.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4 text-white">{subscriber.email}</td>
                <td className="p-4">
                  <StatusBadge status={subscriber.status} />
                </td>
                <td className="p-4 text-sm text-gray-400">{subscriber.source}</td>
                <td className="p-4 text-sm text-gray-400">
                  {new Date(subscriber.subscribedAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {subscriber.user ? subscriber.user.name : 'Email-only'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            No subscribers found
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    DRAFT: 'bg-gray-500/20 text-gray-400',
    SCHEDULED: 'bg-blue-500/20 text-blue-400',
    SENT: 'bg-green-500/20 text-green-400',
    ACTIVE: 'bg-green-500/20 text-green-400',
    UNSUBSCRIBED: 'bg-red-500/20 text-red-400',
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        styles[status as keyof typeof styles] || styles.DRAFT
      }`}
    >
      {status}
    </span>
  );
}

