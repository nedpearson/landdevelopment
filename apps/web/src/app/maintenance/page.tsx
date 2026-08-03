import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance | Land Intelligence OS',
};

export default function MaintenancePage() {
  return <CanonicalModule title="Maintenance" />;
}
