import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Budgets | Land Intelligence OS',
};

export default function BudgetsPage() {
  return <CanonicalModule title="Budgets" />;
}
