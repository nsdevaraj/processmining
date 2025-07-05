
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Sankey, Pie, PieChart, Label } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Sample data for root cause analysis
const topDelayCausesData = [
  { name: "Missing Information", count: 235, percentage: 32 },
  { name: "Vendor Delay", count: 187, percentage: 25 },
  { name: "Approval Wait", count: 153, percentage: 21 },
  { name: "System Error", count: 89, percentage: 12 },
  { name: "Staff Unavailability", count: 72, percentage: 10 },
];

const issueClusteringData = [
  { name: "Documentation Issues", value: 35 },
  { name: "System Problems", value: 25 },
  { name: "Vendor Communication", value: 20 },
  { name: "Approval Process", value: 15 },
  { name: "Other Issues", value: 5 },
];

export default function RootCauses() {
  const CHART_COLORS = {
    primary: "#ff6b00",
    secondary: "#8B5CF6",
    tertiary: "#0EA5E9",
    quaternary: "#10B981",
    quinary: "#F97316",
    border: "#e5e7eb"
  };

  const COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.tertiary,
    CHART_COLORS.quaternary,
    CHART_COLORS.quinary,
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Root Cause Analysis</h1>
        <p className="text-muted-foreground">
          AI-powered identification of process bottlenecks and delay causes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pareto Chart of Delay Causes</CardTitle>
          <CardDescription>
            Primary causes of process delays and their impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { color: CHART_COLORS.primary },
              percentage: { color: CHART_COLORS.tertiary },
            }}
            className="h-[400px]"
          >
            <BarChart
              data={topDelayCausesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke={CHART_COLORS.primary} />
              <YAxis yAxisId="right" orientation="right" stroke={CHART_COLORS.tertiary} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="count" 
                fill={`var(--color-count)`} 
                name="Number of Cases" 
              />
              <Bar 
                yAxisId="right" 
                dataKey="percentage" 
                fill={`var(--color-percentage)`} 
                name="Percentage (%)" 
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI-Suggested Bottlenecks</CardTitle>
            <CardDescription>
              Machine learning identified process bottlenecks
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="bg-card bg-opacity-80 p-4 rounded-md border shadow-sm">
                <p className="text-sm text-center">
                  The Invoice Verification step is the main bottleneck, with 82% SLA compliance rate
                  <br />
                  <span className="text-muted-foreground">
                    Recommended action: Add more verification personnel during peak hours
                  </span>
                </p>
              </div>
            </div>
            <div className="h-[300px] opacity-40">
              <ChartContainer
                config={{
                  percentage: { color: CHART_COLORS.primary },
                }}
                className="h-[300px]"
              >
                <BarChart
                  data={topDelayCausesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="percentage" fill={`var(--color-percentage)`} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NLP-Based Issue Clustering</CardTitle>
            <CardDescription>
              Clustering of case notes and comments using natural language processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                issues: { color: CHART_COLORS.primary },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={issueClusteringData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {issueClusteringData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
