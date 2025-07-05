import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowDown, ArrowUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  change?: number;
  changeUnit?: string;
  changePercentage?: number;
  icon: React.ReactNode;
  description?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  changeUnit,
  changePercentage,
  icon,
  description,
}: MetricCardProps) {
  // console.log(value);

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const isNeutral = change === 0 || change === undefined;

  // For metrics like lead time and rework rate, negative change is good
  const isGood =
    title === "Avg Lead Time" || title === "Rework Rate"
      ? isNegative
      : title === "On-Time Delivery"
      ? isPositive
      : isPositive;

  return (
    <Card className="card-neumorph-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                {title}
              </h3>
              {description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info
                        size={14}
                        className="text-muted-foreground cursor-help"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">{description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">
                {value?.toLocaleString()}
              </span>
              {unit && <span className="text-sm ml-1">{unit}</span>}
            </div>
          </div>
          <div className="p-2 rounded-full bg-muted text-foreground">
            {icon}
          </div>
        </div>

        {!isNeutral && (
          <div className="mt-4">
            <div
              className={cn(
                "flex items-center text-xs",
                isGood ? "text-green-600" : "text-red-600"
              )}
            >
              {isPositive ? (
                <ArrowUp size={14} className="mr-1" />
              ) : (
                <ArrowDown size={14} className="mr-1" />
              )}
              <span>
                {Math.abs(change || 0).toLocaleString()}
                {changeUnit && ` ${changeUnit}`}
                {changePercentage &&
                  ` (${Math.abs(changePercentage).toFixed(1)}%)`}
              </span>
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
