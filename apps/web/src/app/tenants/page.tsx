import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tenants | Land Intelligence OS',
};

export default function TenantsPage() {
  return <CanonicalModule title="Tenants" />;
}
