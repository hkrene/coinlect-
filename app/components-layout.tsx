'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatAssistant } from '@/components/ChatAssistant';

export function ComponentsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLegalPage = pathname === '/privacy' || pathname === '/terms';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white font-sans selection:bg-coinlect-accent selection:text-black flex flex-col">
      {!isLegalPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isLegalPage && <Footer />}
      {!isLegalPage && <ChatAssistant />}
    </div>
  );
}

