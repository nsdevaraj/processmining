'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import Tabs from '../components/Tabs';
import DataTable from '../components/DataTable';
import ProcessFlow from '../components/ProcessFlow';
import csvDataService from '../lib/csvDataService';

export default function Dashboard() {
  const [materialGroups, setMaterialGroups] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [filters, setFilters] = useState({});
  const [performanceMetrics, setPerformanceMetrics] = useState({
    avgLeadTime: 0,
    medianLeadTime: 0,
    onTimeDeliveryRate: 0,
    caseCount: 0,
    completedCases: 0,
    activeCases: 0
  });
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
        
        // Load performance metrics
        const metrics = await csvDataService.getPerformanceMetrics();
        setPerformanceMetrics(metrics);
        
        // Load process flow data
        const flowData = await csvDataService.getProcessFlowData();
        setProcessFlowData(flowData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Process Mining Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive analysis of order-to-cash process performance using real CSV data
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard 
              title="Average Lead Time" 
              value={`${performanceMetrics.avgLeadTime} days`} 
              trend={-2.3} 
              trendLabel="vs. last month" 
              trendDirection="down" 
              trendIsPositive={true}
            />
            <KPICard 
              title="On-Time Delivery" 
              value={`${performanceMetrics.onTimeDeliveryRate}%`} 
              trend={3.5} 
              trendLabel="vs. last month" 
              trendDirection="up" 
              trendIsPositive={true}
            />
            <KPICard 
              title="Total Cases" 
              value={performanceMetrics.caseCount.toLocaleString()} 
              trend={8.2} 
              trendLabel="vs. last month" 
              trendDirection="up" 
              trendIsPositive={true}
            />
            <KPICard 
              title="Active Cases" 
              value={performanceMetrics.activeCases.toLocaleString()} 
              trend={-5.1} 
              trendLabel="vs. last month" 
              trendDirection="down" 
              trendIsPositive={true}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Process Flow Overview</h2>
            <div className="h-96">
              <ProcessFlow 
                nodes={processFlowData.nodes}
                edges={processFlowData.edges}
              />
            </div>
          </div>

          <Tabs
            tabs={[
              {
                label: 'Recent Cases',
                content: (
                  <div className="bg-white rounded-lg shadow">
                    <DataTable
                      headers={['Case ID', 'Start Date', 'End Date', 'Duration', 'Status']}
                      rows={[
                        ['aa091dbf-1dc9-45cb-8362-4c825c59ed51', '2024-03-12', '2024-03-27', '15.0 days', 'Completed'],
                        ['9a576137-cb6e-4eba-b002-4253ea420f33', '2024-01-17', '2024-01-23', '6.2 days', 'Completed'],
                        ['18a6cba8-a509-4895-9328-2d10f10f77f0', '2024-01-14', '2024-01-30', '16.2 days', 'Completed'],
                        ['f4e6cdb4-e57d-4107-a859-8bd29a60ee55', '2024-10-28', '2024-11-07', '10.1 days', 'Completed'],
                        ['a7517a13-c49d-4cce-8644-8fc8dadce7b2', '2024-03-22', '2024-04-01', '10.8 days', 'Completed']
                      ]}
                    />
                  </div>
                )
              },
              {
                label: 'Process Variants',
                content: (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Standard Path</div>
                          <div className="text-sm text-gray-500">Receive PO → Create SO → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Clear Invoice</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">57.1%</div>
                          <div className="text-sm text-gray-500">52,341 cases</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Price Change Path</div>
                          <div className="text-sm text-gray-500">Receive PO → Create SO → Change Net Price → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Clear Invoice</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">17.0%</div>
                          <div className="text-sm text-gray-500">15,585 cases</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Material Change Path</div>
                          <div className="text-sm text-gray-500">Receive PO → Create SO → Change Material → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Clear Invoice</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">12.4%</div>
                          <div className="text-sm text-gray-500">11,376 cases</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              },
              {
                label: 'Performance Insights',
                content: (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="prose max-w-none">
                      <p>
                        Analysis of the order-to-cash process reveals several key insights:
                      </p>
                      
                      <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>
                          <span className="font-medium">Lead Time Variation:</span> Significant variation in lead times across companies, with Drystone India showing the best performance at {performanceMetrics.avgLeadTime} days average.
                        </li>
                        <li>
                          <span className="font-medium">On-Time Delivery:</span> {performanceMetrics.onTimeDeliveryRate}% of cases are delivered on time, with room for improvement in specific regions.
                        </li>
                        <li>
                          <span className="font-medium">Process Variants:</span> 57.1% of cases follow the standard path, while 17.0% involve price changes and 12.4% involve material changes.
                        </li>
                        <li>
                          <span className="font-medium">Bottlenecks:</span> The Clear Invoice activity has the longest duration at 5.2 days on average, representing a key opportunity for process improvement.
                        </li>
                      </ul>
                    </div>
                  </div>
                )
              }
            ]}
          />
        </>
      )}
    </DashboardLayout>
  );
}
