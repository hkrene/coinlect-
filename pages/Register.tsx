
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ScrollReveal } from '../components/ScrollReveal';
import { AdBanner } from '../components/AdBanner';
import { useAuth } from '../contexts/AuthContext';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await register(formData.firstName, formData.lastName, formData.email, formData.password);
    setIsLoading(false);
    navigate('/academy');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center container mx-auto px-6">
      <ScrollReveal className="w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Create Account</h1>
                <p className="text-gray-500 text-sm">Join Coinlect and start your crypto journey</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded mb-4 text-center">
                    {error}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">First Name</label>
                        <input id="firstName" type="text" required onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-coinlect-accent transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Last Name</label>
                        <input id="lastName" type="text" required onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-coinlect-accent transition-colors" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Email Address</label>
                    <input id="email" type="email" required onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-coinlect-accent transition-colors" placeholder="you@example.com" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Password</label>
                    <input id="password" type="password" required onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-coinlect-accent transition-colors" placeholder="••••••••" />
                </div>
                
                <div className="text-xs text-gray-500 my-4">
                    By clicking Sign Up, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
                </div>

                <Button className="w-full justify-center py-3" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500">
                Already have an account? <Link to="/login" className="text-white hover:text-coinlect-accent font-semibold transition-colors">Sign in</Link>
            </div>
        </div>
        <AdBanner variant="compact" />
      </ScrollReveal>
    </div>
  );
};
