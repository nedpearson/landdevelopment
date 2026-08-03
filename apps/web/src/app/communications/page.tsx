import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Communications | Land Intelligence OS',
};

export default function CommunicationsPage() {
  return <CanonicalModule title="Communications" />;
}
