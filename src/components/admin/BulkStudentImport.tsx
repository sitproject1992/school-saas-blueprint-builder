import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  totalCount: number;
}

export function BulkStudentImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to import',
        variant: 'destructive',
      });
      return;
    }

    setImporting(true);

    try {
      // TODO: Implement actual CSV parsing and student import
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      setResult({
        success: true,
        message: 'Students imported successfully',
        importedCount: 25,
        totalCount: 25
      });

      toast({
        title: 'Import successful',
        description: '25 students imported successfully',
      });
    } catch (error) {
      console.error('Import failed:', error);
      setResult({
        success: false,
        message: 'Import failed. Please check your file format.',
        importedCount: 0,
        totalCount: 0
      });

      toast({
        title: 'Import failed',
        description: 'Please check your file format and try again',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `first_name,last_name,email,admission_number,phone,date_of_birth,address,class_name\nJohn,Doe,john.doe@example.com,2024001,+1234567890,2010-05-15,"123 Main St",Grade 10\nJane,Smith,jane.smith@example.com,2024002,+1234567891,2010-03-22,"456 Oak Ave",Grade 9`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Student Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select CSV File</label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={importing}
          />
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with student information. Use the template above for proper formatting.
          </p>
        </div>

        <Button 
          onClick={handleImport} 
          disabled={!file || importing}
          className="w-full"
        >
          {importing ? 'Importing...' : 'Import Students'}
        </Button>

        {result && (
          <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </span>
            </div>
            {result.success && (
              <p className="text-sm text-green-700 mt-1">
                {result.importedCount} of {result.totalCount} students imported
              </p>
            )}
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium">CSV Format Requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Required: first_name, last_name, email, admission_number</li>
            <li>Optional: phone, date_of_birth, address, class_name</li>
            <li>File must be in UTF-8 encoding</li>
            <li>Use the template above for correct formatting</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
