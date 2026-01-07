'use client';

import DealDetail from '@/pages/DealDetail';
import { ComponentsLayout } from '../../components-layout';
import { Suspense } from 'react';
import { AuthGuard } from '@/components/AuthGuard';

export default function DealDetailPage() {
  return (
    <AuthGuard>
      <ComponentsLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <DealDetail />
        </Suspense>
      </ComponentsLayout>
    </AuthGuard>
  );
}