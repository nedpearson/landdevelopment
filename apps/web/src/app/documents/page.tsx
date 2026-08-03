import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documents | Land Intelligence OS',
};

export default function DocumentsPage() {
  return <CanonicalModule title="Documents" />;
}
