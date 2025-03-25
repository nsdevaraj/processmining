import React from 'react';

interface ConformanceCheckingProps {
  conformanceData: {
    totalCases: number;
    conformantCases: number;
    nonConformantCases: number;
    conformanceRate: number;
    deviations: {
      type: string;
      count: number;
      percentage: number;
      impact: string;
    }[];
  };
}

const ConformanceChecking: React.FC<ConformanceCheckingProps> = ({ conformanceData }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Conformance Checking</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total Cases</div>
            <div className="text-2xl font-bold">{conformanceData.totalCases.toLocaleString()}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Conformant Cases</div>
            <div className="text-2xl font-bold text-green-600">{conformanceData.conformantCases.toLocaleString()}</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Non-Conformant Cases</div>
            <div className="text-2xl font-bold text-red-600">{conformanceData.nonConformantCases.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Conformance Rate</span>
            <span className="text-sm text-gray-500">{conformanceData.conformanceRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${conformanceData.conformanceRate}%` }}
            ></div>
          </div>
        </div>
        
        <h4 className="font-medium text-gray-700 mb-3">Conformance Deviations</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deviation Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {conformanceData.deviations.map((deviation, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {deviation.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {deviation.count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {deviation.percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {deviation.impact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConformanceChecking;
