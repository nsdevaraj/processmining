import React from 'react';

interface ProgressBarProps {
  value: number;
  total: number;
  successColor?: string;
  failureColor?: string;
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  total,
  successColor = 'bg-green-500',
  failureColor = 'bg-red-500',
  label,
  showPercentage = true
}) => {
  const percentage = Math.round((value / total) * 100);
  
  return (
    <div className="w-full">
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <div className="flex w-full h-6 bg-gray-200 rounded-md overflow-hidden">
        <div 
          className={`${successColor} h-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
        <div 
          className={`${failureColor} h-full`} 
          style={{ width: `${100 - percentage}%` }}
        ></div>
      </div>
      {showPercentage && (
        <div className="flex justify-between text-xs mt-1">
          <span>{value} cases</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
