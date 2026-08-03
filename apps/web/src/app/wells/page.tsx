import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wells | Land Intelligence OS',
};

export default function WellsPage() {
  return <CanonicalModule title="Wells" />;
}
