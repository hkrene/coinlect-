'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatAssistant } from '@/components/ChatAssistant';

export function ComponentsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSpecialPage = pathname === '/privacy' || pathname === '/terms' || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/verify-email';
  const isAdminPage = pathname === '/admin';
  
  // Pages that should not have footer
  const isNoFooterPage = 
    pathname === '/profile' ||
    pathname === '/academy' ||
    pathname === '/donate' ||
    (pathname?.startsWith('/academy/article/')) ||
    (pathname?.startsWith('/academy/') && pathname !== '/academy' && !pathname.startsWith('/academy/article/')) ||
    (pathname?.startsWith('/deals/') && pathname !== '/deals');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen text-white bg-black selection:bg-coinlect-accent selection:text-black dark">
      {isAdminPage ? (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-4 bg-black border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="https://res.cloudinary.com/drsd8adkq/image/upload/v1765187097/coinlect-0_denz8g.jpg" 
              alt="Coinlect" 
              className="object-contain w-auto h-8 transition-transform duration-300 rounded-full md:h-10 group-hover:scale-105" 
            />
          </Link>
        </div>
      ) : (
        !isSpecialPage && <Header />
      )}
      <main className={`flex-grow ${isAdminPage ? 'pt-16' : ''}`}>
        {children}
      </main>
      {!isSpecialPage && !isAdminPage && !isNoFooterPage && <Footer />}
      {!isSpecialPage && !isAdminPage && !isNoFooterPage && <ChatAssistant />}
    </div>
  );
}

