import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Jura:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`bg-black text-white`} suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

