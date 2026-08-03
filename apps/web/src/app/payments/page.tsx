import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payments | Land Intelligence OS',
};

export default function PaymentsPage() {
  return <CanonicalModule title="Payments" />;
}
