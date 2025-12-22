'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import { NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [academyDropdownOpen, setAcademyDropdownOpen] = useState(false);
  const [mobileAcademyDropdownOpen, setMobileAcademyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const academyMegaMenuContent = [
    { 
      title: t.academy.megaMenu.allCategories, 
      description: t.academy.megaMenu.allCategoriesDesc, 
      href: '/academy' 
    },
    { 
      title: t.academy.megaMenu.education, 
      description: t.academy.megaMenu.educationDesc, 
      href: '/academy?category=education' 
    },
    { 
      title: t.academy.megaMenu.defi, 
      description: t.academy.megaMenu.defiDesc, 
      href: '/academy?category=defi' 
    },
    { 
      title: t.academy.megaMenu.adoption, 
      description: t.academy.megaMenu.adoptionDesc, 
      href: '/academy?category=adoption' 
    },
    { 
      title: t.academy.megaMenu.reviews, 
      description: t.academy.megaMenu.reviewsDesc, 
      href: '/academy?category=reviews' 
    },
    { 
      title: t.academy.megaMenu.guides, 
      description: t.academy.megaMenu.guidesDesc, 
      href: '/academy?category=guides' 
    },
    { 
      title: t.academy.megaMenu.trading, 
      description: t.academy.megaMenu.tradingDesc, 
      href: '/academy?category=trading' 
    },
    { 
      title: t.academy.megaMenu.mining, 
      description: t.academy.megaMenu.miningDesc, 
      href: '/academy?category=mining' 
    },
    { 
      title: t.academy.megaMenu.news, 
      description: t.academy.megaMenu.newsDesc, 
      href: '/trends?section=news' 
    },
  ];

  const navItems: NavItem[] = [
    { label: t.nav.home, href: '/' },
    { label: t.footer.about, href: '/about' },
    { label: t.nav.academy, href: '/academy' },
    { label: t.nav.deals, href: '/deals' },
    { label: t.nav.trends, href: '/trends' },
    { label: t.nav.community, href: '/community' },
    { label: t.nav.events, href: '/events' },
    { label: t.footer.about, href: '/about' },
  ];


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (academyDropdownOpen && !(event.target as Element).closest('.academy-dropdown')) {
        setAcademyDropdownOpen(false);
      }
    };

    if (academyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [academyDropdownOpen]);

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
          {navItems.map((item) => {
            if (item.label === t.nav.academy) {
              return (
                <div key={item.href} className="relative academy-dropdown">
                  <button
                    onMouseEnter={() => setAcademyDropdownOpen(true)}
                    onMouseLeave={() => setAcademyDropdownOpen(false)}
                    className={`text-sm transition-colors relative group py-1 flex items-center gap-1 ${isActive(item.href) ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                  >
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${academyDropdownOpen ? 'rotate-180' : ''}`} />
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-coinlect-accent transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </button>

                  {/* Academy Mega Menu */}
                  {academyDropdownOpen && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[90vw] max-w-[1200px] bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 origin-top animate-in fade-in-0 zoom-in-95 duration-200"
                      onMouseEnter={() => setAcademyDropdownOpen(true)}
                      onMouseLeave={() => setAcademyDropdownOpen(false)}
                    >
                      <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                        <h3 className="mb-4 text-lg font-semibold text-white">{t.academy.megaMenu.allCategories}</h3>
                        <Link
                          href={academyMegaMenuContent[0].href}
                          className="block p-3 transition-colors rounded-lg group hover:bg-white/5"
                          onClick={() => setAcademyDropdownOpen(false)}
                        >
                          <p className="font-medium text-white group-hover:text-coinlect-accent">{academyMegaMenuContent[0].title}</p>
                          <p className="mt-1 text-sm text-gray-400">{academyMegaMenuContent[0].description}</p>
                        </Link>
                      </div>

                      <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                        <h3 className="mb-4 text-lg font-semibold text-white">Fundamentals</h3>
                        {academyMegaMenuContent.slice(1, 4).map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block p-3 transition-colors rounded-lg group hover:bg-white/5"
                            onClick={() => setAcademyDropdownOpen(false)}
                          >
                            <p className="font-medium text-white group-hover:text-coinlect-accent">{item.title}</p>
                            <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                          </Link>
                        ))}
                      </div>

                      <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                        <h3 className="mb-4 text-lg font-semibold text-white">Advanced Topics</h3>
                        {academyMegaMenuContent.slice(4, 7).map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block p-3 transition-colors rounded-lg group hover:bg-white/5"
                            onClick={() => setAcademyDropdownOpen(false)}
                          >
                            <p className="font-medium text-white group-hover:text-coinlect-accent">{item.title}</p>
                            <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                          </Link>
                        ))}
                      </div>

                      <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                        <h3 className="mb-4 text-lg font-semibold text-white">Tools & Insights</h3>
                        {academyMegaMenuContent.slice(7).map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block p-3 transition-colors rounded-lg group hover:bg-white/5"
                            onClick={() => setAcademyDropdownOpen(false)}
                          >
                            <p className="font-medium text-white group-hover:text-coinlect-accent">{item.title}</p>
                            <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors relative group py-1 ${isActive(item.href) ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-coinlect-accent transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="items-center hidden gap-4 lg:flex">
          {/* Language Toggle - Always visible */}
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

          {/* Get Started button - Only visible when not authenticated */}
          {!isAuthenticated && (
            <Link href="/register">
                <Button variant="outline" className="px-4 py-2 text-xs text-white border-white/20">{t.nav.getStarted}</Button>
            </Link>
          )}

          {/* Donate button - Always visible */}
          <Link href="/donate">
              <Button className="px-4 py-2 text-xs">{t.nav.donate}</Button>
          </Link>

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
          ) : null}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 lg:hidden">
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
              {navItems.map((item) => {
                if (item.label === t.nav.academy) {
                  return (
                    <div key={item.href} className="relative">
                      <button
                        onClick={() => setMobileAcademyDropdownOpen(!mobileAcademyDropdownOpen)}
                        className={`py-2 flex justify-between items-center w-full font-medium ${isActive(item.href) ? 'text-coinlect-accent' : 'text-gray-300'}`}
                      >
                        {item.label}
                        <ChevronDown size={18} className={`transition-transform duration-200 ${mobileAcademyDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileAcademyDropdownOpen && (
                        <div className="pl-4 mt-2 ml-4 space-y-2 border-l border-white/10">
                          {academyMegaMenuContent.map((megaMenuItem) => (
                            <Link
                              key={megaMenuItem.href}
                              href={megaMenuItem.href}
                              className="block py-1 text-sm text-gray-400 transition-colors hover:text-white"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileAcademyDropdownOpen(false);
                              }}
                            >
                              <p className="font-medium text-white group-hover:text-coinlect-accent">{megaMenuItem.title}</p>
                              <p className="mt-1 text-xs text-gray-500">{megaMenuItem.description}</p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`py-2 block font-medium ${isActive(item.href) ? 'text-coinlect-accent' : 'text-gray-300'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}          {isAdmin && (
             <Link href="/admin" className="block py-2 font-bold text-purple-400" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
          )}

          <div className="flex flex-col gap-2 mt-2">
            {isAuthenticated ? (
                <Button onClick={logout} variant="secondary" className="justify-center w-full text-red-400 border-red-500/20">Logout ({user?.name || user?.email})</Button>
            ) : (
                <div className="flex items-center gap-3">
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
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                        <Button variant="outline" className="justify-center w-full text-white border-white/20">{t.nav.getStarted}</Button>
                    </Link>
                </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
