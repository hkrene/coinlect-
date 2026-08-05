import type { Metadata } from 'next';
import { Trends } from '@/pages/Trends';
import { ComponentsLayout } from '../components-layout';

export const metadata: Metadata = {
  title: 'Coinlect Tendances | Actualités crypto & trading Afrique Francophone',
  description: 'Analyse des tendances crypto et trading pour l\'Afrique Francophone. Suivez les mouvements du marché et les actualités Web3 pour le Sénégal, la Côte d\'Ivoire, le Bénin, le Togo, le Gabon, le Congo et le Burkina Faso.',
};

export default function TrendsPage() {
  return (
    <ComponentsLayout>
      <Trends />
    </ComponentsLayout>
  );
}

