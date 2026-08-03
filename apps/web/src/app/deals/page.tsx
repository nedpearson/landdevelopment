import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deals | Land Intelligence OS',
};

export default function DealsPage() {
  return <CanonicalModule title="Deals" />;
}
