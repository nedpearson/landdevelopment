import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parcels | Land Intelligence OS',
};

export default function ParcelsPage() {
  return <CanonicalModule title="Parcels" />;
}
