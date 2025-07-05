/* eslint-disable @typescript-eslint/no-explicit-any */
// API service for backend communication
const API_BASE_URL = "http://localhost:8000";

type TrendDirection = "up" | "down" | "neutral";

interface Metric {
  value: number;
  trend: number;
  trendDirection: TrendDirection;
  changeText: string;
  unit: string;
  previousValue?: number;
}

export interface ChartEntry {
  month: string; // e.g., "2024-08"
  volume: number;
  leadTime: number;
  month_num: number;
}

export interface ProcessBreakChart {
  name: string;
  [key: string]: string | number;
}

export interface DashboardData {
  avgLeadTime: Metric;
  onTimeDelivery: Metric;
  totalCases: Metric;
  activeCases: Metric;
  completedCases: Metric;
  chartData: {
    averageLeadTime: ChartEntry[];
    processBreakOut: ProcessBreakChart[];
    processVariants: ProcessBreakChart[];
    bottleNeck: ProcessBreakChart[];
  };
}

export interface ProcessedEventLog {
  fileName: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  mapping: any;
  timestamp: string;
  sampleData: any[];
  tableName: string;
}

export interface EventLogEntry {
  case_id: string;
  activity: string;
  timestamp: string;
  resource?: string;
  cost?: number;
  region?: string;
  material_group?: string;
  company?: string;
  status?: string;
  duration_days?: number;
  [key: string]: any; // Allow dynamic fields
}

export interface FilterRequest {
  filters: any[];
  dateRange?: {
    start: string;
    end: string;
  };
}
export interface MetricWithTrend {
  value: number;
  trend: number; // Percentage change from previous period
  trendDirection: "up" | "down" | "neutral";
  changeText: string; // Human-readable change description
  previousValue?: number;
  unit: string; // e.g., 'days', '%', 'cases'
}

export interface ProcessMetrics {
  totalCases: MetricWithTrend;
  completedCases: MetricWithTrend;
  avgLeadTime: MetricWithTrend;
  onTimeDelivery: MetricWithTrend;
  reworkRate: MetricWithTrend;
  totalEvents: MetricWithTrend;
  chartData: {
    averageLeadTime: leadTimeData[];
  };
}

export type leadTimeData = {
  month: string;
  volume: number;
  leadTime: number;
};
class APIService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Upload and process CSV file
  async uploadEventLog(
    file: File,
    columnMapping: any
  ): Promise<ProcessedEventLog> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mapping", JSON.stringify(columnMapping));

    return this.makeRequest<ProcessedEventLog>("/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getFilterConf(tableName: string): Promise<any[]> {
    // console.log(tableName);
    //  const tableName = "event_log"
    const endpoint = "/filters";
    return this.makeRequest<[]>(endpoint, {
      method: "POST",
      body: JSON.stringify({ tableName }),
    });
  }
  // Get event log data with filters
  async getOverviewData(filters?: FilterRequest): Promise<DashboardData> {
    console.log(filters);

    const tableName = JSON.parse(localStorage.getItem("tableName"));
    const endpoint = `/overview?tableName=${tableName}`;

    if (filters) {
      return this.makeRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(filters),
      });
    }

    return this.makeRequest<DashboardData>(endpoint);
  }

  // Get process metrics
  async getProcessMetrics(filters?: FilterRequest): Promise<ProcessMetrics> {
    const endpoint = "/metrics";

    if (filters) {
      return this.makeRequest<ProcessMetrics>(endpoint, {
        method: "POST",
        body: JSON.stringify(filters),
      });
    }

    return this.makeRequest<ProcessMetrics>(endpoint);
  }

  // Get filter configurations based on uploaded data
  async getFilterConfigs(): Promise<any[]> {
    return this.makeRequest<any[]>("/filter-configs");
  }

  // Get chart data for various visualizations
  async getChartData(chartType: string, filters?: FilterRequest): Promise<any> {
    const endpoint = `/charts/${chartType}`;

    if (filters) {
      return this.makeRequest<any>(endpoint, {
        method: "POST",
        body: JSON.stringify(filters),
      });
    }

    return this.makeRequest<any>(endpoint);
  }

  // Get process flow data
  async getProcessFlowData(filters?: FilterRequest): Promise<any> {
    const endpoint = "/process-flow";

    if (filters) {
      return this.makeRequest<any>(endpoint, {
        method: "POST",
        body: JSON.stringify(filters),
      });
    }

    return this.makeRequest<any>(endpoint);
  }

  // Get conformance data
  async getConformanceData(filters?: FilterRequest): Promise<any> {
    const endpoint = "/conformance";

    if (filters) {
      return this.makeRequest<any>(endpoint, {
        method: "POST",
        body: JSON.stringify(filters),
      });
    }

    return this.makeRequest<any>(endpoint);
  }

  // Get lead time analysis
  async getLeadTimeData(filters?: FilterRequest): Promise<any> {
    const endpoint = "/lead-time";

    if (filters) {
      return this.makeRequest<any>(endpoint, {
        method: "POST",
        body: JSON.stringify(filters),
      });
    }

    return this.makeRequest<any>(endpoint);
  }

  // Get root cause analysis
  async getRootCauseData(filters?: FilterRequest): Promise<any> {
    const endpoint = "/root-causes";

    if (filters) {
      return this.makeRequest<any>(endpoint, {
        method: "POST",
        body: JSON.stringify(filters),
      });
    }

    return this.makeRequest<any>(endpoint);
  }

  // Get case replay data
  async getCaseReplayData(caseId: string): Promise<any> {
    return this.makeRequest<any>(`/case-replay/${caseId}`);
  }

  // Health check
  // async healthCheck(): Promise<{ status: string }> {
  //   return this.makeRequest<{ status: string }>("/health");
  // }
}

export const apiService = new APIService();
