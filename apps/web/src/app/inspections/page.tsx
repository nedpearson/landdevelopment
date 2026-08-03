import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inspections | Land Intelligence OS',
};

export default function InspectionsPage() {
  return <CanonicalModule title="Inspections" />;
}
