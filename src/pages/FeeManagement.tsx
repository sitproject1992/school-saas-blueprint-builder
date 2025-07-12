import { FeeStructure } from "@/components/fees/FeeStructure";
import { FeePayments } from "@/components/fees/FeePayments";

export default function FeeManagement() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Fee Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FeeStructure />
        <FeePayments />
      </div>
    </div>
  );
}
