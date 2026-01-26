'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/Avatar';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ComponentsLayout } from '../components-layout';
import { AuthGuard } from '@/components/AuthGuard';
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Format date joined (assuming createdAt is available from user object)
  // Since user object might not have createdAt, we'll show a placeholder or fetch it
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
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
                {user.role === 'ADMIN' && (
                  <span className="inline-block px-3 py-1 mt-2 text-xs font-bold text-purple-400 border rounded-full bg-purple-500/10 border-purple-500/20">
                    <Shield size={12} className="inline mr-1" />
                    Administrateur
                  </span>
                )}
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-black/30 border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="text-coinlect-accent" size={18} />
                    <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Email</h3>
                  </div>
                  <p className="text-white">{user.email}</p>
                </div>

                <div className="p-4 border rounded-lg bg-black/30 border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="text-coinlect-accent" size={18} />
                    <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Nom</h3>
                  </div>
                  <p className="text-white">{user.name || 'Non défini'}</p>
                </div>

                <div className="p-4 border rounded-lg bg-black/30 border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="text-coinlect-accent" size={18} />
                    <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Rôle</h3>
                  </div>
                  <p className="text-white">{user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}</p>
                </div>

                {user.createdAt && (
                  <div className="p-4 border rounded-lg bg-black/30 border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="text-coinlect-accent" size={18} />
                      <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Date d'inscription</h3>
                    </div>
                    <p className="text-white">{formatDate(user.createdAt)}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-8 sm:flex-row">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/academy')}
                >
                  Voir l'Académie
                </Button>
                {user.role === 'ADMIN' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/admin')}
                  >
                    Panel Admin
                  </Button>
                )}
                <Button
                  className="flex-1 text-white bg-red-600 hover:bg-red-700"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Se déconnecter
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </ComponentsLayout>
    </AuthGuard>
  );
}
