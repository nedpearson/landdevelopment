import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transmission | Land Intelligence OS',
};

export default function TransmissionPage() {
  return <CanonicalModule title="Transmission" />;
}
