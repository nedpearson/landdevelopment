import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering | Land Intelligence OS',
};

export default function EngineeringPage() {
  return <CanonicalModule title="Engineering" />;
}
