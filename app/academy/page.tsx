'use client';

import type { Metadata } from 'next';
import { Academy } from '@/pages/Academy';
import { ComponentsLayout } from '../components-layout';
import { Suspense } from 'react';
import { AuthGuard } from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'Coinlect Académie | Formation crypto et Web3 pour l\'Afrique Francophone',
  description: 'Formation crypto en ligne pour le Sénégal, la Côte d\'Ivoire, le Bénin, le Togo, le Gabon, le Congo et le Burkina Faso. Cours Web3, blockchain, trading, DeFi et sécurité numérique.',
};

export default function AcademyPage() {
  return (
    <AuthGuard>
      <ComponentsLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Academy />
        </Suspense>
      </ComponentsLayout>
    </AuthGuard>
  );
}

