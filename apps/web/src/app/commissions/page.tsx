import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commissions | Land Intelligence OS',
};

export default function CommissionsPage() {
  return <CanonicalModule title="Commissions" />;
}
