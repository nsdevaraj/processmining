
import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

// Define the expected data types for node data
interface NodeData {
  label: string;
  avgDuration: string;
  casesAffected: number;
  totalCases: number;
}

function CustomNode({ data, isConnectable, selected }: NodeProps) {
  // Cast data to NodeData or use default values if properties are missing
  const nodeData = data as unknown as NodeData;
  
  // Safely access properties with fallbacks
  const label = nodeData?.label || "Unknown Step";
  const avgDuration = nodeData?.avgDuration || "N/A";
  const casesAffected = Number(nodeData?.casesAffected || 0);
  const totalCases = Number(nodeData?.totalCases || 1); // Prevent division by zero
  
  // Calculate percentage with safety check
  const percentage = totalCases > 0 ? Math.round((casesAffected / totalCases) * 100) : 0;

  return (
    <div 
      className={cn(
        "border rounded-md px-4 py-2 w-60 bg-process-node-default shadow-md",
        selected && "border-process-primary",
        "hover:bg-process-node-hover transition-colors"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-process-primary border-none rounded-full"
      />
      <div className="font-medium text-sm">{label}</div>
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>Avg: {avgDuration}</span>
        <span>{percentage}%</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-process-primary border-none rounded-full"
      />
    </div>
  );
}

export default memo(CustomNode);
