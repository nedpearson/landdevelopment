import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports | Land Intelligence OS',
};

export default function ReportsPage() {
  return <CanonicalModule title="Reports" />;
}
