// import { EventLogEntry } from "@/data/mockEventLogData"; // Commented out mock data import
import { EventLogEntry } from "@/services/apiService";

export interface FilterConfig {
  field: string;
  label: string;
  type: "select" | "multiselect" | "daterange" | "number";
  options?: string[];
  min?: number;
  max?: number;
}

export interface ActiveFilter {
  field: string;
  value:
    | string
    | string[]
    | { min?: number; max?: number }
    | { start?: Date; end?: Date };
  type: string;
}

export class DynamicFilterService {
  private data: EventLogEntry[] = [];
  private filterConfigs: FilterConfig[] = [];

  setData(data: EventLogEntry[]) {
    this.data = data;
    console.log(this.data);
    // Only generate configs if not provided by backend
    if (this.filterConfigs.length === 0) {
      this.generateFilterConfigs();
    }
  }

  // Set filter configurations from backend
  setFilterConfigs(configs: FilterConfig[]) {
    this.filterConfigs = configs;
  }

  // Fallback method to generate filter configs from data
  private generateFilterConfigs() {
    if (this.data.length === 0) return;

    const sample = this.data[0];
    this.filterConfigs = [];

    // Analyze each field in the data to determine appropriate filter type
    Object.keys(sample).forEach((field) => {
      const values = this.data.map(
        (entry) => entry[field as keyof EventLogEntry]
      );
      const uniqueValues = [...new Set(values)].filter((v) => v != null);

      if (field === "timestamp") {
        this.filterConfigs.push({
          field,
          label: "Date Range",
          type: "daterange",
        });
      } else if (typeof values[0] === "number") {
        const numValues = values.filter(
          (v) => typeof v === "number"
        ) as number[];
        this.filterConfigs.push({
          field,
          label: this.formatLabel(field),
          type: "number",
          min: Math.min(...numValues),
          max: Math.max(...numValues),
        });
      } else if (uniqueValues.length <= 20) {
        // If there are 20 or fewer unique values, make it a select filter
        this.filterConfigs.push({
          field,
          label: this.formatLabel(field),
          type: uniqueValues.length <= 5 ? "select" : "multiselect",
          options: uniqueValues.map(String).sort(),
        });
      }
    });

    // Remove case_id from filters as it's not useful for filtering
    this.filterConfigs = this.filterConfigs.filter(
      (config) => config.field !== "case_id"
    );
  }

  private formatLabel(field: string): string {
    return field
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  getFilterConfigs(): FilterConfig[] {
    return this.filterConfigs;
  }

  applyFilters(filters: ActiveFilter[]): EventLogEntry[] {
    if (filters.length === 0) return this.data;

    return this.data.filter((entry) => {
      return filters.every((filter) => {
        const fieldValue = entry[filter.field as keyof EventLogEntry];

        switch (filter.type) {
          case "select":
            return filter.value === "All" || fieldValue === filter.value;

          case "multiselect":
            if (!Array.isArray(filter.value)) return true;
            return (
              filter.value.length === 0 ||
              filter.value.includes(String(fieldValue))
            );

          case "number":
            if (typeof filter.value !== "object" || Array.isArray(filter.value))
              return true;
            const numValue = Number(fieldValue);
            const { min, max } = filter.value as { min?: number; max?: number };
            return (
              (min === undefined || numValue >= min) &&
              (max === undefined || numValue <= max)
            );

          case "daterange":
            if (typeof filter.value !== "object" || Array.isArray(filter.value))
              return true;
            const entryDate = new Date(String(fieldValue));
            const { start, end } = filter.value as { start?: Date; end?: Date };
            return (
              (start === undefined || entryDate >= start) &&
              (end === undefined || entryDate <= end)
            );

          default:
            return true;
        }
      });
    });
  }

  getFilterStats(filters: ActiveFilter[]): {
    totalRecords: number;
    filteredRecords: number;
  } {
    const filteredData = this.applyFilters(filters);
    return {
      totalRecords: this.data.length,
      filteredRecords: filteredData.length,
    };
  }
}

export const filterService = new DynamicFilterService();
