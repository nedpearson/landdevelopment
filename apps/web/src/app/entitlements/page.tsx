import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entitlements | Land Intelligence OS',
};

export default function EntitlementsPage() {
  return <CanonicalModule title="Entitlements" />;
}
