import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Consultants | Land Intelligence OS',
};

export default function ConsultantsPage() {
  return <CanonicalModule title="Consultants" />;
}
