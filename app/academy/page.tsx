'use client';

import { Academy } from '@/pages/Academy';
import { ComponentsLayout } from '../components-layout';
import { Suspense } from 'react';

export default function AcademyPage() {
  return (
    <ComponentsLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Academy />
      </Suspense>
    </ComponentsLayout>
  );
}

