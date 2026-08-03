import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Landowners | Land Intelligence OS',
};

export default function LandownersPage() {
  return <CanonicalModule title="Landowners" />;
}
