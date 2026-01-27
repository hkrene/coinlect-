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
            <div className="relative p-6 overflow-hidden border glass-card sm:p-8 rounded-2xl border-white/10">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-coinlect-accent/10 rounded-full blur-[50px] pointer-events-none"></div>

              {/* Header Section */}
              <div className="mb-8 text-center">
                <div className="relative flex justify-center mb-4 group">
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
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-black/30 border-white/10">
                    <User className="text-coinlect-accent" size={18} />
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t.profile.name}</h3>
                      <p className="text-sm text-white">{user.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-black/30 border-white/10">
                    <Mail className="text-coinlect-accent" size={18} />
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t.profile.email}</h3>
                      <p className="text-sm text-white">{user.email}</p>
                    </div>
                  </div>
                  {user.dateOfBirth && (
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-black/30 border-white/10">
                      <Calendar className="text-coinlect-accent" size={18} />
                      <div className="flex-1">
                        <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t.profile.dateOfBirth}</h3>
                        <p className="text-sm text-white">{formatDateOfBirth(user.dateOfBirth)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-black/30 border-white/10">
                    <Calendar className="text-coinlect-accent" size={18} />
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{t.profile.dateJoined}</h3>
                      <p className="text-sm text-white">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-8 sm:flex-row">
                <Link href="/profile/edit" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Edit size={16} className="mr-2" />
                    {t.profile.editProfile}
                  </Button>
                </Link>
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
