import { FundManagerDashboard } from "@/components/ui/FundManagerDashboard";

export const metadata = {
  title: "Fund Manager | Land Intelligence OS",
};

export default function FundManagerPage() {
  return (
    <div className="space-y-6">
      <FundManagerDashboard />
    </div>
  );
}
