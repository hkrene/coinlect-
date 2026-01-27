'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar } from '@/components/Avatar';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ComponentsLayout } from '../../components-layout';
import { AuthGuard } from '@/components/AuthGuard';
import { User, Calendar, Lock, Camera, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // Validate password fields if any are filled
      const isChangingPassword = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword;
      if (isChangingPassword) {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
          setMessage({ type: 'error', text: t.profile.errorPassword });
          setIsSaving(false);
          return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setMessage({ type: 'error', text: t.profile.errorPassword });
          setIsSaving(false);
          return;
        }
      }

      // Update profile information
      const profileRes = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!profileRes.ok) {
        const error = await profileRes.json();
        setMessage({ type: 'error', text: error.error || t.profile.errorUpdate });
        setIsSaving(false);
        return;
      }

      // Change password if provided
      if (isChangingPassword) {
        const passwordRes = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        });

        if (!passwordRes.ok) {
          const error = await passwordRes.json();
          setMessage({ type: 'error', text: error.error || t.profile.errorPassword });
          setIsSaving(false);
          return;
        }
        setPasswordPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }

      await refreshUser();
      setMessage({ type: 'success', text: t.profile.successUpdate });
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: t.profile.errorUpdate });
    } finally {
      setIsSaving(false);
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

  return (
    <AuthGuard>
      <ComponentsLayout>
        <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto sm:px-6 md:pt-32 md:pb-20">
          <ScrollReveal className="w-full max-w-2xl">
            <div className="relative p-6 overflow-hidden border glass-card sm:p-8 rounded-2xl border-white/10">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-coinlect-accent/10 rounded-full blur-[50px] pointer-events-none"></div>

              {/* Back Button */}
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 mb-6 text-sm text-gray-400 transition-colors hover:text-white"
              >
                <ArrowLeft size={16} />
                {t.profile.title}
              </Link>

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
                  {t.profile.editProfile}
                </h1>
              </div>

              {message && (
                <div className={`p-4 mb-6 rounded-lg text-sm text-center ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Combined Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Information Section */}
                <div>
                  <h2 className="flex items-center gap-2 mb-6 text-xl font-bold">
                    <User size={20} className="text-coinlect-accent" />
                    {t.profile.personalInfo}
                  </h2>
                  <div className="space-y-4">
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
                  </div>
                </div>

                {/* Password Change Section */}
                <div>
                  <h2 className="flex items-center gap-2 mb-6 text-xl font-bold">
                    <Lock size={20} className="text-coinlect-accent" />
                    {t.profile.changePassword}
                  </h2>
                  <p className="mb-4 text-sm text-gray-400">
                    {t.common.loading === 'Chargement...' 
                      ? 'Laissez vide si vous ne souhaitez pas changer votre mot de passe'
                      : 'Leave empty if you don&apos;t want to change your password'}
                  </p>
                  <div className="space-y-4">
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
                  </div>
                </div>

                {/* Single Submit Button */}
                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                  {t.profile.saveChanges}
                </Button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </ComponentsLayout>
    </AuthGuard>
  );
}
