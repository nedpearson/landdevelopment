import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search | Land Intelligence OS',
};

export default function SearchPage() {
  return <CanonicalModule title="Search" />;
}
