import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const PayrollPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payroll Management</h1>
        <p className="text-muted-foreground">Manage teacher salaries and payroll</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Feature Coming Soon
          </CardTitle>
          <CardDescription>
            Payroll management functionality is currently being developed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This feature will allow you to:
          </p>
          <ul className="mt-2 text-sm text-muted-foreground space-y-1">
            <li>• Manage teacher salaries</li>
            <li>• Generate payroll reports</li>
            <li>• Track payment history</li>
            <li>• Handle deductions and allowances</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollPage;