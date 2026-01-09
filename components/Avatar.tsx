'use client';

import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  email,
  size = 'md',
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const getInitials = () => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const baseClasses = `rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br from-coinlect-accent to-purple-600 border-2 border-white/20 shadow-lg ${sizeClasses[size]} ${className}`;

  if (src) {
    return (
      <img
        src={src}
        alt={name || email || 'User avatar'}
        className={`${baseClasses} object-cover ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
        onClick={onClick}
        onError={(e) => {
          // Fallback to initials if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = getInitials();
          }
        }}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      onClick={onClick}
      title={name || email}
    >
      {getInitials()}
    </div>
  );
};