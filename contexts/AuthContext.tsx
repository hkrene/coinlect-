'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
  dateOfBirth?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string, captchaToken?: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    botSignals?: { website?: string; elapsedMs?: number; captchaToken?: string }
  ) => Promise<void>;
  logout: () => void;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include' // Include cookies in the request
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to refresh user', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, captchaToken?: string) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        throw new Error(data.error || 'Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(errorMessage);
      console.error('Login error', err);
      throw err;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    botSignals?: { website?: string; elapsedMs?: number; captchaToken?: string }
  ) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, ...botSignals }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(errorMessage);
      console.error('Register error', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setUser(null);
      // Redirect to home page after logout
      if (typeof window !== 'undefined') {
        window.location.href = "/";
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      isLoading,
      login,
      register,
      logout,
      error,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
