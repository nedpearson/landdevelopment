import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workorders | Land Intelligence OS',
};

export default function WorkordersPage() {
  return <CanonicalModule title="Workorders" />;
}
