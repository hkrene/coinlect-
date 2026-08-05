'use client';

import type { Metadata } from 'next';
import { Events } from '@/pages/Events';
import { ComponentsLayout } from '../components-layout';

export const metadata: Metadata = {
  title: 'Coinlect Événements | Meetups Web3 & crypto Afrique Francophone',
  description: 'Trouvez les événements crypto et Web3 pour les communautés francophones en Afrique : Sénégal, Côte d\'Ivoire, Bénin, Togo, Gabon, Congo et Burkina Faso.',
};

export default function EventsPage() {
  return (
    <ComponentsLayout>
      <Events />
    </ComponentsLayout>
  );
}

