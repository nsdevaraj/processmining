
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Info,
  AlertTriangle,
  Clock,
  Users,
  LineChart,
  Check,
  Maximize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NodeToolbarProps {
  data: {
    label: string;
    avgDuration: string;
    casesAffected: number;
    totalCases: number;
    deviationRate: string;
    slaCompliance: string;
  };
  onClose: () => void;
}

function NodeToolbar({ data, onClose }: NodeToolbarProps) {
  return (
    <Card className="w-80 p-4 absolute right-6 top-20 shadow-xl border z-10 animate-slide-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium flex items-center">
          <Info size={18} className="mr-2 text-process-primary" /> 
          Process Details
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <Maximize size={16} />
        </Button>
      </div>
      
      <h4 className="font-medium text-base mb-2">{data.label}</h4>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center text-sm">
              <Clock size={14} className="mr-1" />
              <span>Average Duration:</span>
            </div>
            <span className="font-medium">{data.avgDuration}</span>
          </div>
          <Progress value={70} className="h-1.5" />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center text-sm">
              <Users size={14} className="mr-1" />
              <span>Cases Affected:</span>
            </div>
            <span className="font-medium">{data.casesAffected} / {data.totalCases}</span>
          </div>
          <Progress 
            value={(data.casesAffected / data.totalCases) * 100} 
            className="h-1.5"
          />
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center text-sm">
              <AlertTriangle size={14} className="mr-1" />
              <span>Deviation Rate:</span>
            </div>
            <span 
              className={
                parseFloat(data.deviationRate) > 5 
                  ? "font-medium text-destructive" 
                  : "font-medium"
              }
            >
              {data.deviationRate}
            </span>
          </div>
          <Progress 
            value={parseFloat(data.deviationRate)} 
            className={
              parseFloat(data.deviationRate) > 5 
                ? "h-1.5 bg-muted [&>*]:bg-destructive" 
                : "h-1.5"
            } 
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center text-sm">
              <Check size={14} className="mr-1" />
              <span>SLA Compliance:</span>
            </div>
            <span 
              className={
                parseFloat(data.slaCompliance) < 90 
                  ? "font-medium text-destructive" 
                  : "font-medium"
              }
            >
              {data.slaCompliance}
            </span>
          </div>
          <Progress 
            value={parseFloat(data.slaCompliance)} 
            className={
              parseFloat(data.slaCompliance) < 90 
                ? "h-1.5 bg-muted [&>*]:bg-destructive" 
                : "h-1.5"
            }
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button size="sm" variant="outline" className="flex-1 mr-2">
          <LineChart size={14} className="mr-1" /> 
          Analyze
        </Button>
        <div className="flex">
          <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
            <ChevronLeft size={16} />
          </Button>
          <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default memo(NodeToolbar);
