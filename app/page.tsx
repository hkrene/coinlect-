import type { Metadata } from 'next';
import { Home } from '@/pages/Home';
import { ComponentsLayout } from './components-layout';

export const metadata: Metadata = {
  title: 'Coinlect | Académie crypto Sénégal, Côte d\'Ivoire, Bénin, Togo, Gabon, Congo, Burkina Faso',
  description: 'Coinlect est la meilleure académie crypto en Afrique Francophone. Formations crypto, Web3, tendances de trading, communauté active et événements pour Sénégal, Côte d\'Ivoire, Bénin, Gabon, Congo, Togo et Burkina Faso.',
};

export default function HomePage() {
  return (
    <ComponentsLayout>
      <Home />
    </ComponentsLayout>
  );
}

