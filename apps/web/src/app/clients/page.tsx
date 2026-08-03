import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clients | Land Intelligence OS',
};

export default function ClientsPage() {
  return <CanonicalModule title="Clients" />;
}
