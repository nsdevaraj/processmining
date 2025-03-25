import React from 'react';

interface BPMNProcessModelProps {
  lanes: {
    id: string;
    name: string;
    activities: {
      id: string;
      name: string;
      type: 'start' | 'end' | 'task' | 'gateway';
      position: { x: number, y: number };
      width?: number;
      height?: number;
    }[];
  }[];
  connections: {
    source: string;
    target: string;
    type?: 'sequence' | 'message' | 'association';
  }[];
}

const BPMNProcessModel: React.FC<BPMNProcessModelProps> = ({ lanes, connections }) => {
  // Calculate dimensions
  const laneHeight = 150;
  const totalHeight = lanes.length * laneHeight;
  const width = 1200;
  
  // Helper function to render different node types
  const renderNode = (activity: any) => {
    const { id, name, type, position, width = 120, height = 60 } = activity;
    
    switch (type) {
      case 'start':
        return (
          <g key={id} transform={`translate(${position.x}, ${position.y})`}>
            <circle cx="15" cy="15" r="15" fill="white" stroke="#000" strokeWidth="2" />
            <title>{name}</title>
          </g>
        );
      case 'end':
        return (
          <g key={id} transform={`translate(${position.x}, ${position.y})`}>
            <circle cx="15" cy="15" r="15" fill="white" stroke="#000" strokeWidth="2" />
            <circle cx="15" cy="15" r="12" fill="white" stroke="#000" strokeWidth="2" />
            <title>{name}</title>
          </g>
        );
      case 'gateway':
        return (
          <g key={id} transform={`translate(${position.x}, ${position.y})`}>
            <rect 
              x="0" 
              y="0" 
              width="30" 
              height="30" 
              fill="white" 
              stroke="#000" 
              strokeWidth="2" 
              transform="rotate(45, 15, 15)" 
            />
            <text x="15" y="40" textAnchor="middle" fontSize="12">{name}</text>
            <title>{name}</title>
          </g>
        );
      case 'task':
      default:
        return (
          <g key={id} transform={`translate(${position.x}, ${position.y})`}>
            <rect 
              x="0" 
              y="0" 
              width={width} 
              height={height} 
              rx="5" 
              ry="5" 
              fill="white" 
              stroke="#000" 
              strokeWidth="2" 
            />
            <text x={width/2} y={height/2 + 5} textAnchor="middle" fontSize="12">{name}</text>
            <title>{name}</title>
          </g>
        );
    }
  };
  
  // Helper function to find node position by id
  const findNodePosition = (nodeId: string) => {
    for (const lane of lanes) {
      const activity = lane.activities.find(a => a.id === nodeId);
      if (activity) {
        // Adjust for node center
        const nodeType = activity.type;
        let offsetX = 0, offsetY = 0;
        
        if (nodeType === 'start' || nodeType === 'end') {
          offsetX = 15;
          offsetY = 15;
        } else if (nodeType === 'gateway') {
          offsetX = 15;
          offsetY = 15;
        } else {
          offsetX = (activity.width || 120) / 2;
          offsetY = (activity.height || 60) / 2;
        }
        
        return {
          x: activity.position.x + offsetX,
          y: activity.position.y + offsetY
        };
      }
    }
    return { x: 0, y: 0 };
  };
  
  // Render connections
  const renderConnections = () => {
    return connections.map((connection, index) => {
      const source = findNodePosition(connection.source);
      const target = findNodePosition(connection.target);
      
      // Simple straight line for now
      return (
        <g key={`connection-${index}`}>
          <line 
            x1={source.x} 
            y1={source.y} 
            x2={target.x} 
            y2={target.y} 
            stroke="#000" 
            strokeWidth="2" 
            markerEnd="url(#arrowhead)" 
          />
        </g>
      );
    });
  };
  
  return (
    <div className="overflow-auto border border-gray-300 rounded-lg">
      <svg width={width} height={totalHeight} viewBox={`0 0 ${width} ${totalHeight}`}>
        <defs>
          <marker 
            id="arrowhead" 
            markerWidth="10" 
            markerHeight="7" 
            refX="9" 
            refY="3.5" 
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
          </marker>
        </defs>
        
        {/* Render lanes */}
        {lanes.map((lane, index) => (
          <g key={lane.id}>
            {/* Lane background */}
            <rect 
              x="0" 
              y={index * laneHeight} 
              width={width} 
              height={laneHeight} 
              fill="#f8f9fa" 
              stroke="#000" 
            />
            
            {/* Lane header */}
            <rect 
              x="0" 
              y={index * laneHeight} 
              width="150" 
              height={laneHeight} 
              fill="#e9ecef" 
              stroke="#000" 
            />
            <text 
              x="75" 
              y={index * laneHeight + laneHeight/2} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="14"
              fontWeight="bold"
            >
              {lane.name}
            </text>
            
            {/* Lane activities */}
            <g transform={`translate(150, ${index * laneHeight})`}>
              {lane.activities.map(activity => renderNode(activity))}
            </g>
          </g>
        ))}
        
        {/* Render connections */}
        {renderConnections()}
      </svg>
    </div>
  );
};

export default BPMNProcessModel;
