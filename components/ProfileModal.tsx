'use client';

import React from 'react';
import { X, LogOut, User, Settings } from 'lucide-react';
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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md transition-all duration-200 transform scale-100 border shadow-2xl opacity-100 pointer-events-auto bg-black/95 backdrop-blur-xl border-white/10 rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute p-2 text-gray-400 transition-colors rounded-full top-4 right-4 hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <Avatar
                src={user.avatar}
                name={user.name}
                email={user.email}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {user.email}
                </p>
                {isAdmin && (
                  <span className="inline-block px-2 py-0.5 text-xs font-bold text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20 mt-2">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button className="flex items-center w-full gap-3 px-6 py-3 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white">
              <User size={18} />
              Profile
            </button>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center w-full gap-3 px-6 py-3 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                onClick={onClose}
              >
                <Settings size={18} />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-6 py-3 text-sm text-red-400 transition-colors rounded-lg hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
