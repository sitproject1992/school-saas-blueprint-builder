import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ImportError {
  row: number;
  field: string;
  value: string;
  error: string;
}

interface ImportResult {
  totalRecords: number;
  successfulImports: number;
  failedImports: number;
  errors: ImportError[];
  importId?: string;
}

interface StudentRecord {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  admissionNumber: string;
  admissionDate?: string;
  className?: string;
  section?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalConditions?: string;
}

export function BulkStudentImport({ schoolId }: { schoolId: string }) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importProgress, setImportProgress] = useState(0);

  const downloadTemplate = () => {
    const template = `firstName,lastName,email,phone,dateOfBirth,admissionNumber,admissionDate,className,section,bloodGroup,address,emergencyContactName,emergencyContactPhone,medicalConditions
John,Doe,john.doe@example.com,+1234567890,2010-05-15,STU001,2024-01-15,Class 5,A,O+,"123 Main St, City",Jane Doe,+1234567891,None
Jane,Smith,jane.smith@example.com,+1234567892,2009-08-22,STU002,2024-01-15,Class 6,B,A-,"456 Oak Ave, City",John Smith,+1234567893,Asthma`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded successfully");
  };

  const parseCSV = (text: string): StudentRecord[] => {
    const lines = text.split("\n").filter(line => line.trim());
    if (lines.length < 2) throw new Error("CSV file must have a header and at least one data row");

    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
    const students: StudentRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
      if (values.length !== headers.length) {
        throw new Error(`Row ${i + 1} has ${values.length} columns but expected ${headers.length}`);
      }

      const student: StudentRecord = {
        firstName: "",
        lastName: "",
        email: "",
        admissionNumber: "",
      };

      headers.forEach((header, index) => {
        const value = values[index];
        switch (header.toLowerCase()) {
          case "firstname":
            student.firstName = value;
            break;
          case "lastname":
            student.lastName = value;
            break;
          case "email":
            student.email = value;
            break;
          case "phone":
            student.phone = value;
            break;
          case "dateofbirth":
            student.dateOfBirth = value;
            break;
          case "admissionnumber":
            student.admissionNumber = value;
            break;
          case "admissiondate":
            student.admissionDate = value;
            break;
          case "classname":
            student.className = value;
            break;
          case "section":
            student.section = value;
            break;
          case "bloodgroup":
            student.bloodGroup = value;
            break;
          case "address":
            student.address = value;
            break;
          case "emergencycontactname":
            student.emergencyContactName = value;
            break;
          case "emergencycontactphone":
            student.emergencyContactPhone = value;
            break;
          case "medicalconditions":
            student.medicalConditions = value;
            break;
        }
      });

      students.push(student);
    }

    return students;
  };

  const validateStudent = (student: StudentRecord, index: number): ImportError[] => {
    const errors: ImportError[] = [];

    if (!student.firstName) {
      errors.push({
        row: index + 2,
        field: "firstName",
        value: student.firstName,
        error: "First name is required",
      });
    }

    if (!student.lastName) {
      errors.push({
        row: index + 2,
        field: "lastName",
        value: student.lastName,
        error: "Last name is required",
      });
    }

    if (!student.email) {
      errors.push({
        row: index + 2,
        field: "email",
        value: student.email,
        error: "Email is required",
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
      errors.push({
        row: index + 2,
        field: "email",
        value: student.email,
        error: "Invalid email format",
      });
    }

    if (!student.admissionNumber) {
      errors.push({
        row: index + 2,
        field: "admissionNumber",
        value: student.admissionNumber,
        error: "Admission number is required",
      });
    }

    if (student.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(student.dateOfBirth)) {
      errors.push({
        row: index + 2,
        field: "dateOfBirth",
        value: student.dateOfBirth,
        error: "Date of birth must be in YYYY-MM-DD format",
      });
    }

    return errors;
  };

  const importStudent = async (student: StudentRecord, classId?: string) => {
    try {
      // Create profile first
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: crypto.randomUUID(),
          first_name: student.firstName,
          last_name: student.lastName,
          email: student.email,
          phone: student.phone || null,
          date_of_birth: student.dateOfBirth || null,
          address: student.address || null,
          role: "student",
          school_id: schoolId,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create student record
      const { error: studentError } = await supabase
        .from("students")
        .insert({
          profile_id: profile.id,
          school_id: schoolId,
          class_id: classId || null,
          admission_number: student.admissionNumber,
          admission_date: student.admissionDate || new Date().toISOString().split('T')[0],
          blood_group: student.bloodGroup || null,
          emergency_contact_name: student.emergencyContactName || null,
          emergency_contact_phone: student.emergencyContactPhone || null,
          medical_conditions: student.medicalConditions || null,
        });

      if (studentError) throw studentError;

      return true;
    } catch (error) {
      console.error("Failed to import student:", error);
      return false;
    }
  };

  const handleImport = async (file: File) => {
    if (!user?.profile?.role || !["super_admin", "school_admin"].includes(user.profile.role)) {
      toast.error("Unauthorized: Admin privileges required");
      return;
    }

    setImporting(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      // Read file content
      const text = await file.text();
      const students = parseCSV(text);

      // Validate all students first
      const allErrors: ImportError[] = [];
      students.forEach((student, index) => {
        const errors = validateStudent(student, index);
        allErrors.push(...errors);
      });

      if (allErrors.length > 0) {
        setImportResult({
          totalRecords: students.length,
          successfulImports: 0,
          failedImports: students.length,
          errors: allErrors,
        });
        return;
      }

      // Get available classes for mapping
      const { data: classes } = await supabase
        .from("classes")
        .select("id, name, section")
        .eq("school_id", schoolId);

      // Create import log entry
      const { data: importLog, error: logError } = await supabase
        .from("bulk_import_logs")
        .insert({
          school_id: schoolId,
          imported_by: user.id,
          file_name: file.name,
          total_records: students.length,
          status: "processing",
        })
        .select()
        .single();

      if (logError) {
        console.warn("Failed to create import log:", logError);
      }

      // Import students one by one
      let successCount = 0;
      const importErrors: ImportError[] = [];

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        
        // Find matching class if specified
        let classId: string | undefined;
        if (student.className && student.section) {
          const matchingClass = classes?.find(
            c => c.name.toLowerCase().includes(student.className!.toLowerCase()) &&
                 c.section?.toLowerCase() === student.section?.toLowerCase()
          );
          classId = matchingClass?.id;
        }

        const success = await importStudent(student, classId);
        
        if (success) {
          successCount++;
        } else {
          importErrors.push({
            row: i + 2,
            field: "general",
            value: `${student.firstName} ${student.lastName}`,
            error: "Failed to create student record",
          });
        }

        setImportProgress(((i + 1) / students.length) * 100);
      }

      // Update import log
      if (importLog) {
        await supabase
          .from("bulk_import_logs")
          .update({
            successful_imports: successCount,
            failed_imports: students.length - successCount,
            status: successCount === students.length ? "completed" : "completed",
            completed_at: new Date().toISOString(),
            error_details: importErrors.length > 0 ? JSON.parse(JSON.stringify({ errors: importErrors })) : null,
          })
          .eq("id", importLog.id);
      }

      setImportResult({
        totalRecords: students.length,
        successfulImports: successCount,
        failedImports: students.length - successCount,
        errors: importErrors,
        importId: importLog?.id,
      });

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} students`);
      }
      if (importErrors.length > 0) {
        toast.error(`Failed to import ${importErrors.length} students`);
      }

    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Failed to import students: " + (error instanceof Error ? error.message : "Unknown error"));
      setImportResult({
        totalRecords: 0,
        successfulImports: 0,
        failedImports: 0,
        errors: [{
          row: 0,
          field: "file",
          value: file.name,
          error: error instanceof Error ? error.message : "Unknown error",
        }],
      });
    } finally {
      setImporting(false);
      setImportProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error("Please select a CSV file");
      return;
    }

    handleImport(file);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Student Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Upload a CSV file to import multiple students at once. Download the template first to ensure proper formatting.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>

            <div className="flex-1">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={importing}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {importing ? "Importing..." : "Upload CSV File"}
              </Button>
            </div>
          </div>

          {importing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing students...</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Import Results
              {importResult.failedImports === 0 ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Success
                </Badge>
              ) : importResult.successfulImports === 0 ? (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Failed
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Partial
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{importResult.totalRecords}</div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{importResult.successfulImports}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{importResult.failedImports}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-red-600">Import Errors:</h4>
                <div className="max-h-60 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importResult.errors.map((error, index) => (
                        <TableRow key={index}>
                          <TableCell>{error.row}</TableCell>
                          <TableCell>{error.field}</TableCell>
                          <TableCell className="max-w-32 truncate">{error.value}</TableCell>
                          <TableCell>{error.error}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}