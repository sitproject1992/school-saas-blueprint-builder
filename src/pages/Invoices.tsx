import { FeePayments } from "@/components/fees/FeePayments";

export default function Invoices() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Invoices</h1>
      <FeePayments />
    </div>
  );
}
