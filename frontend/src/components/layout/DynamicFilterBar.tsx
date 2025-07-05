/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, X } from "lucide-react";
import { apiService } from "@/services/apiService";
import { useProcessMining } from "@/contexts/ProcessMiningContext"; // Import the context

interface FilterMetadata {
  name: string;
  type: "dropdown" | "range" | "date-range";
  options?: string[];
  min?: number;
  max?: number;
}

export function DynamicFilterBar() {
  const [filterConfigs, setFilterConfigs] = useState<FilterMetadata[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filterSelectValue, setFilterSelectValue] = useState("");

  // Get filters and setFilters directly from context
  const { filters, setFilters } = useProcessMining();

  useEffect(() => {
    const fetchFilterConfigs = async () => {
      try {
        // const storedData = localStorage.getItem("processedEventLog");
        const tableName = JSON.parse(localStorage.getItem("tableName"));
        if (tableName) {
          const config = await apiService.getFilterConf(tableName);
          setFilterConfigs(config);
        }
      } catch (error) {
        console.error("Failed to fetch filter configs:", error);
      }
    };

    fetchFilterConfigs();
  }, []);

  const handleFilterChange = (field: string, value: any, type: string) => {
    const updatedFilters = [...filters];
    const index = updatedFilters.findIndex((f) => f.field === field);

    if (index > -1) {
      updatedFilters[index] = { field, value, type };
    } else {
      updatedFilters.push({ field, value, type });
    }

    // Update context directly
    setFilters(updatedFilters);
  };

  const removeFilter = (field: string) => {
    const newFilters = filters.filter((f) => f.field !== field);
    setSelectedFields(selectedFields.filter((f) => f !== field));

    // Update context directly
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setSelectedFields([]);

    // Update context directly
    setFilters([]);
  };

  const renderFilter = (config: FilterMetadata) => {
    const activeFilter = filters.find((f) => f.field === config.name);

    return (
      <div key={config.name} className="flex space-y-1 relative">
        {config.type === "dropdown" && (
          <Select
            value={
              typeof activeFilter?.value === "string" ? activeFilter.value : ""
            }
            onValueChange={(value) =>
              handleFilterChange(config.name, value, config.type)
            }
          >
            <SelectTrigger
              className="h-8 w-[180px]"
              title={
                typeof activeFilter?.value === "string"
                  ? activeFilter.value
                  : `Select ${config.name}`
              }
            >
              <SelectValue placeholder={`Select ${config.name}`} />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {config.type === "range" && (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={`Min (${config.min})`}
              className="h-8 w-24"
              value={
                typeof activeFilter?.value === "object" &&
                activeFilter?.value &&
                "min" in activeFilter.value
                  ? (activeFilter.value as any).min || ""
                  : ""
              }
              onChange={(e) =>
                handleFilterChange(
                  config.name,
                  {
                    ...(typeof activeFilter?.value === "object" &&
                    activeFilter?.value
                      ? activeFilter.value
                      : {}),
                    min: Number(e.target.value) || undefined,
                  },
                  config.type
                )
              }
            />
            <Input
              type="number"
              placeholder={`Max (${config.max})`}
              className="h-8 w-24"
              value={
                typeof activeFilter?.value === "object" &&
                activeFilter?.value &&
                "max" in activeFilter.value
                  ? (activeFilter.value as any).max || ""
                  : ""
              }
              onChange={(e) =>
                handleFilterChange(
                  config.name,
                  {
                    ...(typeof activeFilter?.value === "object" &&
                    activeFilter?.value
                      ? activeFilter.value
                      : {}),
                    max: Number(e.target.value) || undefined,
                  },
                  config.type
                )
              }
            />
          </div>
        )}

        {config.type === "date-range" && (
          <div className="flex gap-2">
            <Input
              type="date"
              className="h-8 w-36"
              value={
                typeof activeFilter?.value === "object" &&
                activeFilter?.value &&
                "start" in activeFilter.value
                  ? (activeFilter.value as any).start || ""
                  : ""
              }
              onChange={(e) =>
                handleFilterChange(
                  config.name,
                  {
                    ...(typeof activeFilter?.value === "object" &&
                    activeFilter?.value
                      ? activeFilter.value
                      : {}),
                    start: e.target.value || undefined,
                  },
                  config.type
                )
              }
            />
            <Input
              type="date"
              className="h-8 w-36"
              value={
                typeof activeFilter?.value === "object" &&
                activeFilter?.value &&
                "end" in activeFilter.value
                  ? (activeFilter.value as any).end || ""
                  : ""
              }
              onChange={(e) =>
                handleFilterChange(
                  config.name,
                  {
                    ...(typeof activeFilter?.value === "object" &&
                    activeFilter?.value
                      ? activeFilter.value
                      : {}),
                    end: e.target.value || undefined,
                  },
                  config.type
                )
              }
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border mb-4">
      <CardContent className="p-4 space-y-4">
        {/* Filter Selection Dropdown */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Label className="text-sm font-medium">Choose Filter</Label>
          <Select
            value={filterSelectValue}
            onValueChange={(value) => {
              setSelectedFields([...selectedFields, value]);
              setFilterSelectValue(""); // Reset dropdown value
            }}
          >
            <SelectTrigger className="h-8 w-[220px] border-2 border-orange-500">
              <SelectValue placeholder="Choose Filter" />
            </SelectTrigger>
            <SelectContent>
              {filterConfigs
                .filter((config) => !selectedFields.includes(config.name))
                .map((config) => (
                  <SelectItem key={config.name} value={config.name}>
                    {config.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={clearAllFilters}
          >
            <RefreshCw size={14} className="mr-1" />
            Clear All
          </Button>
        </div>

        {/* Render Active Filters */}
        <div className="flex flex-wrap gap-4">
          {selectedFields.map((field) => {
            const config = filterConfigs.find((f) => f.name === field);
            return config ? (
              <div key={field} className="relative">
                <X
                  size={15}
                  className="absolute -top-1 -right-1 rounded-full z-10 bg-orange-200 cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => removeFilter(field)}
                />
                {renderFilter(config)}
              </div>
            ) : null;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
