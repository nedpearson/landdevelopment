import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comps | Land Intelligence OS',
};

export default function CompsPage() {
  return <CanonicalModule title="Comps" />;
}
