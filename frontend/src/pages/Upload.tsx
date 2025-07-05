/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/upload/FileUpload";
import { ColumnValidation } from "@/components/upload/ColumnValidation";
import { ActivityMapping } from "@/components/upload/ActivityMapping";
import {
  CheckCircle,
  Upload as UploadIcon,
  Settings,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProcessMining } from "@/contexts/ProcessMiningContext";
import { toast } from "sonner";

interface UploadedFile {
  name: string;
  data: any[];
  columns: string[];
}

export default function Upload() {
  const navigate = useNavigate();

  const { loadEventData } = useProcessMining();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [validationPassed, setValidationPassed] = useState(false);
  const [columnMapping, setColumnMapping] = useState({
    caseId: "",
    activity: "",
    timestamp: "",
  });
  // useEffect(() => {
  //   const tableName = JSON.parse(localStorage.getItem("tableName"));
  //   console.log(tableName);
  //   if (tableName) {
  //     navigate("/overview");
  //   }
  // }, []);
  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setCurrentStep(2);
  };

  const handleValidationComplete = (isValid: boolean, mapping: any) => {
    setValidationPassed(isValid);
    if (isValid) {
      setColumnMapping(mapping);
      setCurrentStep(3);
    }
  };

  const handleActivityMappingComplete = (mapping: any) => {
    // Combine column mapping with activity mapping
    const completeMapping = {
      ...columnMapping,
      ...mapping,
    };

    // Store only essential configuration data, not the entire file
    const processConfig = {
      fileName: uploadedFile?.name,
      rowCount: uploadedFile?.data.length,
      columnCount: uploadedFile?.columns.length,
      columns: uploadedFile?.columns,
      mapping: completeMapping,
      timestamp: new Date().toISOString(),
      sampleData: uploadedFile?.data.slice(0, 5), // Store only first 5 rows as sample
    };

    try {
      localStorage.setItem("processedEventLog", JSON.stringify(processConfig));
      console.log("Setup complete, navigating to overview...");
      loadEventData();
      // Navigate to the overview page
      navigate("/overview");
      toast.success("file uploaded successfully");
    } catch (error) {
      console.error("Error saving configuration:", error);
      // Even if storage fails, still navigate to overview
      navigate("/");
    }
  };

  const steps = [
    {
      number: 1,
      title: "Upload File",
      icon: UploadIcon,
      active: currentStep >= 1,
      completed: currentStep > 1,
    },
    {
      number: 2,
      title: "Validate Columns",
      icon: CheckCircle,
      active: currentStep >= 2,
      completed: currentStep > 2,
    },
    {
      number: 3,
      title: "Map Activities",
      icon: Settings,
      active: currentStep >= 3,
      completed: currentStep > 3,
    },
    {
      number: 4,
      title: "Dashboard",
      icon: BarChart3,
      active: false,
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Process Mining Setup</h1>
          <p className="text-muted-foreground">
            Upload your event log file and configure the analysis parameters
          </p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step.completed
                        ? "bg-primary border-primary text-primary-foreground"
                        : step.active
                        ? "border-primary text-primary"
                        : "border-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon size={20} />
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        step.active
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-px mx-4 ${
                        step.completed ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {currentStep === 1 && <FileUpload onFileUpload={handleFileUpload} />}

        {currentStep === 2 && uploadedFile && (
          <ColumnValidation
            file={uploadedFile}
            onValidationComplete={handleValidationComplete}
          />
        )}

        {currentStep === 3 && uploadedFile && validationPassed && (
          <ActivityMapping
            file={uploadedFile}
            columnMapping={columnMapping}
            onMappingComplete={handleActivityMappingComplete}
          />
        )}
      </div>
    </div>
  );
}
