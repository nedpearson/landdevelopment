import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendors | Land Intelligence OS',
};

export default function VendorsPage() {
  return <CanonicalModule title="Vendors" />;
}
