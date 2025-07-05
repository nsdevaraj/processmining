
// Mock data commented out - now using backend API
/*
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
}

export const mockEventLogData: EventLogEntry[] = [
  // ... mock data entries commented out
];
*/

// Export empty for now - data comes from backend
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
  [key: string]: any; // Allow dynamic fields from uploaded CSV
}

export const mockEventLogData: EventLogEntry[] = [];
