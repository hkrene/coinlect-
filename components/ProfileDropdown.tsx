'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { Avatar } from './Avatar';
import { useAuth } from '../contexts/AuthContext';

interface ProfileDropdownProps {
  className?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1 pl-2 pr-3 transition-colors border rounded-full border-white/10 bg-white/5 hover:bg-white/10 group"
      >
        <Avatar
          src={user.avatar}
          name={user.name}
          email={user.email}
          size="sm"
        />
        <span className="hidden text-xs font-semibold text-white md:block">
          {user.name || user.email}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-56 mt-2 border shadow-2xl bg-black/95 backdrop-blur-xl border-white/10 rounded-xl">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.avatar}
                name={user.name}
                email={user.email}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.email}
                </p>
                {isAdmin && (
                  <span className="inline-block px-2 py-0.5 text-xs font-bold text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20 mt-1">
                    Admin
                  </span>
                )}
              </div>
            </div>
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
                onClick={() => setIsOpen(false)}
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
      )}
    </div>
  );
};