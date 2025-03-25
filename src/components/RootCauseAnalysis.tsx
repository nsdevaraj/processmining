import React from 'react';

interface RootCauseAnalysisProps {
  title: string;
  feature: string;
  data: {
    dimension: string;
    value: string;
    totalCases: number;
    targetCases: number;
    rate: number;
    impact: number;
    contribution: number;
  }[];
}

const RootCauseAnalysis: React.FC<RootCauseAnalysisProps> = ({ title, feature, data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">Finding root causes for feature occurring in {feature}</p>
      
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Value</th>
              <th>Impact</th>
              <th>Occurrences</th>
              <th>Contribution</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((cause, index) => (
              <tr key={`cause-${index}`}>
                <td>{cause.dimension}</td>
                <td>{cause.value}</td>
                <td className={cause.impact > 0 ? 'text-green-600' : 'text-red-600'}>
                  {cause.impact > 0 ? '+' : ''}{cause.impact}%
                </td>
                <td>
                  {cause.targetCases} in {Math.round(cause.rate)}% ({cause.targetCases}/{cause.totalCases}) cases
                </td>
                <td>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${cause.impact > 0 ? 'bg-green-600' : 'bg-red-600'}`}
                      style={{ width: `${Math.min(Math.abs(cause.contribution), 100)}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RootCauseAnalysis;
