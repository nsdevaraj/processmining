import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Truck,
  FileCheck,
  Briefcase,
  RefreshCcw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useProcessMining } from "@/contexts/ProcessMiningContext";
import {
  LeadTimeChart,
  ProcessBreakdownChart,
  VariantsChart,
  BottlenecksChart,
  CaseVolumeChart,
} from "@/components/dashboard/DashboardChart";
import { useEffect } from "react";

export default function Overview() {
  const {
    // processMetrics,
    // filteredData,
    hasUploadedData,
    isLoading,
    error,
    overviewData,
    // refreshData,
    // eventData,
    loadEventData,
  } = useProcessMining();

  useEffect(() => {
    loadEventData();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading process data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            {/* <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry
            </Button> */}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show no data state
  if (!hasUploadedData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FileCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Process Data</h2>
          <p className="text-muted-foreground mb-4">
            Upload your event log file to start analyzing your process
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Upload Event Log
          </Button>
        </div>
      </div>
    );
  }

  // Calculate dynamic metrics based on filtered data
  const activeCases =
    overviewData?.totalCases?.value - overviewData?.completedCases?.value;
  // const leadTimeChange = Math.round(Math.random() * 4 - 2); // These will come from backend in real implementation
  // const onTimeDeliveryChange = Math.round(Math.random() * 10 - 5);
  // const casesChange = Math.round(Math.random() * 100 - 50);
  // const reworkChange = Math.round(Math.random() * 2 - 1);

  return (
    <div className="space-y-4 p-4 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Process Mining Dashboard</h1>
          <p className="text-muted-foreground">
            Key metrics and insights for your process (
            {overviewData.totalCases.value} events analyzed)
            {hasUploadedData && (
              <span className="text-green-600 ml-2">• Using backend data</span>
            )}
          </p>
        </div>
        {/* <Button variant="outline" size="sm" onClick={refreshData}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 lg:gap-4">
        <MetricCard
          title="Avg Lead Time"
          value={overviewData?.avgLeadTime?.value || 0}
          unit={overviewData?.avgLeadTime?.unit || "days"}
          change={
            overviewData?.avgLeadTime?.value -
            (overviewData?.avgLeadTime?.previousValue || 0)
          }
          changeUnit="days"
          changePercentage={Math.abs(overviewData?.avgLeadTime?.trend || 0)}
          icon={<Clock size={24} />}
          description="Average time from start to completion"
        />
        <MetricCard
          title="On-Time Delivery"
          value={overviewData?.onTimeDelivery?.value}
          unit={overviewData?.onTimeDelivery?.unit || "days"}
          change={
            overviewData?.onTimeDelivery?.value -
            (overviewData?.onTimeDelivery?.previousValue || 0)
          }
          changeUnit="days"
          changePercentage={Math.abs(overviewData?.onTimeDelivery?.trend || 0)}
          icon={<Truck size={24} />}
          description="Percentage of cases completed on time"
        />
        <MetricCard
          title="Total Cases"
          value={overviewData?.totalCases?.value || 0}
          unit={overviewData?.totalCases?.unit}
          change={
            overviewData?.totalCases?.value -
            (overviewData?.totalCases?.previousValue || 0)
          }
          changeUnit="cases"
          changePercentage={Math.abs(overviewData?.totalCases?.trend || 0)}
          icon={<FileCheck size={24} />}
          description="Total number of cases processed"
        />
        <MetricCard
          title="Active Cases"
          value={activeCases}
          // change={Math.round(casesChange * 0.15)}
          // changePercentage={Math.round(
          //   ((casesChange * 0.15) / Math.max(activeCases, 1)) * 100
          // )}
          icon={<Briefcase size={24} />}
          description="Number of currently running process instances"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
        <Card className="h-full w-full">
          <CardHeader>
            <CardTitle>Process Performance</CardTitle>
            <CardDescription>
              Key process metrics over time (Backend-powered)
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <Tabs defaultValue="leadTime" className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leadTime">Lead Time</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
              </TabsList>
              <TabsContent value="leadTime" className="mt-4">
                <div className="w-full overflow-hidden">
                  <LeadTimeChart
                    chartData={overviewData.chartData}
                    chartType="leadTime"
                  />
                </div>
              </TabsContent>
              <TabsContent value="volume" className="mt-4">
                <div className="w-full overflow-hidden">
                  <CaseVolumeChart chartData={overviewData?.chartData} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Process Breakdown</CardTitle>
            <CardDescription>
              Distribution by region and category
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="w-full overflow-hidden">
              <ProcessBreakdownChart chartData={overviewData.chartData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Process Variants</CardTitle>
            <CardDescription>Most common process paths</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="w-full overflow-hidden">
              <VariantsChart chartData={overviewData.chartData} />
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Bottlenecks</CardTitle>
            <CardDescription>
              Activities with longest processing times
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="w-full overflow-hidden">
              <BottlenecksChart chartData={overviewData.chartData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
