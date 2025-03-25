'use client';

import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import KPICard from '../components/KPICard';
import FilterBar from '../components/FilterBar';
import Tabs from '../components/Tabs';
import ProcessFlow from '../components/ProcessFlow';
import BarChart from '../components/BarChart';
import DataTable from '../components/DataTable';

export default function Home() {
  // Mock data for demonstration
  const kpiData = [
    { title: 'Total Cases', value: '5,000' },
    { title: 'Conformant Cases', value: '3,452', trend: 5, trendLabel: 'vs. last month' },
    { title: 'Average Lead Time', value: '4.8 days', trend: -12, trendLabel: 'vs. last month' },
    { title: 'On-Time Delivery', value: '72%', trend: 3, trendLabel: 'vs. last month' },
  ];

  const materialGroups = ['Power Tools', 'Safety equipment', 'Building Materials', 'Fasteners', 'Agriculture', 'Fertilizers'];
  const companies = ['Drystone Belgium NV', 'Drystone Australia Ltd', 'Drystone Mexico Inc', 'Drystone UK Ltd'];
  const regions = ['Europe', 'Asia-Pacific', 'Americas'];

  const [filters, setFilters] = React.useState({});
  const [activeTab, setActiveTab] = React.useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'rework', label: 'Rework' },
    { id: 'bottlenecks', label: 'Bottlenecks' },
    { id: 'automation', label: 'Automation' },
    { id: 'cashflow', label: 'Cashflow' },
    { id: 'exceptions', label: 'Exceptions' },
    { id: 'root-causes', label: 'Root causes' },
  ];

  // Mock process flow data
  const processNodes = [
    { id: 'node1', label: 'Receive Purchase Order', count: 5000, isConformant: true },
    { id: 'node2', label: 'Create Sales Order', count: 4950, isConformant: true },
    { id: 'node3', label: 'Change Net Price in Sales Order', count: 1450, isConformant: true },
    { id: 'node4', label: 'Create Delivery', count: 4800, isConformant: true },
    { id: 'node5', label: 'Create Shipment', count: 4750, isConformant: true },
    { id: 'node6', label: 'Issue Goods', count: 4700, isConformant: true },
    { id: 'node7', label: 'Create Invoice', count: 4650, isConformant: true },
    { id: 'node8', label: 'Clear Invoice', count: 4600, isConformant: true },
  ];

  const processEdges = [
    { source: 'node1', target: 'node2', value: 4950 },
    { source: 'node2', target: 'node3', value: 1450 },
    { source: 'node3', target: 'node4', value: 1450 },
    { source: 'node2', target: 'node4', value: 3350 },
    { source: 'node4', target: 'node5', value: 4750 },
    { source: 'node5', target: 'node6', value: 4700 },
    { source: 'node6', target: 'node7', value: 4650 },
    { source: 'node7', target: 'node8', value: 4600 },
  ];

  // Mock chart data
  const leadTimeData = [
    { label: 'Drystone Belgium', value: 15.7, color: 'bg-red-500' },
    { label: 'Drystone Australia', value: 14.3, color: 'bg-red-500' },
    { label: 'Drystone Mexico', value: 8.9, color: 'bg-red-500' },
    { label: 'Drystone Austria', value: 7.0, color: 'bg-red-500' },
    { label: 'Drystone Malaysia', value: 6.5, color: 'bg-red-500' },
    { label: 'Drystone France', value: 6.2, color: 'bg-red-500' },
    { label: 'Drystone China', value: 6.1, color: 'bg-red-500' },
    { label: 'Drystone Deutschland', value: 5.1, color: 'bg-red-500' },
    { label: 'Drystone India', value: 4.8, color: 'bg-green-500' },
    { label: 'Drystone Italia', value: 4.8, color: 'bg-green-500' },
    { label: 'Drystone Spain', value: 4.2, color: 'bg-green-500' },
    { label: 'Drystone US Inc', value: 3.8, color: 'bg-green-500' },
    { label: 'Drystone Ireland', value: 2.9, color: 'bg-green-500' },
    { label: 'Drystone UK Ltd', value: 2.2, color: 'bg-green-500' },
  ];

  // Mock table data
  const deviatingFlowsData = [
    { 
      flow: 'Create Invoice occurred directly after Create Invoice', 
      percentage: '21.6%', 
      duration: '-1.0 days', 
      events: '0.7 events' 
    },
    { 
      flow: 'Create Invoice occurred directly after Create Shipment', 
      percentage: '7.2%', 
      duration: '2.7 days', 
      events: '-0.2 events' 
    },
    { 
      flow: 'Clear Invoice is the starting event', 
      percentage: '5.4%', 
      duration: '189.5 days', 
      events: '0.5 events' 
    },
    { 
      flow: 'Create Shipment occurred directly after Create Sales Order', 
      percentage: '1.0%', 
      duration: '-4.7 days', 
      events: '0.0 events' 
    },
    { 
      flow: 'Create Delivery occurred directly after Create Invoice', 
      percentage: '0.9%', 
      duration: '-6.8 days', 
      events: '4.0 events' 
    },
  ];

  const deviatingFlowsColumns = [
    { header: 'Deviating Flow', accessor: 'flow' },
    { header: '%', accessor: 'percentage' },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Events', accessor: 'events' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Process Mining Dashboard</h1>
        <p className="text-gray-600">
          Analyze your business processes, identify bottlenecks, and improve efficiency
        </p>
      </div>

      <FilterBar 
        onFilterChange={setFilters}
        filters={filters}
        materialGroups={materialGroups}
        companies={companies}
        regions={regions}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi, index) => (
          <KPICard 
            key={index}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            trendLabel={kpi.trendLabel}
          />
        ))}
      </div>

      <Tabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <ProcessFlow 
            nodes={processNodes}
            edges={processEdges}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart 
              data={leadTimeData}
              title="Lead Times by Company (days)"
              xAxisLabel="Company"
              yAxisLabel="Days"
              height={400}
            />
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Deviating Flows</h3>
              <DataTable 
                data={deviatingFlowsData}
                columns={deviatingFlowsColumns}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
