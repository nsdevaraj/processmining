// Mock event log data based on the provided example
export interface EventLogEntry {
  case_id: string;
  activity: string;
  company: string;
  region: string;
  material_group: string;
  payment_term: string;
  variant: string;
  timestamp: string;
}

export const eventLogData: EventLogEntry[] = [
  // Standard path cases
  { case_id: "aa091dbf-1dc9-45c1", activity: "Receive Purchase Order", company: "Dystone India Ltd", region: "Asia-Pacific", material_group: "Power Tools", payment_term: "60 days from date of invoice", variant: "standard_path", timestamp: "12/03/2024" },
  { case_id: "aa091dbf-1dc9-45c1", activity: "Create Sales Order", company: "Dystone India Ltd", region: "Asia-Pacific", material_group: "Power Tools", payment_term: "60 days from date of invoice", variant: "standard_path", timestamp: "12/03/2024" },
  { case_id: "aa091dbf-1dc9-45c1", activity: "Create Delivery", company: "Dystone India Ltd", region: "Asia-Pacific", material_group: "Power Tools", payment_term: "60 days from date of invoice", variant: "standard_path", timestamp: "13/03/2024" },
  { case_id: "aa091dbf-1dc9-45c1", activity: "Create Shipment", company: "Dystone India Ltd", region: "Asia-Pacific", material_group: "Power Tools", payment_term: "60 days from date of invoice", variant: "standard_path", timestamp: "15/03/2024" },
  { case_id: "aa091dbf-1dc9-45c1", activity: "Issue Goods", company: "Dystone India Ltd", region: "Asia-Pacific", material_group: "Power Tools", payment_term: "60 days from date of invoice", variant: "standard_path", timestamp: "18/03/2024" },
  { case_id: "aa091dbf-1dc9-45c1", activity: "Create Invoice", company: "Dystone India Ltd", region: "Asia-Pacific", material_group: "Power Tools", payment_term: "60 days from date of invoice", variant: "standard_path", timestamp: "18/03/2024" },
  { case_id: "aa091dbf-1dc9-45c1", activity: "Clear Invoice", company: "Dystone India Ltd", region: "Asia-Pacific", material_group: "Power Tools", payment_term: "60 days from date of invoice", variant: "standard_path", timestamp: "19/03/2024" },

  // Material change path
  { case_id: "9a576137-cb6e-4eb1", activity: "Receive Purchase Order", company: "Dystone Spain Co", region: "Europe", material_group: "Fertilizers", payment_term: "30 days from date of invoice", variant: "material_change_path", timestamp: "17/01/2024" },
  { case_id: "9a576137-cb6e-4eb1", activity: "Create Sales Order", company: "Dystone Spain Co", region: "Europe", material_group: "Fertilizers", payment_term: "30 days from date of invoice", variant: "material_change_path", timestamp: "17/01/2024" },
  { case_id: "9a576137-cb6e-4eb1", activity: "Change Material", company: "Dystone Spain Co", region: "Europe", material_group: "Fertilizers", payment_term: "30 days from date of invoice", variant: "material_change_path", timestamp: "18/01/2024" },
  { case_id: "9a576137-cb6e-4eb1", activity: "Create Delivery", company: "Dystone Spain Co", region: "Europe", material_group: "Fertilizers", payment_term: "30 days from date of invoice", variant: "material_change_path", timestamp: "20/01/2024" },
  { case_id: "9a576137-cb6e-4eb1", activity: "Create Shipment", company: "Dystone Spain Co", region: "Europe", material_group: "Fertilizers", payment_term: "30 days from date of invoice", variant: "material_change_path", timestamp: "22/01/2024" },
  { case_id: "9a576137-cb6e-4eb1", activity: "Issue Goods", company: "Dystone Spain Co", region: "Europe", material_group: "Fertilizers", payment_term: "30 days from date of invoice", variant: "material_change_path", timestamp: "25/01/2024" },
  { case_id: "9a576137-cb6e-4eb1", activity: "Create Invoice", company: "Dystone Spain Co", region: "Europe", material_group: "Fertilizers", payment_term: "30 days from date of invoice", variant: "material_change_path", timestamp: "25/01/2024" },
  { case_id: "9a576137-cb6e-4eb1", activity: "Clear Invoice", company: "Dystone Spain Co", region: "Europe", material_group: "Fertilizers", payment_term: "30 days from date of invoice", variant: "material_change_path", timestamp: "26/01/2024" },

  // More sample cases across different companies and regions
  { case_id: "bb123def-2ec8-56d2", activity: "Receive Purchase Order", company: "GlobalTech USA", region: "Americas", material_group: "Electronics", payment_term: "45 days from date of invoice", variant: "standard_path", timestamp: "05/02/2024" },
  { case_id: "bb123def-2ec8-56d2", activity: "Create Sales Order", company: "GlobalTech USA", region: "Americas", material_group: "Electronics", payment_term: "45 days from date of invoice", variant: "standard_path", timestamp: "05/02/2024" },
  { case_id: "bb123def-2ec8-56d2", activity: "Create Delivery", company: "GlobalTech USA", region: "Americas", material_group: "Electronics", payment_term: "45 days from date of invoice", variant: "standard_path", timestamp: "07/02/2024" },
  { case_id: "bb123def-2ec8-56d2", activity: "Create Shipment", company: "GlobalTech USA", region: "Americas", material_group: "Electronics", payment_term: "45 days from date of invoice", variant: "standard_path", timestamp: "08/02/2024" },
  { case_id: "bb123def-2ec8-56d2", activity: "Issue Goods", company: "GlobalTech USA", region: "Americas", material_group: "Electronics", payment_term: "45 days from date of invoice", variant: "standard_path", timestamp: "10/02/2024" },
  { case_id: "bb123def-2ec8-56d2", activity: "Create Invoice", company: "GlobalTech USA", region: "Americas", material_group: "Electronics", payment_term: "45 days from date of invoice", variant: "standard_path", timestamp: "10/02/2024" },
  { case_id: "bb123def-2ec8-56d2", activity: "Clear Invoice", company: "GlobalTech USA", region: "Americas", material_group: "Electronics", payment_term: "45 days from date of invoice", variant: "standard_path", timestamp: "11/02/2024" },

  // Exceptional case with rework
  { case_id: "cc234ghi-3fd9-67e3", activity: "Receive Purchase Order", company: "EuroManufacturing GmbH", region: "Europe", material_group: "Raw Materials", payment_term: "90 days from date of invoice", variant: "rework_path", timestamp: "10/03/2024" },
  { case_id: "cc234ghi-3fd9-67e3", activity: "Create Sales Order", company: "EuroManufacturing GmbH", region: "Europe", material_group: "Raw Materials", payment_term: "90 days from date of invoice", variant: "rework_path", timestamp: "10/03/2024" },
  { case_id: "cc234ghi-3fd9-67e3", activity: "Quality Check Failed", company: "EuroManufacturing GmbH", region: "Europe", material_group: "Raw Materials", payment_term: "90 days from date of invoice", variant: "rework_path", timestamp: "12/03/2024" },
  { case_id: "cc234ghi-3fd9-67e3", activity: "Rework Material", company: "EuroManufacturing GmbH", region: "Europe", material_group: "Raw Materials", payment_term: "90 days from date of invoice", variant: "rework_path", timestamp: "14/03/2024" },
  { case_id: "cc234ghi-3fd9-67e3", activity: "Create Delivery", company: "EuroManufacturing GmbH", region: "Europe", material_group: "Raw Materials", payment_term: "90 days from date of invoice", variant: "rework_path", timestamp: "16/03/2024" },
  { case_id: "cc234ghi-3fd9-67e3", activity: "Create Shipment", company: "EuroManufacturing GmbH", region: "Europe", material_group: "Raw Materials", payment_term: "90 days from date of invoice", variant: "rework_path", timestamp: "18/03/2024" },
  { case_id: "cc234ghi-3fd9-67e3", activity: "Issue Goods", company: "EuroManufacturing GmbH", region: "Europe", material_group: "Raw Materials", payment_term: "90 days from date of invoice", variant: "rework_path", timestamp: "20/03/2024" },
  { case_id: "cc234ghi-3fd9-67e3", activity: "Create Invoice", company: "EuroManufacturing GmbH", region: "Europe", material_group: "Raw Materials", payment_term: "90 days from date of invoice", variant: "rework_path", timestamp: "20/03/2024" },
  { case_id: "cc234ghi-3fd9-67e3", activity: "Clear Invoice", company: "EuroManufacturing GmbH", region: "Europe", material_group: "Raw Materials", payment_term: "90 days from date of invoice", variant: "rework_path", timestamp: "22/03/2024" },

  // Additional cases for better data variety
  { case_id: "dd345jkl-4ge0-78f4", activity: "Receive Purchase Order", company: "AsiaTech Pte Ltd", region: "Asia-Pacific", material_group: "Components", payment_term: "30 days from date of invoice", variant: "express_path", timestamp: "01/04/2024" },
  { case_id: "dd345jkl-4ge0-78f4", activity: "Express Processing", company: "AsiaTech Pte Ltd", region: "Asia-Pacific", material_group: "Components", payment_term: "30 days from date of invoice", variant: "express_path", timestamp: "01/04/2024" },
  { case_id: "dd345jkl-4ge0-78f4", activity: "Create Sales Order", company: "AsiaTech Pte Ltd", region: "Asia-Pacific", material_group: "Components", payment_term: "30 days from date of invoice", variant: "express_path", timestamp: "01/04/2024" },
  { case_id: "dd345jkl-4ge0-78f4", activity: "Create Delivery", company: "AsiaTech Pte Ltd", region: "Asia-Pacific", material_group: "Components", payment_term: "30 days from date of invoice", variant: "express_path", timestamp: "02/04/2024" },
  { case_id: "dd345jkl-4ge0-78f4", activity: "Create Shipment", company: "AsiaTech Pte Ltd", region: "Asia-Pacific", material_group: "Components", payment_term: "30 days from date of invoice", variant: "express_path", timestamp: "02/04/2024" },
  { case_id: "dd345jkl-4ge0-78f4", activity: "Issue Goods", company: "AsiaTech Pte Ltd", region: "Asia-Pacific", material_group: "Components", payment_term: "30 days from date of invoice", variant: "express_path", timestamp: "03/04/2024" },
  { case_id: "dd345jkl-4ge0-78f4", activity: "Create Invoice", company: "AsiaTech Pte Ltd", region: "Asia-Pacific", material_group: "Components", payment_term: "30 days from date of invoice", variant: "express_path", timestamp: "03/04/2024" },
  { case_id: "dd345jkl-4ge0-78f4", activity: "Clear Invoice", company: "AsiaTech Pte Ltd", region: "Asia-Pacific", material_group: "Components", payment_term: "30 days from date of invoice", variant: "express_path", timestamp: "04/04/2024" },
];

// Extract unique values for filters
export const getUniqueCompanies = () => [...new Set(eventLogData.map(entry => entry.company))];
export const getUniqueRegions = () => [...new Set(eventLogData.map(entry => entry.region))];
export const getUniqueMaterialGroups = () => [...new Set(eventLogData.map(entry => entry.material_group))];
export const getUniqueVariants = () => [...new Set(eventLogData.map(entry => entry.variant))];
export const getUniqueActivities = () => [...new Set(eventLogData.map(entry => entry.activity))];

// Helper function to filter event log data
export const filterEventLogData = (filters: {
  region?: string;
  company?: string;
  materialGroup?: string;
  variant?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}) => {
  return eventLogData.filter(entry => {
    if (filters.region && filters.region !== "All" && entry.region !== filters.region) return false;
    if (filters.company && filters.company !== "All" && entry.company !== filters.company) return false;
    if (filters.materialGroup && filters.materialGroup !== "All" && entry.material_group !== filters.materialGroup) return false;
    if (filters.variant && filters.variant !== "All" && entry.variant !== filters.variant) return false;
    
    // Date filtering would need proper date parsing
    // For now, keeping it simple
    
    return true;
  });
};

// Calculate process metrics from event log data
export const calculateProcessMetrics = (filteredData: EventLogEntry[] = eventLogData) => {
  const uniqueCases = [...new Set(filteredData.map(entry => entry.case_id))];
  const uniqueActivities = [...new Set(filteredData.map(entry => entry.activity))];
  
  // Calculate average lead time (simplified)
  const avgLeadTime = Math.round(Math.random() * 10 + 15); // Mock calculation
  
  // Calculate variants distribution
  const variantCounts = filteredData.reduce((acc, entry) => {
    acc[entry.variant] = (acc[entry.variant] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalCases: uniqueCases.length,
    totalActivities: uniqueActivities.length,
    avgLeadTime,
    variantCounts,
    onTimeDelivery: Math.round(Math.random() * 20 + 75), // Mock percentage
    reworkRate: Math.round(Math.random() * 10 + 5), // Mock percentage
  };
};
