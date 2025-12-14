'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import { NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const navItems: NavItem[] = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.academy, href: '/academy' },
    { label: t.nav.deals, href: '/deals' },
    { label: t.nav.trends, href: '/trends' },
    { label: t.nav.community, href: '/community' },
    { label: t.nav.events, href: '/events' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const isAcademy = pathname?.startsWith('/academy') ?? false;
  const logoSrc = isAcademy 
    ? "https://res.cloudinary.com/drsd8adkq/image/upload/v1765187893/coinLect-academ_our9m2.jpg"
    : "https://res.cloudinary.com/drsd8adkq/image/upload/v1765187097/coinlect-0_denz8g.jpg";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container flex items-center justify-between px-6 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src={logoSrc}
            alt="Coinlect" 
            className="object-contain w-auto h-8 transition-transform duration-300 rounded-full md:h-10 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="items-center hidden gap-8 lg:flex">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`text-sm transition-colors relative group py-1 ${isActive(item.href) ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-coinlect-accent transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="items-center hidden gap-4 lg:flex">
          {/* Language Toggle */}
          <div className="relative flex items-center">
            <button 
              onClick={() => setLanguage('fr')}
              className={`relative z-10 w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                language === 'fr' 
                  ? 'border-coinlect-accent bg-black text-gray-200 shadow-[0_0_0_2px_rgba(245,158,11,0.3)]' 
                  : 'border-white/10 bg-black text-gray-500'
              }`}
            >
              <span className="text-xs font-semibold">FR</span>
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`relative -ml-3 z-0 w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                language === 'en' 
                  ? 'border-coinlect-accent bg-black text-gray-200 shadow-[0_0_0_2px_rgba(245,158,11,0.3)]' 
                  : 'border-white/10 bg-black text-gray-500'
              }`}
            >
              <span className="text-xs font-semibold">EN</span>
            </button>
          </div>

          {isAuthenticated ? (
             <div className="flex items-center gap-3">
                 {isAdmin && (
                    <Link href="/admin">
                        <button className="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                            <LayoutDashboard size={14} /> Admin
                        </button>
                    </Link>
                 )}
                 <div className="flex items-center gap-2 py-1 pl-3 pr-1 border rounded-full border-white/10 bg-white/5">
                    <span className="text-xs font-semibold text-white">{user?.name || user?.email}</span>
                    <button 
                        onClick={logout} 
                        className="p-1.5 bg-red-500/10 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                        aria-label="Logout"
                    >
                        <LogOut size={12} />
                    </button>
                 </div>
             </div>
          ) : (
              <>
                <Link href="/register">
                    <Button variant="outline" className="px-4 py-2 text-xs text-white border-white/20">{t.nav.getStarted}</Button>
                </Link>
                <Link href="/donate">
                    <Button className="px-4 py-2 text-xs">{t.nav.donate}</Button>
                </Link>
              </>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 lg:hidden">
            {/* Language Toggle */}
            <div className="relative flex items-center">
              <button 
                onClick={() => setLanguage('fr')}
                className={`relative z-10 w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                  language === 'fr' 
                    ? 'border-coinlect-accent bg-black text-gray-200 shadow-[0_0_0_2px_rgba(245,158,11,0.3)]' 
                    : 'border-white/10 bg-black text-gray-500'
                }`}
              >
                <span className="text-[10px] font-semibold">FR</span>
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`relative -ml-3 z-0 w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                  language === 'en' 
                    ? 'border-coinlect-accent bg-black text-gray-200 shadow-[0_0_0_2px_rgba(245,158,11,0.3)]' 
                    : 'border-white/10 bg-black text-gray-500'
                }`}
              >
                <span className="text-[10px] font-semibold">EN</span>
              </button>
            </div>
            {!isAuthenticated && (
                <Link href="/donate">
                    <Button className="px-3 py-1.5 text-xs h-8 shadow-none">{t.nav.donate}</Button>
                </Link>
            )}
            <button 
              className="p-1 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 flex flex-col gap-4 p-6 bg-black border-b shadow-2xl border-white/10 lg:hidden top-full animate-in slide-in-from-top-5">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`py-2 block font-medium ${isActive(item.href) ? 'text-coinlect-accent' : 'text-gray-300'}`} 
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
             <Link href="/admin" className="block py-2 font-bold text-purple-400" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
          )}

          <div className="flex flex-col gap-2 mt-2">
            {isAuthenticated ? (
                <Button onClick={logout} variant="secondary" className="justify-center w-full text-red-400 border-red-500/20">Logout ({user?.name || user?.email})</Button>
            ) : (
                <>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="justify-center w-full text-white border-white/20">{t.nav.getStarted}</Button>
                    </Link>
                    <Link href="/donate" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="justify-center w-full">{t.nav.donate}</Button>
                    </Link>
                </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
