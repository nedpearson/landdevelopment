import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacts | Land Intelligence OS',
};

export default function ContactsPage() {
  return <CanonicalModule title="Contacts" />;
}
