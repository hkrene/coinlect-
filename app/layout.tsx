import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '600', '700'] });

export const metadata: Metadata = {
  title: 'Coinlect - Teka Lopango, somba Bitcoin',
  description: 'Coinlect - Your crypto learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-slate-900 dark:bg-black dark:text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

