import React from 'react';

interface LeadTimeDistributionProps {
  leadTimeData: {
    category: string;
    distribution: {
      range: string;
      count: number;
      percentage: number;
    }[];
  }[];
}

const LeadTimeDistribution: React.FC<LeadTimeDistributionProps> = ({ leadTimeData }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Lead Time Distribution</h3>
        
        {leadTimeData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8 last:mb-0">
            <h4 className="font-medium text-gray-700 mb-3">{category.category}</h4>
            
            <div className="space-y-3">
              {category.distribution.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{item.range}</span>
                    <span className="text-sm text-gray-600">{item.count.toLocaleString()} cases ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadTimeDistribution;
