
export interface ProcessNode {
  id: string;
  type: "input" | "default" | "output";
  data: {
    label: string;
    avgDuration: string;
    casesAffected: number;
    totalCases: number;
    deviationRate: string;
    slaCompliance: string;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
  data?: {
    avgDuration: string;
    casePercentage: string;
  };
}

export const initialNodes: ProcessNode[] = [
  {
    id: "1",
    type: "input",
    data: {
      label: "Create Purchase Requisition",
      avgDuration: "0.5 days",
      casesAffected: 2500,
      totalCases: 2500,
      deviationRate: "0%",
      slaCompliance: "100%",
    },
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    type: "default",
    data: {
      label: "Approve Purchase Requisition",
      avgDuration: "2.3 days",
      casesAffected: 2450,
      totalCases: 2500,
      deviationRate: "2%",
      slaCompliance: "93%",
    },
    position: { x: 250, y: 100 },
  },
  {
    id: "3",
    type: "default",
    data: {
      label: "Create Purchase Order",
      avgDuration: "1.2 days",
      casesAffected: 2400,
      totalCases: 2500,
      deviationRate: "4%",
      slaCompliance: "95%",
    },
    position: { x: 250, y: 200 },
  },
  {
    id: "4",
    type: "default",
    data: {
      label: "Send Purchase Order to Vendor",
      avgDuration: "0.3 days",
      casesAffected: 2400,
      totalCases: 2500,
      deviationRate: "0%",
      slaCompliance: "100%",
    },
    position: { x: 250, y: 300 },
  },
  {
    id: "5a",
    type: "default",
    data: {
      label: "Goods Receipt",
      avgDuration: "4.8 days",
      casesAffected: 2350,
      totalCases: 2500,
      deviationRate: "6%",
      slaCompliance: "87%",
    },
    position: { x: 100, y: 400 },
  },
  {
    id: "5b",
    type: "default",
    data: {
      label: "Service Entry Sheet",
      avgDuration: "3.2 days",
      casesAffected: 50,
      totalCases: 2500,
      deviationRate: "0%",
      slaCompliance: "100%",
    },
    position: { x: 400, y: 400 },
  },
  {
    id: "6a",
    type: "default",
    data: {
      label: "Invoice Receipt (Goods)",
      avgDuration: "1.9 days",
      casesAffected: 2320,
      totalCases: 2500,
      deviationRate: "5%",
      slaCompliance: "94%",
    },
    position: { x: 100, y: 500 },
  },
  {
    id: "6b",
    type: "default",
    data: {
      label: "Invoice Receipt (Service)",
      avgDuration: "1.5 days",
      casesAffected: 48,
      totalCases: 2500,
      deviationRate: "2%",
      slaCompliance: "98%",
    },
    position: { x: 400, y: 500 },
  },
  {
    id: "7",
    type: "default",
    data: {
      label: "Invoice Verification",
      avgDuration: "3.4 days",
      casesAffected: 2368,
      totalCases: 2500,
      deviationRate: "8%",
      slaCompliance: "82%",
    },
    position: { x: 250, y: 600 },
  },
  {
    id: "8",
    type: "output",
    data: {
      label: "Payment",
      avgDuration: "2.1 days",
      casesAffected: 2368,
      totalCases: 2500,
      deviationRate: "0%",
      slaCompliance: "100%",
    },
    position: { x: 250, y: 700 },
  },
];

export const initialEdges: ProcessEdge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    data: {
      avgDuration: "0.2 days",
      casePercentage: "98%",
    },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    data: {
      avgDuration: "0.3 days",
      casePercentage: "96%",
    },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    data: {
      avgDuration: "0.1 days",
      casePercentage: "100%",
    },
  },
  {
    id: "e4-5a",
    source: "4",
    target: "5a",
    data: {
      avgDuration: "12.5 days",
      casePercentage: "94%",
    },
  },
  {
    id: "e4-5b",
    source: "4",
    target: "5b",
    data: {
      avgDuration: "8.7 days",
      casePercentage: "2%",
    },
  },
  {
    id: "e5a-6a",
    source: "5a",
    target: "6a",
    data: {
      avgDuration: "1.3 days",
      casePercentage: "92.8%",
    },
  },
  {
    id: "e5b-6b",
    source: "5b",
    target: "6b",
    data: {
      avgDuration: "0.9 days",
      casePercentage: "1.9%",
    },
  },
  {
    id: "e6a-7",
    source: "6a",
    target: "7",
    data: {
      avgDuration: "0.5 days",
      casePercentage: "92.8%",
    },
  },
  {
    id: "e6b-7",
    source: "6b",
    target: "7",
    data: {
      avgDuration: "0.3 days",
      casePercentage: "1.9%",
    },
  },
  {
    id: "e7-8",
    source: "7",
    target: "8",
    data: {
      avgDuration: "1.8 days",
      casePercentage: "94.7%",
    },
  },
];

export const metricData = {
  leadTime: {
    value: 16.7,
    unit: "days",
    change: -2.3,
    changeUnit: "days",
    changePercentage: -12.1,
  },
  onTimeDelivery: {
    value: 94.2,
    unit: "%",
    change: 3.5,
    changePercentage: 3.9,
  },
  totalCases: {
    value: 2500,
    change: 127,
    changePercentage: 5.4,
  },
  activeCases: {
    value: 132,
    change: -18,
    changePercentage: -12.0,
  },
  reworkRate: {
    value: 7.3,
    unit: "%",
    change: -1.2,
    changePercentage: -14.1,
  },
};
