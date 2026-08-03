import { getAllProperties } from "@/actions/propertyActions";
import { PropertiesIndex } from "@/components/ui/PropertiesIndex";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties | Land Intelligence OS",
  description: "View and manage properties.",
};

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const properties = await getAllProperties();
  
  return <PropertiesIndex initialProperties={properties} />;
}
