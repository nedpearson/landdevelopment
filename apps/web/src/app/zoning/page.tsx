import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zoning | Land Intelligence OS',
};

export default function ZoningPage() {
  return <CanonicalModule title="Zoning" />;
}
