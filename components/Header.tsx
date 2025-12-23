'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
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
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const academyMegaMenuContent = [
    { title: t.academy.megaMenu.allCategories, description: t.academy.megaMenu.allCategoriesDesc, href: '/academy' },
    { title: t.academy.megaMenu.education, description: t.academy.megaMenu.educationDesc, href: '/academy?category=education' },
    { title: t.academy.megaMenu.defi, description: t.academy.megaMenu.defiDesc, href: '/academy?category=defi' },
    { title: t.academy.megaMenu.adoption, description: t.academy.megaMenu.adoptionDesc, href: '/academy?category=adoption' },
    { title: t.academy.megaMenu.reviews, description: t.academy.megaMenu.reviewsDesc, href: '/academy?category=reviews' },
    { title: t.academy.megaMenu.guides, description: t.academy.megaMenu.guidesDesc, href: '/academy?category=guides' },
    { title: t.academy.megaMenu.trading, description: t.academy.megaMenu.tradingDesc, href: '/academy?category=trading' },
    { title: t.academy.megaMenu.mining, description: t.academy.megaMenu.miningDesc, href: '/academy?category=mining' },
    { title: t.academy.megaMenu.news, description: t.academy.megaMenu.newsDesc, href: '/trends?section=news' },
  ];

  const navItems: NavItem[] = [
    { label: t.nav.home, href: '/' },
    { label: t.footer.about, href: '/about' },
    { label: t.nav.academy, href: '/academy' },
    { label: t.nav.deals, href: '/deals' },
    { label: t.nav.trends, href: '/trends' },
    { label: t.nav.community, href: '/community' },
    { label: t.nav.events, href: '/events' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  const logoSrc = pathname?.startsWith('/academy') 
    ? "https://res.cloudinary.com/drsd8adkq/image/upload/v1765187893/coinLect-academ_our9m2.jpg"
    : "https://res.cloudinary.com/drsd8adkq/image/upload/v1765187097/coinlect-0_denz8g.jpg";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container flex items-center justify-between px-6 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img src={logoSrc} alt="Coinlect" className="object-contain w-auto h-8 transition-transform duration-300 rounded-full md:h-10 group-hover:scale-105" />
        </Link>

        {/* Desktop Nav */}
        <nav className="items-center hidden gap-8 lg:flex">
          {navItems.map((item) => {
            if (item.label === t.nav.academy) {
              return (
                <div 
                  key={item.href} 
                  className="relative h-full"
                  onMouseEnter={() => setAcademyDropdownOpen(true)}
                  onMouseLeave={() => setAcademyDropdownOpen(false)}
                >
                  <button className={`text-sm transition-colors relative flex items-center gap-1 py-4 ${isActive(item.href) ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}>
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${academyDropdownOpen ? 'rotate-180' : ''}`} />
                    <span className={`absolute bottom-2 left-0 h-0.5 bg-coinlect-accent transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </button>

                  {/* Mega Menu - Desktop Full Width */}
                  <div className={`fixed left-0 right-0 w-screen bg-black/95 backdrop-blur-xl border-t border-b border-white/10 shadow-2xl transition-all duration-300 pointer-events-auto ${isScrolled ? 'top-[73px]' : 'top-[89px]'} ${academyDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    <div className="container px-6 py-12 mx-auto">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {academyMegaMenuContent.map((subItem) => (
                          <Link key={subItem.href} href={subItem.href} className="group/item p-4 rounded-xl border border-white/5 bg-white/[0.02] transition-all hover:bg-white/10 hover:border-white/20" onClick={() => setAcademyDropdownOpen(false)}>
                            <p className="font-bold text-white transition-colors group-hover/item:text-coinlect-accent">{subItem.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2">{subItem.description}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link key={item.href} href={item.href} className={`text-sm transition-colors relative group py-4 ${isActive(item.href) ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}>
                {item.label}
                <span className={`absolute bottom-2 left-0 h-0.5 bg-coinlect-accent transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="items-center hidden gap-4 lg:flex">
          <div className="relative flex items-center">
            <button onClick={() => setLanguage('fr')} className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${language === 'fr' ? 'border-coinlect-accent bg-black text-gray-200' : 'border-white/10 bg-black text-gray-500'}`}>
              <span className="text-xs font-semibold">FR</span>
            </button>
            <button onClick={() => setLanguage('en')} className={`relative -ml-3 z-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${language === 'en' ? 'border-coinlect-accent bg-black text-gray-200' : 'border-white/10 bg-black text-gray-500'}`}>
              <span className="text-xs font-semibold">EN</span>
            </button>
          </div>
          {!isAuthenticated && <Link href="/register"><Button variant="outline" className="px-4 py-2 text-xs text-white border-white/20">{t.nav.getStarted}</Button></Link>}
          <Link href="/donate"><Button className="px-4 py-2 text-xs">{t.nav.donate}</Button></Link>
          {isAuthenticated && (
             <div className="flex items-center gap-3">
                {isAdmin && <Link href="/admin"><button className="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full text-xs font-bold border border-purple-500/20"><LayoutDashboard size={14} /> Admin</button></Link>}
                <div className="flex items-center gap-2 py-1 pl-3 pr-1 border rounded-full border-white/10 bg-white/5">
                  <span className="text-xs font-semibold text-white">{user?.name || user?.email}</span>
                  <button onClick={logout} className="p-1.5 bg-red-500/10 text-red-600 rounded-full hover:bg-red-500"><LogOut size={12} /></button>
                </div>
             </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
            {!isAuthenticated && <Link href="/donate"><Button className="px-3 py-1.5 text-xs h-8 shadow-none">{t.nav.donate}</Button></Link>}
            <button className="p-1 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 flex flex-col gap-2 p-6 bg-black border-b border-white/10 lg:hidden top-full max-h-[90vh] overflow-y-auto">
           {navItems.map((item) => {
             if (item.label === t.nav.academy) {
               return (
                 <div key={item.href} className="flex flex-col">
                   <button onClick={() => setMobileAcademyDropdownOpen(!mobileAcademyDropdownOpen)} className={`py-3 flex justify-between items-center w-full font-medium ${isActive(item.href) ? 'text-coinlect-accent' : 'text-gray-300'}`}>
                     {item.label}
                     <ChevronDown size={18} className={`transition-transform duration-200 ${mobileAcademyDropdownOpen ? 'rotate-180' : ''}`} />
                   </button>
                   {mobileAcademyDropdownOpen && (
                     <div className="pl-4 mt-1 mb-4 space-y-3 border-l border-white/10">
                       {academyMegaMenuContent.map((sub) => (
                         <Link key={sub.href} href={sub.href} className="block group" onClick={() => setMobileMenuOpen(false)}>
                           <p className="text-sm font-medium text-white">{sub.title}</p>
                           <p className="text-[11px] text-gray-500 line-clamp-1">{sub.description}</p>
                         </Link>
                       ))}
                     </div>
                   )}
                 </div>
               );
             }
             return (
               <Link key={item.href} href={item.href} className={`py-3 block font-medium border-b border-white/5 ${isActive(item.href) ? 'text-coinlect-accent' : 'text-gray-300'}`} onClick={() => setMobileMenuOpen(false)}>
                 {item.label}
               </Link>
             );
           })}
           <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-white/10">
             <div className="flex items-center gap-2">
               <div className="relative flex items-center flex-none">
                 <button onClick={() => setLanguage('fr')} className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${language === 'fr' ? 'border-coinlect-accent bg-black text-gray-200' : 'border-white/10 bg-black text-gray-500'}`}>
                   <span className="text-xs font-semibold">FR</span>
                 </button>
                 <button onClick={() => setLanguage('en')} className={`relative -ml-3 z-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${language === 'en' ? 'border-coinlect-accent bg-black text-gray-200' : 'border-white/10 bg-black text-gray-500'}`}>
                   <span className="text-xs font-semibold">EN</span>
                 </button>
               </div>
               {!isAuthenticated && <Link href="/register" className="flex-grow"><Button variant="outline" className="px-4 py-2 text-xs text-white border-white/20" onClick={() => setMobileMenuOpen(false)}>{t.nav.getStarted}</Button></Link>}
             </div>
             {isAuthenticated && (
               <div className="flex items-center justify-between p-2 mt-2 rounded-lg bg-white/5">
                 <span className="text-sm font-semibold text-white">{user?.name || user?.email}</span>
                 <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="p-1.5 bg-red-500/10 text-red-600 rounded-full hover:bg-red-500"><LogOut size={14} /></button>
               </div>
             )}
           </div>
        </div>
      )}
    </header>
  );
};