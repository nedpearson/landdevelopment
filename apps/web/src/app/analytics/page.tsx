import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | Land Intelligence OS',
};

export default function AnalyticsPage() {
  return <CanonicalModule title="Analytics" />;
}
