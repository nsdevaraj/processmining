import React from 'react';

interface ConformanceByGroupProps {
  title: string;
  groups: {
    name: string;
    conformant: number;
    total: number;
    percentage: number;
  }[];
}

const ConformanceByGroup: React.FC<ConformanceByGroupProps> = ({ title, groups }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <div className="space-y-4">
          {groups.map((group, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{group.name}</span>
                <span className="text-sm text-gray-500">{group.conformant.toLocaleString()} cases</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ width: `${group.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>{group.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConformanceByGroup;
