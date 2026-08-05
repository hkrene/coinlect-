import type { Metadata } from 'next';
import { Community } from '@/pages/Community';
import { ComponentsLayout } from '../components-layout';

export const metadata: Metadata = {
  title: 'Coinlect Communauté | Réseau crypto francophone Afrique',
  description: 'Rejoignez la communauté Coinlect pour échanger avec des passionnés crypto en Afrique Francophone : Sénégal, Côte d\'Ivoire, Bénin, Togo, Gabon, Congo, Burkina Faso.',
};

export default function CommunityPage() {
  return (
    <ComponentsLayout>
      <Community />
    </ComponentsLayout>
  );
}

