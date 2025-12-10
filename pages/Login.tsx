
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ScrollReveal } from '../components/ScrollReveal';
import { AdBanner } from '../components/AdBanner';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
    // If successful, redirect is handled by AuthContext or check here
    if (!error) {
        navigate('/academy');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center container mx-auto px-6">
      <ScrollReveal className="w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden">
            {/* Ambient light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-coinlect-accent/10 rounded-full blur-[50px] pointer-events-none"></div>

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-500 text-sm">Enter your credentials to access your account</p>
                <div className="mt-2 text-[10px] text-gray-600 bg-white/5 p-2 rounded">
                   Demo Admin: admin@coinlect.com / admin123
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded mb-4 text-center">
                    {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Email Address</label>
                    <input 
                        type="email" 
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-coinlect-accent transition-colors" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Password</label>
                    <input 
                        type="password" 
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-coinlect-accent transition-colors" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                        <input type="checkbox" className="rounded border-gray-600 bg-transparent" />
                        Remember me
                    </label>
                    <a href="#" className="text-coinlect-accent hover:underline">Forgot password?</a>
                </div>

                <Button className="w-full justify-center py-3" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500">
                Don't have an account? <Link to="/register" className="text-white hover:text-coinlect-accent font-semibold transition-colors">Sign up</Link>
            </div>
        </div>
        <AdBanner variant="compact" />
      </ScrollReveal>
    </div>
  );
};
