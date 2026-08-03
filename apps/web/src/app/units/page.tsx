import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Units | Land Intelligence OS',
};

export default function UnitsPage() {
  return <CanonicalModule title="Units" />;
}
