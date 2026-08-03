import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Listings | Land Intelligence OS',
};

export default function ListingsPage() {
  return <CanonicalModule title="Listings" />;
}
