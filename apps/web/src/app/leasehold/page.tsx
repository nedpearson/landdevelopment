import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leasehold | Land Intelligence OS',
};

export default function LeaseholdPage() {
  return <CanonicalModule title="Leasehold" />;
}
