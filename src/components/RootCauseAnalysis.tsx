import React from 'react';

interface RootCauseAnalysisProps {
  rootCauses: {
    factor: string;
    category: string;
    impact: number;
    occurrences: number;
    totalCases: number;
    percentage: number;
  }[];
  kpiName: string;
}

const RootCauseAnalysis: React.FC<RootCauseAnalysisProps> = ({ rootCauses, kpiName }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Root Cause Analysis for {kpiName}</h3>
      
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Category</th>
              <th>Impact</th>
              <th>Occurrences</th>
              <th>Contribution</th>
            </tr>
          </thead>
          <tbody>
            {rootCauses.map((cause, index) => (
              <tr key={index}>
                <td>{cause.factor}</td>
                <td>{cause.category}</td>
                <td className={cause.impact > 0 ? 'text-green-600' : 'text-red-600'}>
                  {cause.impact > 0 ? '+' : ''}{cause.impact}%
                </td>
                <td>
                  {cause.occurrences} in {cause.percentage}% ({cause.occurrences}/{cause.totalCases}) cases
                </td>
                <td>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${cause.impact > 0 ? 'bg-green-600' : 'bg-red-600'}`}
                      style={{ width: `${Math.abs(cause.percentage)}%` }}
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
