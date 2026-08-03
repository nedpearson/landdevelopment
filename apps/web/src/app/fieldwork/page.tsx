import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fieldwork | Land Intelligence OS',
};

export default function FieldworkPage() {
  return <CanonicalModule title="Fieldwork" />;
}
