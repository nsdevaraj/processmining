import React from 'react';

interface BarChartProps {
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  height = 300
}) => {
  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      
      <div style={{ height: `${height}px` }} className="relative">
        {/* Y-axis label */}
        {yAxisLabel && (
          <div className="absolute -left-10 top-1/2 transform -rotate-90 -translate-y-1/2 text-xs text-gray-500">
            {yAxisLabel}
          </div>
        )}
        
        {/* Chart content */}
        <div className="flex items-end h-full space-x-2 pl-8 pr-4 pb-8">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full ${item.color || 'bg-blue-500'} rounded-t`} 
                  style={{ height: `${barHeight}%` }}
                  title={`${item.label}: ${item.value}`}
                ></div>
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* X-axis label */}
        {xAxisLabel && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 mt-2">
            {xAxisLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChart;
