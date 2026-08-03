import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent | Land Intelligence OS',
};

export default function RentPage() {
  return <CanonicalModule title="Rent" />;
}
