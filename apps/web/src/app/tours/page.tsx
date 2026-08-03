import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tours | Land Intelligence OS',
};

export default function ToursPage() {
  return <CanonicalModule title="Tours" />;
}
