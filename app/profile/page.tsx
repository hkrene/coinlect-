'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar } from '@/components/Avatar';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ComponentsLayout } from '../components-layout';
import { AuthGuard } from '@/components/AuthGuard';
import { User, Mail, Calendar, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
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

  const formatDateOfBirth = (dateString: string | undefined | null) => {
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
            <div className="p-6 sm:p-8">
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
                  {user.name || 'Utilisateur'}
                </h1>
                <p className="text-gray-400">{user.email}</p>
              </div>

              {/* Profile Information Display */}
              <div className="mb-10">
                <h2 className="flex items-center gap-2 mb-6 text-xl font-bold">
                  <User size={20} className="text-coinlect-accent" />
                  {t.profile.personalInfo}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-white/10">
                    <User className="text-coinlect-accent" size={18} />
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t.profile.name}</h3>
                      <p className="text-sm text-white">{user.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-white/10">
                    <Mail className="text-coinlect-accent" size={18} />
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t.profile.email}</h3>
                      <p className="text-sm text-white">{user.email}</p>
                    </div>
                  </div>
                  {user.dateOfBirth && (
                    <div className="flex items-start gap-3 pb-4 border-b border-white/10">
                      <Calendar className="text-coinlect-accent" size={18} />
                      <div className="flex-1">
                        <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t.profile.dateOfBirth}</h3>
                        <p className="text-sm text-white">{formatDateOfBirth(user.dateOfBirth)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 pt-4">
                    <Calendar className="text-coinlect-accent" size={18} />
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t.profile.dateJoined}</h3>
                      <p className="text-sm text-white">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid gap-3 mt-6 sm:grid-cols-2">
                <Link href="/profile/edit" className="w-full">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full py-3 text-sm font-semibold shadow-none rounded-xl hover:bg-yellow-400"
                  >
                    <Edit size={14} className="mr-2" />
                    {t.profile.editProfile}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full py-3 text-white border rounded-xl border-white/10 hover:bg-white/10"
                  onClick={() => router.push('/academy')}
                >
                  {t.profile.viewAcademy}
                </Button>
                {user.role === 'ADMIN' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full py-3 text-white border rounded-xl border-white/10 hover:bg-white/10"
                    onClick={() => router.push('/admin')}
                  >
                    {t.profile.adminPanel}
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full py-3 text-white bg-red-600 shadow-none rounded-xl hover:bg-red-700"
                  onClick={handleLogout}
                >
                  <LogOut size={14} className="mr-2" />
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
