/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  apiService,
  DashboardData,
  // EventLogEntry,
  // ProcessMetrics,
} from "@/services/apiService";

// Remove filterService import - we're going direct
// import { filterService, ActiveFilter } from "@/services/filterService";

// Define ActiveFilter interface directly in context
export interface ActiveFilter {
  field: string;
  value:
    | string
    | string[]
    | { min?: number; max?: number }
    | { start?: string; end?: string }; // Changed Date to string for date inputs
  type: string;
}

interface ProcessMiningContextType {
  overviewData: DashboardData;
  // filteredData: EventLogEntry[];
  filters: ActiveFilter[];
  setFilters: (filters: ActiveFilter[]) => void;
  // processMetrics: ProcessMetrics;
  hasUploadedData: boolean;
  isLoading: boolean;
  error: string | null;
  // refreshData: () => void;
  loadEventData: () => void;
}

const ProcessMiningContext = createContext<
  ProcessMiningContextType | undefined
>(undefined);

// export function ProcessMiningProvider({ children }: { children: ReactNode }) {
//   const [overviewData, setOverviewData] = useState<DashboardData>();
//   // const [filteredData, setFilteredData] = useState<EventLogEntry[]>([]);
//   const [filters, setFilters] = useState<ActiveFilter[]>([]);
//   const [hasUploadedData, setHasUploadedData] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   // const [processMetrics, setProcessMetrics] = useState<ProcessMetrics>();

//   const loadEventData = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Check if there's uploaded data configuration
//       let storedConfig;
//       try {
//         storedConfig = localStorage.getItem("processedEventLog");
//       } catch (e) {
//         console.warn("LocalStorage not available:", e);
//         storedConfig = null;
//       }

//       if (storedConfig) {
//         setHasUploadedData(true);

//         // Load data from backend API
//         const data = await apiService.getOverviewData();
//         console.log("Loaded event data from backend:", data, "records");
//         setOverviewData(data.processMetrics);
//       } else {
//         // Try to load data anyway - maybe it exists in backend
//         try {
//           const data = await apiService.getOverviewData();
//           if (data) {
//             setOverviewData(data);
//             setHasUploadedData(true);
//             console.log("Found existing data in backend:", data, "records");
//           } else {
//             setOverviewData(null);
//             setHasUploadedData(false);
//             console.log("No data found in backend");
//           }
//         } catch (dataErr) {
//           // No data available
//           setOverviewData(null);
//           setHasUploadedData(false);
//           console.log("No uploaded data found");
//         }
//       }
//     } catch (err: any) {
//       console.error("Error loading event data:", err);
//       setError(`Failed to load event data: ${err.message}`);
//       setOverviewData(null);
//       setHasUploadedData(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const loadProcessMetrics = async () => {
//   //   if (!hasUploadedData) {
//   //     return;
//   //   }

//   //   try {
//   //     const metricsFilter =
//   //       filters.length > 0
//   //         ? {
//   //             filters: filters.map((f) => ({
//   //               field: f.field,
//   //               value: f.value,
//   //               type: f.type,
//   //             })),
//   //           }
//   //         : undefined;

//   //     const metrics = await apiService.getProcessMetrics(metricsFilter);
//   //     setProcessMetrics(metrics);
//   //   } catch (err) {
//   //     console.error("Error loading process metrics:", err);
//   //     // Keep existing metrics on error
//   //   }
//   // };

//   const applyFilters = async () => {
//     console.log("applyFilters", filters);

//     // if (!hasUploadedData || overviewData) {
//     //   // overviewData();
//     //   return;
//     // }

//     try {
//       if (filters.length > 0) {
//         // Get filtered data from backend
//         const filterRequest = {
//           filters: filters.map((f) => ({
//             field: f.field,
//             value: f.value,
//             type: f.type,
//           })),
//         };
//         console.log(
//           "Sending filter request:",
//           JSON.stringify(filterRequest, null, 2)
//         );
//         const filtered = await apiService.getOverviewData(filterRequest);
//         setOverviewData(filtered);
//       } else {
//         // No filters, use all data
//         setOverviewData(overviewData);
//       }
//     } catch (err) {
//       console.error("Error applying filters:", err);
//       // Fallback to all data on error
//       setOverviewData(overviewData);
//     }
//   };

//   // const refreshData = () => {
//   //   loadEventData();
//   // };

//   // Update filtered data when filters change
//   useEffect(() => {
//     applyFilters();
//   }, [filters, hasUploadedData]);

//   // // Update metrics when filtered data changes
//   // useEffect(() => {
//   //   if (filteredData.length > 0 || hasUploadedData) {
//   //     loadProcessMetrics();
//   //   }
//   // }, [filteredData, hasUploadedData, filters]);

//   return (
//     <ProcessMiningContext.Provider
//       value={{
//         overviewData,
//         // filteredData,
//         filters,
//         setFilters, // This is what your DynamicFilterBar will use
//         // processMetrics,
//         hasUploadedData,
//         isLoading,
//         error,
//         // refreshData,
//         loadEventData,
//       }}
//     >
//       {children}
//     </ProcessMiningContext.Provider>
//   );
// }

export function ProcessMiningProvider({ children }: { children: ReactNode }) {
  const [overviewData, setOverviewData] = useState<DashboardData>();
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [hasUploadedData, setHasUploadedData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEventData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if there's uploaded data configuration
      let storedConfig;
      try {
        storedConfig = localStorage.getItem("processedEventLog");
      } catch (e) {
        console.warn("LocalStorage not available:", e);
        storedConfig = null;
      }

      if (storedConfig) {
        setHasUploadedData(true);

        // Load data from backend API
        const data = await apiService.getOverviewData();
        console.log("Loaded event data from backend:", data);
        // FIX: Consistent data structure handling
        const processData = data.processMetrics || data;
        setOverviewData(processData);
      } else {
        // Try to load data anyway - maybe it exists in backend
        try {
          const data = await apiService.getOverviewData();
          if (data) {
            // FIX: Consistent data structure handling
            const processData = data.processMetrics || data;
            setOverviewData(processData);
            setHasUploadedData(true);
            console.log("Found existing data in backend:", processData);
          } else {
            setOverviewData(null);
            setHasUploadedData(false);
            console.log("No data found in backend");
          }
        } catch (dataErr) {
          // No data available
          setOverviewData(null);
          setHasUploadedData(false);
          console.log("No uploaded data found");
        }
      }
    } catch (err: any) {
      console.error("Error loading event data:", err);
      setError(`Failed to load event data: ${err.message}`);
      setOverviewData(null);
      setHasUploadedData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = async () => {
    console.log("applyFilters called with filters:", filters);

    if (!hasUploadedData) {
      console.log("No uploaded data, skipping filter application");
      return;
    }

    try {
      let data;
      if (filters.length > 0) {
        // Get filtered data from backend
        const filterRequest = {
          filters: filters.map((f) => ({
            field: f.field,
            value: f.value,
            type: f.type,
          })),
        };
        console.log(
          "Sending filter request:",
          JSON.stringify(filterRequest, null, 2)
        );
        data = await apiService.getOverviewData(filterRequest);
        console.log("Filtered data received:", data);
      } else {
        // No filters, get fresh unfiltered data
        console.log("No filters, loading fresh unfiltered data");
        data = await apiService.getOverviewData();
        console.log("Unfiltered data received:", data);
      }

      // FIX: Consistent data structure handling
      const processData = data.processMetrics || data;
      console.log("Setting overview data:", processData);
      setOverviewData(processData);
    } catch (err) {
      console.error("Error applying filters:", err);
      // FIX: On error, reload original data instead of setting to current state
      try {
        const originalData = await apiService.getOverviewData();
        const processData = originalData.processMetrics || originalData;
        setOverviewData(processData);
      } catch (fallbackErr) {
        console.error("Fallback data loading failed:", fallbackErr);
      }
    }
  };

  // FIX: Only apply filters when filters actually change, and hasUploadedData is true
  useEffect(() => {
    if (hasUploadedData) {
      console.log("Filters changed, applying filters:", filters);
      applyFilters();
    }
  }, [filters]); // Removed hasUploadedData from dependencies to prevent loop

  // FIX: Separate effect for when data is first loaded
  useEffect(() => {
    if (hasUploadedData && filters.length === 0) {
      console.log("Data uploaded and no filters, loading initial data");
      // Don't call applyFilters here as it will be handled by the filters effect
    }
  }, [hasUploadedData]);

  return (
    <ProcessMiningContext.Provider
      value={{
        overviewData,
        filters,
        setFilters,
        hasUploadedData,
        isLoading,
        error,
        loadEventData,
      }}
    >
      {children}
    </ProcessMiningContext.Provider>
  );
}
export function useProcessMining() {
  const context = useContext(ProcessMiningContext);
  if (context === undefined) {
    throw new Error(
      "useProcessMining must be used within a ProcessMiningProvider"
    );
  }
  return context;
}
