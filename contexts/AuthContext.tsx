'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'USER';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let token = getAccessToken();
  
  if (!token) {
    token = await refreshAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // If token expired, try refreshing
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
  }

  return response;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      // Check localStorage first
      const storedUser = localStorage.getItem('coinlect_current_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUser(user);
          setIsLoading(false);
          return;
        } catch (e) {
          // Invalid stored user, continue to API check
        }
      }

      const token = getAccessToken();
      if (!token || token.startsWith('local_')) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('coinlect_current_user', JSON.stringify(data.user));
        } else {
          // Try refreshing token
          const newToken = await refreshAccessToken();
          if (newToken) {
            const retryRes = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${newToken}`,
              },
            });
            if (retryRes.ok) {
              const retryData = await retryRes.json();
              setUser(retryData.user);
              localStorage.setItem('coinlect_current_user', JSON.stringify(retryData.user));
            }
          }
        }
      } catch (apiErr) {
        // API failed, user will need to login again
        console.log('API refresh failed');
      }
    } catch (err) {
      console.error('Failed to refresh user', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      // Try API first
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok && data.user) {
          // Store tokens and user
          if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
          }
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          setUser(data.user);
          localStorage.setItem('coinlect_current_user', JSON.stringify(data.user));
          return;
        }
      } catch (apiErr) {
        console.log('API login failed:', apiErr);
        throw new Error('Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(errorMessage);
      console.error('Login error', err);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setError(null);
    try {
      // Try API first
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await res.json();

        if (res.ok && data.user) {
          // Store tokens and user
          if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
          }
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          setUser(data.user);
          localStorage.setItem('coinlect_current_user', JSON.stringify(data.user));
          return;
        } else {
          throw new Error(data.error || 'Registration failed. Please try again.');
        }
      } catch (apiErr) {
        console.log('API register failed:', apiErr);
        throw new Error('Registration failed. Please try again.');
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
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('coinlect_current_user');
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

// Export fetchWithAuth for use in other components
export { fetchWithAuth };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
