
import { memo } from "react";
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
} from "@xyflow/react";
import { cn } from "@/lib/utils";

// Define the expected data types for edge data
interface EdgeData {
  casePercentage: string;
  avgDuration: string;
}

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Cast data to EdgeData or use default values
  const edgeData = data as unknown as EdgeData;
  const casePercentage = edgeData?.casePercentage || "N/A";
  const avgDuration = edgeData?.avgDuration || "N/A";

  return (
    <>
      <path
        id={id}
        style={style}
        className={cn(
          "fill-none stroke-process-edge-default stroke-[2px]",
          selected && "stroke-process-edge-active"
        )}
        d={edgePath}
        markerEnd={markerEnd}
      />
      {data && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="px-2 py-1 bg-card rounded-md text-xs shadow-sm border border-border"
          >
            <div className="font-medium">{casePercentage}</div>
            <div className="text-muted-foreground">{avgDuration}</div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(CustomEdge);
