import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadProps {
  onFileUpload: (file: { name: string; data: any[]; columns: string[] }) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    return { headers, data };
  };

  const validateRequiredColumns = (columns: string[]) => {
    const lowerColumns = columns.map(col => col.toLowerCase());
    const hasCase = lowerColumns.some(col => col.includes('case') && col.includes('id'));
    const hasActivity = lowerColumns.some(col => col.includes('activity') || col.includes('event'));
    const hasTimestamp = lowerColumns.some(col => col.includes('timestamp') || col.includes('time') || col.includes('date'));
    
    return { hasCase, hasActivity, hasTimestamp };
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file only');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const { headers, data } = parseCSV(text);
      
      if (data.length === 0) {
        setError('The CSV file appears to be empty');
        return;
      }

      // Validate required columns
      const { hasCase, hasActivity, hasTimestamp } = validateRequiredColumns(headers);
      
      if (!hasCase || !hasActivity || !hasTimestamp) {
        const missing = [];
        if (!hasCase) missing.push('Case ID');
        if (!hasActivity) missing.push('Activity');
        if (!hasTimestamp) missing.push('Timestamp');
        
        setError(`Missing required columns: ${missing.join(', ')}. Please ensure your CSV has columns for case_id, activity, and timestamp.`);
        return;
      }

      onFileUpload({
        name: file.name,
        data: data,
        columns: headers
      });
    } catch (err) {
      setError('Error reading the file. Please ensure it\'s a valid CSV file.');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Event Log CSV
        </CardTitle>
        <CardDescription>
          Upload your process mining data with required columns: case_id, activity, timestamp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground">.CSV files only</p>
          </div>
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isProcessing}
          />
          <Button 
            asChild 
            className="mt-4"
            disabled={isProcessing}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {isProcessing ? 'Processing...' : 'Upload and Continue'}
            </label>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Required Columns
          </h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• <strong>Case ID:</strong> Unique identifier for each process instance</p>
            <p>• <strong>Activity:</strong> Name of the activity or event</p>
            <p>• <strong>Timestamp:</strong> When the activity occurred</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
