import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const getExams = async () => {
  const { data, error } = await supabase
    .from("exams")
    .select(`
      *,
      subjects(name)
    `);
  if (error) throw new Error(error.message);
  return data;
};

const createExam = async (exam: any) => {
  const { data, error } = await supabase.from("exams").insert(exam).select();
  if (error) throw new Error(error.message);
  return data;
};

const updateExam = async (exam: any) => {
  const { data, error } = await supabase.from("exams").update(exam).eq("id", exam.id).select();
  if (error) throw new Error(error.message);
  return data;
};

const deleteExam = async (id: string) => {
  const { error } = await supabase.from("exams").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

export default function Exams() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    type: "pre_test" as "pre_test" | "post_test" | "weekly" | "monthly" | "major" | "final",
    academic_year: "",
  });

  const { data: exams, isLoading, error } = useQuery({
    queryKey: ["exams"],
    queryFn: getExams,
  });

  const createMutation = useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      setIsDialogOpen(false);
      setEditingExam(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      type: "pre_test",
      academic_year: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const examData = {
      ...formData,
      school_id: "default-school",
      created_by: "admin",
    };

    if (editingExam) {
      updateMutation.mutate({ ...examData, id: editingExam.id });
    } else {
      createMutation.mutate(examData);
    }
  };

  const handleEdit = (exam: any) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name || "",
      start_date: exam.start_date ? format(new Date(exam.start_date), "yyyy-MM-dd") : "",
      end_date: exam.end_date ? format(new Date(exam.end_date), "yyyy-MM-dd") : "",
      type: exam.type || "pre_test",
      academic_year: exam.academic_year || "",
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingExam(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      deleteMutation.mutate(id);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pre_test":
        return "bg-blue-100 text-blue-800";
      case "post_test":
        return "bg-green-100 text-green-800";
      case "weekly":
        return "bg-yellow-100 text-yellow-800";
      case "monthly":
        return "bg-purple-100 text-purple-800";
      case "major":
        return "bg-red-100 text-red-800";
      case "final":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Exam
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Exams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams?.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(exam.type)}>
                      {exam.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{exam.academic_year}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {exam.start_date ? format(new Date(exam.start_date), "MMM dd, yyyy") : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {exam.end_date ? format(new Date(exam.end_date), "MMM dd, yyyy") : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(exam)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(exam.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingExam ? "Edit Exam" : "Add New Exam"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter exam name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre_test">Pre Test</SelectItem>
                    <SelectItem value="post_test">Post Test</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="academic_year">Academic Year</Label>
              <Input
                id="academic_year"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                placeholder="Enter academic year (e.g., 2024-2025)"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingExam ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}