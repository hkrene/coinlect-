'use client';

import React from 'react';
import { LogOut, User, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from './Avatar';
import { useAuth } from '../contexts/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm p-6 bg-black border shadow-lg border-white/10 rounded-xl">
        <button
          onClick={onClose}
          className="absolute text-gray-400 top-4 right-4 hover:text-white"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center justify-center p-4 border-b border-white/10">
          <Avatar
            src={user.avatar}
            name={user.name}
            email={user.email}
            size="lg"
          />
          <p className="mt-3 text-lg font-semibold text-white">{user.name || 'User'}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
          {isAdmin && (
            <span className="inline-block px-2 py-0.5 text-xs font-bold text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20 mt-2">
              Admin
            </span>
          )}
        </div>

        <div className="py-2">
          <button className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white">
            <User size={16} />
            Profile
          </button>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              onClick={onClose}
            >
              <Settings size={16} />
              Admin Panel
            </Link>
          )}
        </div>

        <div className="border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
