import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounting | Land Intelligence OS',
};

export default function AccountingPage() {
  return <CanonicalModule title="Accounting" />;
}
