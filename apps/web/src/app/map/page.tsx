import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Map | Land Intelligence OS',
};

export default function MapPage() {
  return <CanonicalModule title="Map" />;
}
