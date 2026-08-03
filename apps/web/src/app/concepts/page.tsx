import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concepts | Land Intelligence OS',
};

export default function ConceptsPage() {
  return <CanonicalModule title="Concepts" />;
}
