import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { leadTimeData, ProcessBreakChart } from "@/services/apiService";

// Sample data for the lead time chart
// const leadTimeData = [
//   { month: "Jan", leadTime: 20, volume: 120 },
//   { month: "Feb", leadTime: 22, volume: 132 },
//   { month: "Mar", leadTime: 25, volume: 145 },
//   { month: "Apr", leadTime: 19, volume: 160 },
//   { month: "May", leadTime: 17, volume: 168 },
//   { month: "Jun", leadTime: 18, volume: 172 },
//   { month: "Jul", leadTime: 16.7, volume: 182 },
// ];

// Sample data for the process breakdown
const processBreakdownData = [
  { name: "EMEA", value: 45 },
  { name: "APAC", value: 30 },
  { name: "AMER", value: 25 },
];

// Sample data for variants chart
const variantsData = [
  { name: "Happy Path", value: 65 },
  { name: "Path 2", value: 15 },
  { name: "Path 3", value: 10 },
  { name: "Others", value: 10 },
];

// Sample data for bottlenecks chart
const bottlenecksData = [
  { name: "Invoice Verification", duration: 3.4 },
  { name: "Goods Receipt", duration: 4.8 },
  { name: "Approve PR", duration: 2.3 },
  { name: "Create PO", duration: 1.2 },
  { name: "Payment", duration: 2.1 },
];

// Colors for charts
const CHART_COLORS = {
  primary: "#ff6b00",
  secondary: "#8B5CF6",
  tertiary: "#0EA5E9",
  quaternary: "#10B981",
  background: "#f9f9f9",
  border: "#e5e7eb",
};

interface LeadTimeChartProps {
  chartType?: "leadTime" | "volume" | "compliance";
  chartData: {
    averageLeadTime: leadTimeData[];
    processBreakOut: ProcessBreakChart[];
    processVariant?: ProcessBreakChart[];
    bottleNeck?: ProcessBreakChart[];
  };
}

export const LeadTimeChart: React.FC<LeadTimeChartProps> = ({
  chartType,
  chartData,
}) => {
  // console.log(chartData.averageLeadTime);

  const config = {
    leadTime: {
      color: CHART_COLORS.primary,
      dataKey: "leadTime",
      label: "Lead Time (days)",
    },
    volume: {
      color: CHART_COLORS.secondary,
      dataKey: "volume",
      label: "Case Volume",
    },
    compliance: {
      color: CHART_COLORS.tertiary,
      dataKey: "compliance",
      label: "Compliance (%)",
    },
  };

  const { color, dataKey, label } = config[chartType];

  return (
    <ChartContainer
      config={{
        [dataKey]: { color },
      }}
      className="h-[300px]"
    >
      <LineChart
        data={chartData.averageLeadTime}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={`var(--color-${dataKey})`}
          activeDot={{ r: 8 }}
          name={label}
        />
      </LineChart>
    </ChartContainer>
  );
};

export const ProcessBreakdownChart: React.FC<LeadTimeChartProps> = ({
  chartData,
}) => {
  const COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.tertiary,
  ];

  return (
    <ChartContainer
      config={{
        region: { color: CHART_COLORS.primary },
      }}
      className="h-[300px]"
    >
      <PieChart>
        <Pie
          data={chartData.processBreakOut}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {processBreakdownData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
};

export const VariantsChart: React.FC<LeadTimeChartProps> = ({ chartData }) => {
  const COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.tertiary,
    CHART_COLORS.quaternary,
  ];

  return (
    <ChartContainer
      config={{
        variants: { color: CHART_COLORS.primary },
      }}
      className="h-[300px]"
    >
      <PieChart>
        <Pie
          data={chartData.processVariant}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {variantsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
};

export const BottlenecksChart: React.FC<LeadTimeChartProps> = ({
  chartData,
}) => {
  return (
    <ChartContainer
      config={{
        duration: { color: CHART_COLORS.primary },
      }}
      className="h-[300px]"
    >
      <BarChart
        data={chartData.bottleNeck}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
        <XAxis type="number" />
        <YAxis
          dataKey="name"
          type="category"
          width={80}
          tick={{ fontSize: 10 }}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        <Bar
          dataKey="duration"
          fill={CHART_COLORS.primary}
          name="Avg. Duration (days)"
        />
      </BarChart>
    </ChartContainer>
  );
};

export const CaseVolumeChart: React.FC<LeadTimeChartProps> = ({
  chartData,
}) => {
  return (
    <ChartContainer
      config={{
        volume: { color: CHART_COLORS.primary },
      }}
      className="h-[300px]"
    >
      <AreaChart
        data={chartData.averageLeadTime}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="volume"
          stroke={CHART_COLORS.primary}
          fill={`${CHART_COLORS.primary}40`}
          name="Case Volume"
        />
      </AreaChart>
    </ChartContainer>
  );
};
