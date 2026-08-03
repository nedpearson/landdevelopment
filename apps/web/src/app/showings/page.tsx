import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Showings | Land Intelligence OS',
};

export default function ShowingsPage() {
  return <CanonicalModule title="Showings" />;
}
