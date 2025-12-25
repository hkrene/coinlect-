'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'EDITOR' | 'USER';
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
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
        // API failed, fall back to localStorage
        console.log('API login failed, trying localStorage fallback');
      }

      // Fallback to localStorage-based authentication
      if (typeof window !== 'undefined') {
        const { userService } = await import('../services/db');
        const users = userService.getAll();
        const user = users.find(u => u.email === email);
        
        // Check for admin user with password "admin123"
        if (user && email === 'admin@coinlect.com' && password === 'admin123') {
          const authUser: User = {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            role: user.role === 'admin' ? 'ADMIN' : 'USER',
            firstName: user.firstName,
            lastName: user.lastName
          };
          setUser(authUser);
          localStorage.setItem('coinlect_current_user', JSON.stringify(authUser));
          // Create a simple token for localStorage
          localStorage.setItem('accessToken', 'local_' + Date.now());
          return;
        }
        
        // For other users, check if password matches (simple check for demo)
        if (user) {
          // In a real app, you'd hash and verify the password
          // For now, accept any password for existing users
          const authUser: User = {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            role: user.role === 'admin' ? 'ADMIN' : 'USER',
            firstName: user.firstName,
            lastName: user.lastName
          };
          setUser(authUser);
          localStorage.setItem('coinlect_current_user', JSON.stringify(authUser));
          localStorage.setItem('accessToken', 'local_' + Date.now());
          return;
        }
      }

      setError('Invalid email or password');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error', err);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setError(null);
    try {
      // Try API first
      try {
        const name = `${firstName} ${lastName}`.trim();
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
        }
      } catch (apiErr) {
        // API failed, fall back to localStorage
        console.log('API register failed, trying localStorage fallback');
      }

      // Fallback to localStorage-based registration
      if (typeof window !== 'undefined') {
        const { userService } = await import('../services/db');
        try {
          const newUser = userService.create({
            email,
            firstName,
            lastName,
            role: 'user'
          });
          
          const authUser: User = {
            id: newUser.id,
            email: newUser.email,
            name: `${newUser.firstName} ${newUser.lastName}`.trim(),
            role: 'USER',
            firstName: newUser.firstName,
            lastName: newUser.lastName
          };
          
          setUser(authUser);
          localStorage.setItem('coinlect_current_user', JSON.stringify(authUser));
          localStorage.setItem('accessToken', 'local_' + Date.now());
        } catch (createErr: any) {
          setError(createErr.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Register error', err);
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
      isAdmin: user?.role === 'ADMIN' || user?.role === 'EDITOR', 
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
