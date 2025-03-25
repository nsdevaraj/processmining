import React from 'react';

interface PerformanceMetricsProps {
  metrics: {
    category: string;
    metrics: {
      name: string;
      value: string | number;
      trend?: number;
      status?: 'positive' | 'negative' | 'neutral';
    }[];
  }[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  const getStatusColor = (status?: 'positive' | 'negative' | 'neutral') => {
    switch (status) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'neutral':
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend?: number) => {
    if (!trend) return null;
    return trend > 0 ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {metrics.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">{category.category}</h3>
            <div className="space-y-3">
              {category.metrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{metric.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{metric.value}</span>
                    {metric.trend !== undefined && (
                      <span className={getStatusColor(metric.status)}>
                        {getTrendIcon(metric.trend)} {Math.abs(metric.trend)}%
                      </span>
                    )}
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

export default PerformanceMetrics;
