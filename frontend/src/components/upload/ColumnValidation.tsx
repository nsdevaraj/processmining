
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ColumnValidationProps {
  file: { name: string; data: any[]; columns: string[] };
  onValidationComplete: (isValid: boolean, mapping: any) => void;
}

export function ColumnValidation({ file, onValidationComplete }: ColumnValidationProps) {
  const [columnMapping, setColumnMapping] = useState({
    caseId: '',
    activity: '',
    timestamp: ''
  });
  
  const [validationStatus, setValidationStatus] = useState({
    caseId: false,
    activity: false,
    timestamp: false
  });

  const requiredColumns = [
    { key: 'caseId', label: 'Case ID', description: 'Unique identifier for each process instance' },
    { key: 'activity', label: 'Activity', description: 'Name of the activity/event' },
    { key: 'timestamp', label: 'Timestamp', description: 'When the activity occurred' }
  ];

  useEffect(() => {
    // Auto-detect columns based on common naming patterns
    const autoMapping: any = {};
    
    file.columns.forEach(col => {
      const lowerCol = col.toLowerCase();
      if (lowerCol.includes('case') && lowerCol.includes('id')) {
        autoMapping.caseId = col;
      } else if (lowerCol.includes('activity') || lowerCol.includes('event')) {
        autoMapping.activity = col;
      } else if (lowerCol.includes('timestamp') || lowerCol.includes('time') || lowerCol.includes('date')) {
        autoMapping.timestamp = col;
      }
    });

    setColumnMapping(autoMapping);
  }, [file.columns]);

  useEffect(() => {
    setValidationStatus({
      caseId: !!columnMapping.caseId,
      activity: !!columnMapping.activity,
      timestamp: !!columnMapping.timestamp
    });
  }, [columnMapping]);

  const handleColumnChange = (columnType: string, value: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [columnType]: value
    }));
  };

  const isValid = Object.values(validationStatus).every(status => status);

  const handleContinue = () => {
    if (isValid) {
      onValidationComplete(true, columnMapping);
    }
  };

  const getValidationIcon = (isValid: boolean) => {
    if (isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Column Validation
        </CardTitle>
        <CardDescription>
          Map your CSV columns to the required process mining fields
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">File: {file.name}</h4>
          <p className="text-sm text-muted-foreground">
            {file.data.length} rows, {file.columns.length} columns detected
          </p>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">Available columns: </span>
            <span className="text-xs">{file.columns.join(', ')}</span>
          </div>
        </div>

        <div className="space-y-4">
          {requiredColumns.map(column => (
            <div key={column.key} className="space-y-2">
              <Label className="flex items-center gap-2">
                {getValidationIcon(validationStatus[column.key as keyof typeof validationStatus])}
                {column.label}
              </Label>
              <Select 
                value={columnMapping[column.key as keyof typeof columnMapping]} 
                onValueChange={(value) => handleColumnChange(column.key, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${column.label} column`} />
                </SelectTrigger>
                <SelectContent>
                  {file.columns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{column.description}</p>
            </div>
          ))}
        </div>

        {!isValid && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please map all required columns to continue with the analysis.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Upload Different File
          </Button>
          <Button onClick={handleContinue} disabled={!isValid}>
            Continue to Activity Mapping
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
