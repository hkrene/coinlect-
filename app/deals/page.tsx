import type { Metadata } from 'next';
import { Deals } from '@/pages/Deals';
import { ComponentsLayout } from '../components-layout';
import { AuthGuard } from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'Coinlect Deals | Offres crypto et formations Web3 Afrique Francophone',
  description: 'Découvrez les meilleurs deals crypto et opportunités d\'éducation Web3 pour le Sénégal, la Côte d\'Ivoire, le Bénin, le Togo, le Gabon, le Congo et le Burkina Faso.',
};

export default function DealsPage() {
  return (
    <AuthGuard>
      <ComponentsLayout>
        <Deals />
      </ComponentsLayout>
    </AuthGuard>
  );
}

