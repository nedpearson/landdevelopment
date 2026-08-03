import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deliverables | Land Intelligence OS',
};

export default function DeliverablesPage() {
  return <CanonicalModule title="Deliverables" />;
}
