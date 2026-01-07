import { Deals } from '@/pages/Deals';
import { ComponentsLayout } from '../components-layout';
import { AuthGuard } from '@/components/AuthGuard';

export default function DealsPage() {
  return (
    <AuthGuard>
      <ComponentsLayout>
        <Deals />
      </ComponentsLayout>
    </AuthGuard>
  );
}

