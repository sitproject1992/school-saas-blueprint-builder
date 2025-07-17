import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FeeStructureForm from "@/components/fees/FeeStructureForm";
import { DollarSign } from "lucide-react";

export default function FeeStructures() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <DollarSign className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Fee Structures</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Fee Structures</CardTitle>
        </CardHeader>
        <CardContent>
          <FeeStructureForm onSuccess={() => console.log("Fee structure created successfully")} />
        </CardContent>
      </Card>
    </div>
  );
}
