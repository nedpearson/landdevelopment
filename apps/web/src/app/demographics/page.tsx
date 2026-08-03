import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demographics | Land Intelligence OS',
};

export default function DemographicsPage() {
  return <CanonicalModule title="Demographics" />;
}
