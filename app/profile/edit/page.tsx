'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar } from '@/components/Avatar';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ComponentsLayout } from '../../components-layout';
import { AuthGuard } from '@/components/AuthGuard';
import { User, Lock, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
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
      // Validate profile fields
      const name = formData.name.trim();
      if (!name || name.length > 100) {
        setMessage({ type: 'error', text: t.profile.errorName });
        setIsSaving(false);
        return;
      }
      if (formData.dateOfBirth) {
        const dob = new Date(formData.dateOfBirth);
        if (Number.isNaN(dob.getTime()) || dob.getTime() > Date.now()) {
          setMessage({ type: 'error', text: t.profile.errorDateOfBirth });
          setIsSaving(false);
          return;
        }
      }

      // Validate password fields if any are filled
      const isChangingPassword = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword;
      if (isChangingPassword) {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
          setMessage({ type: 'error', text: t.profile.errorPassword });
          setIsSaving(false);
          return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setMessage({ type: 'error', text: t.profile.errorPasswordMatch });
          setIsSaving(false);
          return;
        }
        const weak =
          passwordData.newPassword.length < 8 ||
          passwordData.newPassword.length > 128 ||
          !/[A-Za-z]/.test(passwordData.newPassword) ||
          !/[0-9]/.test(passwordData.newPassword);
        if (weak) {
          setMessage({ type: 'error', text: t.profile.errorPasswordWeak });
          setIsSaving(false);
          return;
        }
        if (passwordData.newPassword === passwordData.currentPassword) {
          setMessage({ type: 'error', text: t.profile.errorPasswordSame });
          setIsSaving(false);
          return;
        }
      }

      // Update profile information
      const profileRes = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dateOfBirth: formData.dateOfBirth || undefined }),
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
                <div className="flex justify-center mb-4">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    email={user.email}
                    size="xl"
                  />
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
                        required
                        maxLength={100}
                        autoComplete="name"
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
                        max={new Date().toISOString().split('T')[0]}
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
                        autoComplete="current-password"
                        maxLength={128}
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
                        autoComplete="new-password"
                        minLength={8}
                        maxLength={128}
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
                        autoComplete="new-password"
                        minLength={8}
                        maxLength={128}
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
