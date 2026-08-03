import { notFound } from 'next/navigation';
import { getPropertyById } from '@/actions/propertyActions';
import { PropertyDetail } from '@/components/ui/PropertyDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const property = await getPropertyById(params.id);
  
  if (!property) {
    notFound();
  }
  
  return <PropertyDetail property={property} />;
}
