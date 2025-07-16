import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SchoolForm from "@/components/schools/SchoolForm";
import { School } from "lucide-react";

export default function Schools() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <School className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Schools</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Management</CardTitle>
        </CardHeader>
        <CardContent>
          <SchoolForm />
        </CardContent>
      </Card>
    </div>
  );
}
