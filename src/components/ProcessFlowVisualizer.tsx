import React from 'react';

interface ProcessFlowVisualizerProps {
  nodes: {
    id: string;
    label: string;
    count: number;
    type?: 'start' | 'end' | 'activity' | 'gateway';
    department?: string;
  }[];
  edges: {
    source: string;
    target: string;
    count?: number;
    label?: string;
  }[];
  width?: number;
  height?: number;
}

const ProcessFlowVisualizer: React.FC<ProcessFlowVisualizerProps> = ({
  nodes,
  edges,
  width = 1000,
  height = 600
}) => {
  // Calculate node positions using a simple layered approach
  const calculateNodePositions = () => {
    // Group nodes by their position in the process flow
    const layers: { [key: string]: string[] } = {};
    const visited = new Set<string>();
    const startNodes = nodes.filter(n => n.type === 'start').map(n => n.id);
    
    // BFS to assign layers
    const queue = [...startNodes];
    let currentLayer = 0;
    layers[currentLayer] = [...startNodes];
    
    while (queue.length > 0) {
      const layerSize = queue.length;
      const nextLayer: string[] = [];
      
      for (let i = 0; i < layerSize; i++) {
        const nodeId = queue.shift()!;
        visited.add(nodeId);
        
        // Find all outgoing edges
        const outgoingEdges = edges.filter(e => e.source === nodeId);
        for (const edge of outgoingEdges) {
          if (!visited.has(edge.target) && !nextLayer.includes(edge.target)) {
            nextLayer.push(edge.target);
            queue.push(edge.target);
          }
        }
      }
      
      if (nextLayer.length > 0) {
        currentLayer++;
        layers[currentLayer] = nextLayer;
      }
    }
    
    // Assign x, y coordinates based on layers
    const nodePositions: { [key: string]: { x: number, y: number } } = {};
    const horizontalSpacing = width / (Object.keys(layers).length + 1);
    
    Object.entries(layers).forEach(([layerIdx, layerNodes]) => {
      const verticalSpacing = height / (layerNodes.length + 1);
      const x = horizontalSpacing * (parseInt(layerIdx) + 1);
      
      layerNodes.forEach((nodeId, idx) => {
        const y = verticalSpacing * (idx + 1);
        nodePositions[nodeId] = { x, y };
      });
    });
    
    return nodePositions;
  };
  
  const nodePositions = calculateNodePositions();
  
  // Render nodes
  const renderNodes = () => {
    return nodes.map(node => {
      const position = nodePositions[node.id] || { x: 0, y: 0 };
      const nodeSize = Math.min(50, Math.max(30, Math.log10(node.count) * 10));
      
      let nodeElement;
      switch (node.type) {
        case 'start':
          nodeElement = (
            <circle 
              cx={position.x} 
              cy={position.y} 
              r={20} 
              fill="#e3f2fd" 
              stroke="#2196f3" 
              strokeWidth={2} 
            />
          );
          break;
        case 'end':
          nodeElement = (
            <circle 
              cx={position.x} 
              cy={position.y} 
              r={20} 
              fill="#e3f2fd" 
              stroke="#2196f3" 
              strokeWidth={2} 
            />
          );
          break;
        case 'gateway':
          nodeElement = (
            <rect 
              x={position.x - 20} 
              y={position.y - 20} 
              width={40} 
              height={40} 
              fill="#fff3e0" 
              stroke="#ff9800" 
              strokeWidth={2} 
              transform={`rotate(45, ${position.x}, ${position.y})`} 
            />
          );
          break;
        case 'activity':
        default:
          nodeElement = (
            <rect 
              x={position.x - 60} 
              y={position.y - 30} 
              width={120} 
              height={60} 
              rx={5} 
              ry={5} 
              fill="#e3f2fd" 
              stroke="#2196f3" 
              strokeWidth={2} 
            />
          );
      }
      
      return (
        <g key={node.id} className="process-node">
          {nodeElement}
          <text 
            x={position.x} 
            y={position.y} 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fontSize={12} 
            fontWeight="bold"
          >
            {node.label}
          </text>
          <text 
            x={position.x} 
            y={position.y + 15} 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fontSize={10} 
            fill="#666"
          >
            {node.count.toLocaleString()} cases
          </text>
        </g>
      );
    });
  };
  
  // Render edges
  const renderEdges = () => {
    return edges.map((edge, index) => {
      const sourcePos = nodePositions[edge.source];
      const targetPos = nodePositions[edge.target];
      
      if (!sourcePos || !targetPos) return null;
      
      // Calculate control points for curved edges
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const controlPoint = {
        x: sourcePos.x + dx / 2,
        y: sourcePos.y + dy / 2
      };
      
      // Create path
      const path = `M ${sourcePos.x} ${sourcePos.y} Q ${controlPoint.x} ${controlPoint.y}, ${targetPos.x} ${targetPos.y}`;
      
      return (
        <g key={`edge-${index}`} className="process-edge">
          <path 
            d={path} 
            fill="none" 
            stroke="#64b5f6" 
            strokeWidth={2} 
            markerEnd="url(#arrowhead)" 
          />
          {edge.count && (
            <text>
              <textPath 
                href={`#edge-path-${index}`} 
                startOffset="50%" 
                textAnchor="middle"
                fontSize={10}
                fill="#666"
              >
                {edge.count.toLocaleString()} cases
              </textPath>
            </text>
          )}
          <path 
            id={`edge-path-${index}`} 
            d={path} 
            fill="none" 
            stroke="none" 
          />
        </g>
      );
    });
  };
  
  return (
    <div className="process-flow-visualizer overflow-auto border border-gray-200 rounded-lg bg-white p-4">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <marker 
            id="arrowhead" 
            markerWidth="10" 
            markerHeight="7" 
            refX="9" 
            refY="3.5" 
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#64b5f6" />
          </marker>
        </defs>
        
        {/* Render edges first so they appear behind nodes */}
        {renderEdges()}
        
        {/* Render nodes */}
        {renderNodes()}
      </svg>
    </div>
  );
};

export default ProcessFlowVisualizer;
