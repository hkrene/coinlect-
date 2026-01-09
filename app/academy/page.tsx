'use client';

import { Academy } from '@/pages/Academy';
import { ComponentsLayout } from '../components-layout';
import { Suspense } from 'react';
import { AuthGuard } from '@/components/AuthGuard';

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

