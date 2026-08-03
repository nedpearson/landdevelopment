import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Options | Land Intelligence OS',
};

export default function OptionsPage() {
  return <CanonicalModule title="Options" />;
}
