'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar } from '@/components/Avatar';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ComponentsLayout } from '../components-layout';
import { AuthGuard } from '@/components/AuthGuard';
import { User, Mail, Calendar, Shield, LogOut, Camera, Lock, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
  });

  const [passwordData, setPasswordPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await refreshUser();
        setMessage({ type: 'success', text: t.profile.successUpdate });
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || t.profile.errorUpdate });
      }
    } catch (err) {
      setMessage({ type: 'error', text: t.profile.errorUpdate });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: t.profile.errorPassword });
      return;
    }

    setIsUpdatingPassword(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: t.profile.successPassword });
        setPasswordPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || t.profile.errorPassword });
      }
    } catch (err) {
      setMessage({ type: 'error', text: t.profile.errorPassword });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'coinlect-uploads');

      const res = await fetch('https://api.cloudinary.com/v1_1/drsd8adkq/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const avatarUrl = data.secure_url;

        const updateRes = await fetch('/api/auth/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: avatarUrl }),
        });

        if (updateRes.ok) {
          await refreshUser();
          setMessage({ type: 'success', text: t.profile.successUpdate });
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: t.profile.errorUpdate });
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(t.common.loading === 'Chargement...' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <AuthGuard>
      <ComponentsLayout>
        <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto sm:px-6 md:pt-32 md:pb-20">
          <ScrollReveal className="w-full max-w-2xl">
            <div className="relative p-6 overflow-hidden border glass-card sm:p-8 rounded-2xl border-white/10">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-coinlect-accent/10 rounded-full blur-[50px] pointer-events-none"></div>

              {/* Header Section */}
              <div className="mb-8 text-center">
                <div className="relative flex justify-center mb-4 group">
                  <div className="relative">
                    <Avatar
                      src={user.avatar}
                      name={user.name}
                      email={user.email}
                      size="xl"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 p-2 text-black transition-colors rounded-full bg-coinlect-accent hover:bg-coinlect-accent/80 disabled:opacity-50"
                    >
                      {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      aria-label={t.profile.uploadPhoto}
                    />
                  </div>
                </div>
                <h1 className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl">
                  {user.name || 'Utilisateur'}
                </h1>
                <p className="text-gray-400">{user.email}</p>
              </div>

              {message && (
                <div className={`p-4 mb-6 rounded-lg text-sm text-center ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Profile Information Form */}
              <div className="mb-10">
                <h2 className="flex items-center gap-2 mb-6 text-xl font-bold">
                  <User size={20} className="text-coinlect-accent" />
                  {t.profile.personalInfo}
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label htmlFor="profile-name" className="block mb-2 text-sm font-medium text-gray-400">{t.profile.name}</label>
                    <input
                      id="profile-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      aria-label={t.profile.name}
                      className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-date-of-birth" className="block mb-2 text-sm font-medium text-gray-400">{t.profile.dateOfBirth}</label>
                    <input
                      id="profile-date-of-birth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      aria-label={t.profile.dateOfBirth}
                      className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-black/30 border-white/10">
                    <Calendar className="text-coinlect-accent" size={18} />
                    <div>
                      <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t.profile.dateJoined}</h3>
                      <p className="text-sm text-white">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                  <Button type="submit" disabled={isUpdating} className="w-full">
                    {isUpdating ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                    {t.profile.saveChanges}
                  </Button>
                </form>
              </div>

              {/* Password Change Form */}
              <div className="mb-10">
                <h2 className="flex items-center gap-2 mb-6 text-xl font-bold">
                  <Lock size={20} className="text-coinlect-accent" />
                  {t.profile.changePassword}
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label
                      htmlFor="current-password"
                      className="block mb-2 text-sm font-medium text-gray-400"
                    >
                      {t.profile.currentPassword}
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block mb-2 text-sm font-medium text-gray-400"
                    >
                      {t.profile.newPassword}
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block mb-2 text-sm font-medium text-gray-400"
                    >
                      {t.profile.confirmPassword}
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 text-white transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
                    />
                  </div>
                  <Button type="submit" disabled={isChangingPassword} className="w-full">
                    {isChangingPassword ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Lock size={18} className="mr-2" />}
                    {t.profile.changePassword}
                  </Button>
                </form>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-8 sm:flex-row">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/academy')}
                >
                  {t.profile.viewAcademy}
                </Button>
                {user.role === 'ADMIN' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/admin')}
                  >
                    {t.profile.adminPanel}
                  </Button>
                )}
                <Button
                  className="flex-1 text-white bg-red-600 hover:bg-red-700"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  {t.profile.logout}
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </ComponentsLayout>
    </AuthGuard>
  );
}
