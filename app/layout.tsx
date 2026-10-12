import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Orbitron, Jura } from 'next/font/google';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from './components/GoogleAnalytics';
import { CoinzillaScript } from '@/components/CoinzillaScript';
import { CookieConsent } from '@/components/CookieConsent';

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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Coinlect",
  "url": "https://www.coinlect.org",
  "logo": "https://res.cloudinary.com/drsd8adkq/image/upload/v1765185502/clclogo_p2v5bp.jpg",
  "description": "Plateforme d'éducation Web3, académie crypto et communauté de référence pour l'Afrique Francophone.",
  "areaServed": [
    { "@type": "Country", "name": "Senegal" },
    { "@type": "Country", "name": "Ivory Coast" },
    { "@type": "Country", "name": "Benin" },
    { "@type": "Country", "name": "Republic of the Congo" },
    { "@type": "Country", "name": "Democratic Republic of the Congo" },
    { "@type": "Country", "name": "Togo" },
    { "@type": "Country", "name": "Gabon" },
    { "@type": "Country", "name": "Burkina Faso" }
  ],
  "availableLanguage": ["French"],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.coinlect.org'),
  title: 'Coinlect - Académie crypto et communauté Web3 pour l\'Afrique Francophone',
  description: 'Plateforme d\'éducation Web3, académie crypto et communauté de référence pour l\'Afrique Francophone. Formations crypto Sénégal, Côte d\'Ivoire, Bénin, Togo, Gabon, Congo, Burkina Faso.',
  icons: {
    icon: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765185502/clclogo_p2v5bp.jpg',
    shortcut: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765185502/clclogo_p2v5bp.jpg',
    apple: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765185502/clclogo_p2v5bp.jpg',
  },
  openGraph: {
    title: 'Coinlect - Académie crypto et communauté Web3 pour l\'Afrique Francophone',
    description: 'Plateforme d\'éducation Web3, académie crypto et communauté de référence pour l\'Afrique Francophone. Formations crypto Sénégal, Côte d\'Ivoire, Bénin, Togo, Gabon, Congo, Burkina Faso.',
    type: 'website',
    url: 'https://www.coinlect.org',
    locale: 'fr_FR',
    siteName: 'Coinlect',
    images: [
      {
        url: 'https://res.cloudinary.com/drsd8adkq/image/upload/v1765185502/clclogo_p2v5bp.jpg',
        width: 1200,
        height: 630,
        alt: 'Coinlect logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coinlect - Académie crypto et communauté Web3 pour l\'Afrique Francophone',
    description: 'Plateforme d\'éducation Web3, académie crypto et communauté de référence pour l\'Afrique Francophone. Formations crypto Sénégal, Côte d\'Ivoire, Bénin, Togo, Gabon, Congo, Burkina Faso.',
    images: ['https://res.cloudinary.com/drsd8adkq/image/upload/v1765185502/clclogo_p2v5bp.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    coinzilla: "15f8b6e007346343a259d5a44a817c45",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${orbitron.variable} ${jura.variable} scroll-smooth`}>
      <body className={`bg-black text-white overflow-x-clip`} suppressHydrationWarning={true}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <GoogleAnalytics />
        <CoinzillaScript />
        <Providers>
          {children}
          <CookieConsent />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}

