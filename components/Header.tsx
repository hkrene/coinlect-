'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import { NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems: NavItem[] = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.academy, href: '/academy' },
    { label: t.nav.deals, href: '/deals' },
    { label: t.nav.trends, href: '/trends' },
    { label: t.nav.community, href: '/community' },
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
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
              className={`text-sm transition-colors relative group py-1 ${isActive(item.href) ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-coinlect-accent transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="items-center hidden gap-4 lg:flex">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 transition-colors border border-gray-200 rounded-full dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-400"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="p-2 px-3 transition-colors border border-gray-200 rounded-full dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
          >
             <span className="flex items-center gap-1 text-xs font-bold">
               <span className={language === 'fr' ? 'text-slate-900 dark:text-white' : 'text-gray-400'}>FR</span> 
               <span className="text-gray-300">|</span> 
               <span className={language === 'en' ? 'text-slate-900 dark:text-white' : 'text-gray-400'}>EN</span>
             </span>
          </button>

          {isAuthenticated ? (
             <div className="flex items-center gap-3">
                 {isAdmin && (
                    <Link href="/admin">
                        <button className="flex items-center gap-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                            <LayoutDashboard size={14} /> Admin
                        </button>
                    </Link>
                 )}
                 <div className="flex items-center gap-2 py-1 pl-3 pr-1 border border-gray-200 rounded-full bg-slate-100 dark:bg-white/5 dark:border-white/10">
                    <span className="text-xs font-semibold text-slate-800 dark:text-white">{user?.name || user?.email}</span>
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
                    <Button variant="outline" className="px-4 py-2 text-xs border-gray-300 dark:border-white/20 text-slate-700 dark:text-white">{t.nav.getStarted}</Button>
                </Link>
                <Link href="/donate">
                    <Button className="px-4 py-2 text-xs">{t.nav.donate}</Button>
                </Link>
              </>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={toggleTheme}
              className="p-1.5 text-slate-600 dark:text-gray-400"
            >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {!isAuthenticated && (
                <Link href="/donate">
                    <Button className="px-3 py-1.5 text-xs h-8 shadow-none">{t.nav.donate}</Button>
                </Link>
            )}
            <button 
              className="p-1 text-slate-900 dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 flex flex-col gap-4 p-6 bg-white border-b border-gray-200 shadow-2xl lg:hidden top-full dark:bg-black dark:border-white/10 animate-in slide-in-from-top-5">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`py-2 block font-medium ${isActive(item.href) ? 'text-coinlect-accent' : 'text-slate-600 dark:text-gray-300'}`} 
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
             <Link href="/admin" className="block py-2 font-bold text-purple-600 dark:text-purple-400" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
          )}
          
          <div className="flex items-center justify-between p-2 my-2 rounded-lg bg-slate-50 dark:bg-white/5">
             <span className="text-xs text-slate-500">Language</span>
             <button onClick={toggleLanguage} className="text-xs font-bold text-slate-900 dark:text-white border border-gray-300 dark:border-white/20 px-4 py-1.5 rounded-full">
                 {language === 'fr' ? 'English' : 'Français'}
             </button>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            {isAuthenticated ? (
                <Button onClick={logout} variant="secondary" className="justify-center w-full text-red-600 dark:text-red-400 border-red-500/20">Logout ({user?.name || user?.email})</Button>
            ) : (
                <>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="justify-center w-full dark:border-white/20 dark:text-white">{t.nav.getStarted}</Button>
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
