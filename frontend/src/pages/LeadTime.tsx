
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Sample data for lead time analysis
const leadTimeByStageData = [
  { name: "Create PR", avgDuration: 0.5, minDuration: 0.2, maxDuration: 1.2 },
  { name: "Approve PR", avgDuration: 2.3, minDuration: 0.8, maxDuration: 5.1 },
  { name: "Create PO", avgDuration: 1.2, minDuration: 0.5, maxDuration: 3.2 },
  { name: "Send PO", avgDuration: 0.3, minDuration: 0.1, maxDuration: 0.8 },
  { name: "Goods Receipt", avgDuration: 4.8, minDuration: 2.5, maxDuration: 12.5 },
  { name: "Invoice Receipt", avgDuration: 1.9, minDuration: 0.7, maxDuration: 4.3 },
  { name: "Invoice Verification", avgDuration: 3.4, minDuration: 1.2, maxDuration: 8.9 },
  { name: "Payment", avgDuration: 2.1, minDuration: 1.0, maxDuration: 5.0 },
];

const leadTimeTrendData = [
  { month: "Jan", avgLeadTime: 19.2 },
  { month: "Feb", avgLeadTime: 20.1 },
  { month: "Mar", avgLeadTime: 21.5 },
  { month: "Apr", avgLeadTime: 18.8 },
  { month: "May", avgLeadTime: 17.2 },
  { month: "Jun", avgLeadTime: 17.0 },
  { month: "Jul", avgLeadTime: 16.7 },
];

const slaBreachData = [
  { name: "Approve PR", breachRate: 7 },
  { name: "Create PO", breachRate: 5 },
  { name: "Send PO", breachRate: 0 },
  { name: "Goods Receipt", breachRate: 13 },
  { name: "Invoice Receipt", breachRate: 6 },
  { name: "Invoice Verification", breachRate: 18 },
  { name: "Payment", breachRate: 0 },
];

export default function LeadTime() {
  const CHART_COLORS = {
    primary: "#ff6b00",
    secondary: "#8B5CF6",
    tertiary: "#0EA5E9",
    border: "#e5e7eb",
    breach: "#ef4444"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Lead Time Analysis</h1>
        <p className="text-muted-foreground">
          Detailed analysis of process duration across stages
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Time Distribution by Process Stage</CardTitle>
          <CardDescription>
            Average, minimum and maximum duration for each process stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              avgDuration: { color: CHART_COLORS.primary },
              minDuration: { color: CHART_COLORS.tertiary },
              maxDuration: { color: CHART_COLORS.secondary },
            }}
            className="h-[400px]"
          >
            <BarChart
              data={leadTimeByStageData}
              margin={{ top: 20, right: 30, left: 30, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
              />
              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="minDuration" fill={`var(--color-minDuration)`} name="Min Duration" />
              <Bar dataKey="avgDuration" fill={`var(--color-avgDuration)`} name="Avg Duration" />
              <Bar dataKey="maxDuration" fill={`var(--color-maxDuration)`} name="Max Duration" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Time Trend</CardTitle>
            <CardDescription>
              Average lead time trend over the last 7 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgLeadTime: { color: CHART_COLORS.primary },
              }}
              className="h-[300px]"
            >
              <BarChart
                data={leadTimeTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar 
                  dataKey="avgLeadTime" 
                  fill={`var(--color-avgLeadTime)`} 
                  name="Avg Lead Time (days)" 
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SLA Breach Analysis</CardTitle>
            <CardDescription>
              Percentage of cases breaching SLA by process stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                breachRate: { color: CHART_COLORS.breach },
              }}
              className="h-[300px]"
            >
              <BarChart
                data={slaBreachData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="breachRate" fill={`var(--color-breachRate)`} name="SLA Breach Rate (%)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
