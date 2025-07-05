import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings, Play, Square } from "lucide-react";
import { apiService } from "@/services/apiService";
import { useToast } from "@/components/ui/use-toast";

interface ActivityMappingProps {
  file: { name: string; data: any[]; columns: string[] };
  columnMapping: any;
  onMappingComplete: (mapping: any) => void;
}

export function ActivityMapping({
  file,
  columnMapping,
  onMappingComplete,
}: ActivityMappingProps) {
  const [activityMapping, setActivityMapping] = useState({
    startActivity: "",
    endActivity: "",
  });
  const [uniqueActivities, setUniqueActivities] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Extract unique activities from the data using the mapped activity column
    const activities = new Set<string>();
    file.data.forEach((row) => {
      const activity = row[columnMapping.activity];
      if (activity) {
        activities.add(activity);
      }
    });
    setUniqueActivities(Array.from(activities).sort());
  }, [file.data, columnMapping.activity]);

  const handleMappingChange = (field: string, value: string) => {
    setActivityMapping((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleComplete = async () => {
    setIsUploading(true);

    try {
      const completeMapping = {
        ...columnMapping,
        ...activityMapping,
      };

      // Create File object from the original file data
      const csvContent = [
        file.columns.join(","),
        ...file.data.map((row) =>
          file.columns.map((col) => row[col] || "").join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const fileObj = new File([blob], file.name, { type: "text/csv" });

      // Upload to backend
      const result = await apiService.uploadEventLog(fileObj, completeMapping);
      console.log("result", result);

      // Store configuration locally
      localStorage.setItem("processedEventLog", JSON.stringify(result));
      localStorage.setItem("tableName", JSON.stringify(result.tableName));

      toast({
        title: "Upload Successful",
        description: `Event log processed successfully. ${result.rowCount} records uploaded.`,
      });

      onMappingComplete(completeMapping);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload event log to backend. Please try again.",
        variant: "destructive",
      });

      // Fallback: store locally for now
      const completeMapping = {
        ...columnMapping,
        ...activityMapping,
      };

      const processConfig = {
        fileName: file.name,
        rowCount: file.data.length,
        columnCount: file.columns.length,
        columns: file.columns,
        mapping: completeMapping,
        timestamp: new Date().toISOString(),
        sampleData: file.data.slice(0, 5),
      };

      localStorage.setItem("processedEventLog", JSON.stringify(processConfig));
      onMappingComplete(completeMapping);
    } finally {
      setIsUploading(false);
    }
  };

  const isValid =
    activityMapping.startActivity &&
    activityMapping.endActivity &&
    !isUploading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Activity Mapping
        </CardTitle>
        <CardDescription>
          Define the start and end activities for your process analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Detected Activities</h4>
          <p className="text-sm text-muted-foreground mb-2">
            {uniqueActivities.length} unique activities found in your event log
          </p>
          <div className="max-h-24 overflow-y-auto">
            <div className="text-xs text-muted-foreground">
              {uniqueActivities.join(", ")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Play className="h-4 w-4 text-green-500" />
              Start Activity
            </Label>
            <Select
              value={activityMapping.startActivity}
              onValueChange={(value) =>
                handleMappingChange("startActivity", value)
              }
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select start activity" />
              </SelectTrigger>
              <SelectContent>
                {uniqueActivities.map((activity) => (
                  <SelectItem key={activity} value={activity}>
                    {activity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The activity that marks the beginning of your process
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Square className="h-4 w-4 text-red-500" />
              End Activity
            </Label>
            <Select
              value={activityMapping.endActivity}
              onValueChange={(value) =>
                handleMappingChange("endActivity", value)
              }
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select end activity" />
              </SelectTrigger>
              <SelectContent>
                {uniqueActivities.map((activity) => (
                  <SelectItem key={activity} value={activity}>
                    {activity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The activity that marks the completion of your process
            </p>
          </div>
        </div>

        {activityMapping.startActivity && activityMapping.endActivity && (
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
              Process Definition
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your process will be analyzed from "
              <strong>{activityMapping.startActivity}</strong>" to "
              <strong>{activityMapping.endActivity}</strong>"
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            disabled={isUploading}
          >
            Start Over
          </Button>
          <Button onClick={handleComplete} disabled={!isValid}>
            {isUploading
              ? "Uploading to Backend..."
              : "Complete Setup & View Dashboard"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
