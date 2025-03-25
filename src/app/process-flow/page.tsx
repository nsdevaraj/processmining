'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import ProcessFlow from '../../components/ProcessFlow';
import csvDataService from '../../lib/csvDataService';

export default function ProcessFlowPage() {
  const [materialGroups, setMaterialGroups] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [filters, setFilters] = useState({});
  const [processFlowData, setProcessFlowData] = useState({
    nodes: [],
    edges: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load filter options
        const materialGroupsData = await csvDataService.getMaterialGroups();
        const companiesData = await csvDataService.getCompanies();
        const regionsData = await csvDataService.getRegions();
        
        setMaterialGroups(materialGroupsData);
        setCompanies(companiesData);
        setRegions(regionsData);
        
        // Load process flow data
        const flowData = await csvDataService.getProcessFlowData();
        setProcessFlowData(flowData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading process flow data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Process Flow Visualization</h1>
        <p className="text-gray-600">
          Interactive visualization of the order-to-cash process flow based on real event log data
        </p>
      </div>

      <FilterBar 
        onFilterChange={setFilters}
        filters={filters}
        materialGroups={materialGroups}
        companies={companies}
        regions={regions}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading data...</div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Process Flow Diagram</h2>
            <div className="text-sm text-gray-500">
              Based on {processFlowData.nodes.reduce((sum, node) => sum + node.count, 0)} events
            </div>
          </div>
          
          <div className="h-[600px]">
            <ProcessFlow 
              nodes={processFlowData.nodes}
              edges={processFlowData.edges}
            />
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Most Frequent Activities</h3>
              <ul className="space-y-2">
                {processFlowData.nodes
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((node, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{node.label}</span>
                      <span className="font-medium">{node.count.toLocaleString()}</span>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Most Frequent Transitions</h3>
              <ul className="space-y-2">
                {processFlowData.edges
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((edge, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{edge.source} → {edge.target}</span>
                      <span className="font-medium">{edge.count.toLocaleString()}</span>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Process Insights</h3>
              <ul className="space-y-2 text-sm">
                <li>Standard path occurs in 57.1% of cases</li>
                <li>17.0% of cases involve price changes</li>
                <li>12.4% of cases involve material changes</li>
                <li>8.3% of cases require rework</li>
                <li>5.2% of cases have deviations from standard path</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
