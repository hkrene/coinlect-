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
    <div className="flex flex-col min-h-screen font-sans text-white bg-black selection:bg-coinlect-accent selection:text-black dark">
      {!isLegalPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isLegalPage && <Footer />}
      {!isLegalPage && <ChatAssistant />}
    </div>
  );
}

