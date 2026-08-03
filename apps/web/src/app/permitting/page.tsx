import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Permitting | Land Intelligence OS',
};

export default function PermittingPage() {
  return <CanonicalModule title="Permitting" />;
}
