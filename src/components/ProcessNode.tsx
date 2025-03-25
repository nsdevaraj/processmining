import React from 'react';

interface ProcessNodeProps {
  id: string;
  label: string;
  count: number;
  isConformant?: boolean;
}

const ProcessNode: React.FC<ProcessNodeProps> = ({ 
  id, 
  label, 
  count,
  isConformant = true
}) => {
  const nodeClass = isConformant ? 'conformant' : 'non-conformant';
  
  return (
    <div id={id} className={`process-node ${nodeClass} mb-2`}>
      <div className="font-medium">{label}</div>
      <div className="text-sm text-gray-600">{count} cases</div>
    </div>
  );
};

export default ProcessNode;
