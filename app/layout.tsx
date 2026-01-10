import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Orbitron, Jura } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-orbitron',
});

const jura = Jura({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jura',
});

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
    <html lang="fr" className={`${orbitron.variable} ${jura.variable} scroll-smooth`}>
      <body className={`bg-black text-white`} suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

