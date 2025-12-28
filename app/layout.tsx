import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '600', '700'] });

export const metadata: Metadata = {
  title: 'Coinlect',
  description: 'Coinlect - Your crypto learning platform',
  icons: {
    icon: 'https://res.cloudinary.com/drsd8adkq/image/upload/a_90/v1765185609/cnlaclogo_euzria.png',
    shortcut: 'https://res.cloudinary.com/drsd8adkq/image/upload/a_90/v1765185609/cnlaclogo_euzria.png',
    apple: 'https://res.cloudinary.com/drsd8adkq/image/upload/a_90/v1765185609/cnlaclogo_euzria.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

