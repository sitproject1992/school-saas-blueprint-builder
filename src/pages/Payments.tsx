import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Building2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  student_id: string;
  fee_structure_id: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  transaction_id?: string;
  receipt_number: string;
  paid_date?: string;
  due_date: string;
  created_at: string;
  student?: {
    first_name: string;
    last_name: string;
    class_name?: string;
  };
  fee_structure?: {
    name: string;
    description?: string;
  };
}

interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one_time';
  is_active: boolean;
}

export default function Payments() {
  const { schoolId, isSchoolAdmin, isTeacher } = useTenant();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Fetch payments
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_payments")
        .select(`
          *,
          student:students(first_name, last_name, class_name),
          fee_structure:fee_structures(name, description)
        `)
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as Payment[];
    },
    enabled: !!schoolId,
  });

  // Fetch fee structures
  const { data: feeStructures } = useQuery({
    queryKey: ["fee-structures", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_structures")
        .select("*")
        .eq("school_id", schoolId)
        .eq("is_active", true)
        .order("name");

      if (error) throw new Error(error.message);
      return data as FeeStructure[];
    },
    enabled: !!schoolId,
  });

  // Payment statistics
  const { data: paymentStats } = useQuery({
    queryKey: ["payment-stats", schoolId],
    queryFn: async () => {
      const { data: payments } = await supabase
        .from("fee_payments")
        .select("amount, status, created_at")
        .eq("school_id", schoolId);

      if (!payments) return { total: 0, paid: 0, pending: 0, overdue: 0, monthly: 0 };

      const total = payments.reduce((sum, p) => sum + p.amount, 0);
      const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
      const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
      const overdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

      // Monthly revenue (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthly = payments
        .filter(p => p.status === 'paid' && new Date(p.created_at) >= thirtyDaysAgo)
        .reduce((sum, p) => sum + p.amount, 0);

      return { total, paid, pending, overdue, monthly };
    },
    enabled: !!schoolId,
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: {
      student_id: string;
      fee_structure_id: string;
      amount: number;
      payment_method: string;
      receipt_number: string;
    }) => {
      const { data, error } = await supabase
        .from("fee_payments")
        .insert([{
          ...paymentData,
          school_id: schoolId,
          status: 'paid',
          paid_date: new Date().toISOString(),
          due_date: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["payment-stats", schoolId] });
      toast({
        title: "Payment recorded successfully",
        description: "The payment has been added to the system.",
      });
      setIsPaymentDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error recording payment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter payments based on search and status
  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = 
      payment.student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.fee_structure?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Overdue</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'online':
        return <CreditCard className="w-4 h-4" />;
      case 'cash':
        return <DollarSign className="w-4 h-4" />;
      case 'cheque':
        return <Receipt className="w-4 h-4" />;
      case 'bank_transfer':
        return <Building2 className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Manage fee payments and track revenue
          </p>
        </div>
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
              <DialogDescription>
                Add a new payment record for a student.
              </DialogDescription>
            </DialogHeader>
            <RecordPaymentForm 
              feeStructures={feeStructures || []}
              onSubmit={createPaymentMutation.mutate}
              isLoading={createPaymentMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{paymentStats?.total?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{paymentStats?.monthly?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{paymentStats?.paid?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Successful payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{paymentStats?.overdue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Overdue payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Management */}
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">All Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Payments List */}
          <div className="grid gap-4">
            {isLoading ? (
              <div className="text-center py-8">Loading payments...</div>
            ) : filteredPayments?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No payments found matching your criteria.
              </div>
            ) : (
              filteredPayments?.map((payment) => (
                <Card key={payment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>₹{payment.amount.toLocaleString()}</span>
                          {getStatusBadge(payment.status)}
                        </CardTitle>
                        <CardDescription>
                          {payment.student?.first_name} {payment.student?.last_name} • {payment.fee_structure?.name}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(payment.payment_method)}
                        <span className="capitalize">{payment.payment_method.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="font-medium">Receipt:</span> {payment.receipt_number}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(payment.created_at).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Class:</span> {payment.student?.class_name || 'N/A'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reports</CardTitle>
              <CardDescription>
                Generate detailed payment reports and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Payment reports and analytics coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment methods and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Payment settings coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Details Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed information about the payment
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount</Label>
                  <div className="text-lg font-bold">₹{selectedPayment.amount.toLocaleString()}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(selectedPayment.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student</Label>
                  <div>{selectedPayment.student?.first_name} {selectedPayment.student?.last_name}</div>
                </div>
                <div>
                  <Label>Fee Structure</Label>
                  <div>{selectedPayment.fee_structure?.name}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payment Method</Label>
                  <div className="flex items-center space-x-2">
                    {getPaymentMethodIcon(selectedPayment.payment_method)}
                    <span className="capitalize">{selectedPayment.payment_method.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <Label>Receipt Number</Label>
                  <div>{selectedPayment.receipt_number}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Transaction ID</Label>
                  <div>{selectedPayment.transaction_id || 'N/A'}</div>
                </div>
                                 <div>
                   <Label>Payment Date</Label>
                   <div>{selectedPayment.paid_date ? new Date(selectedPayment.paid_date).toLocaleDateString() : 'N/A'}</div>
                 </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Record Payment Form Component
function RecordPaymentForm({ 
  feeStructures, 
  onSubmit, 
  isLoading 
}: { 
  feeStructures: FeeStructure[];
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    student_id: "",
    fee_structure_id: "",
    amount: "",
    payment_method: "online" as const,
    receipt_number: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      receipt_number: formData.receipt_number || `RCP-${Date.now()}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="student">Student ID</Label>
        <Input
          id="student"
          value={formData.student_id}
          onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
          placeholder="Enter student ID"
          required
        />
      </div>

      <div>
        <Label htmlFor="fee-structure">Fee Structure</Label>
        <select
          id="fee-structure"
          value={formData.fee_structure_id}
          onChange={(e) => setFormData({ ...formData, fee_structure_id: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded-md"
          required
        >
          <option value="">Select fee structure</option>
          {feeStructures.map((structure) => (
            <option key={structure.id} value={structure.id}>
              {structure.name} - ₹{structure.amount}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="Enter amount"
          required
        />
      </div>

      <div>
        <Label htmlFor="payment-method">Payment Method</Label>
        <select
          id="payment-method"
          value={formData.payment_method}
          onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as any })}
          className="w-full px-3 py-2 border border-input rounded-md"
          required
        >
          <option value="online">Online</option>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </div>

      <div>
        <Label htmlFor="receipt">Receipt Number (Optional)</Label>
        <Input
          id="receipt"
          value={formData.receipt_number}
          onChange={(e) => setFormData({ ...formData, receipt_number: e.target.value })}
          placeholder="Auto-generated if left empty"
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Recording..." : "Record Payment"}
        </Button>
      </DialogFooter>
    </form>
  );
}