import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Traffic | Land Intelligence OS',
};

export default function TrafficPage() {
  return <CanonicalModule title="Traffic" />;
}
