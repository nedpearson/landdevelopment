import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Owners | Land Intelligence OS',
};

export default function OwnersPage() {
  return <CanonicalModule title="Owners" />;
}
