import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Title | Land Intelligence OS',
};

export default function TitlePage() {
  return <CanonicalModule title="Title" />;
}
