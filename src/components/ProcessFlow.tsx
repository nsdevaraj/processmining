import React from 'react';

interface ProcessFlowProps {
  nodes: {
    id: string;
    label: string;
    count: number;
    isConformant?: boolean;
  }[];
  edges: {
    source: string;
    target: string;
    label?: string;
    value?: number;
  }[];
}

const ProcessFlow: React.FC<ProcessFlowProps> = ({ nodes, edges }) => {
  // This is a simplified process flow visualization
  // In a real implementation, we would use a library like react-flow or d3.js
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Process Flow Visualization</h3>
      
      <div className="flex flex-col space-y-8">
        {nodes.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center">
            <div 
              id={node.id} 
              className={`process-node ${node.isConformant ? 'conformant' : 'non-conformant'} w-64`}
            >
              <div className="font-medium">{node.label}</div>
              <div className="text-sm text-gray-600">{node.count} cases</div>
            </div>
            
            {index < nodes.length - 1 && (
              <div className="h-8 border-l-2 border-blue-400"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: This is a simplified visualization. In the actual implementation, we would use a proper graph visualization library to show the complete process flow with all edges and connections between activities.</p>
      </div>
    </div>
  );
};

export default ProcessFlow;
