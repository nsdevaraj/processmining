'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import KPICard from '../../components/KPICard';
import BarChart from '../../components/BarChart';

export default function LeadTime() {
  // Mock data for demonstration
  const kpiData = [
    { title: 'Selected Data Median', value: '2.6 days' },
    { title: 'Selected Data Median', value: '4.1 days' },
    { title: 'All Data Median', value: '3.1 days' },
    { title: 'All Data Average', value: '4.8 days' },
  ];

  const materialGroups = ['Power Tools', 'Safety equipment', 'Building Materials', 'Fasteners', 'Agriculture', 'Fertilizers'];
  const companies = ['Drystone Belgium NV', 'Drystone Australia Ltd', 'Drystone Mexico Inc', 'Drystone UK Ltd'];
  const regions = ['Europe', 'Asia-Pacific', 'Americas'];

  const [filters, setFilters] = React.useState({});

  // Mock lead time data for selected data
  const leadTimeSelectedData = [
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

  // Mock lead time data for all data
  const leadTimeAllData = [
    { label: 'Drystone Austria', value: 8.0, color: 'bg-red-500' },
    { label: 'Drystone India', value: 7.1, color: 'bg-red-500' },
    { label: 'Drystone China', value: 7.1, color: 'bg-red-500' },
    { label: 'Drystone Malaysia', value: 6.4, color: 'bg-red-500' },
    { label: 'Drystone Australia', value: 6.2, color: 'bg-red-500' },
    { label: 'Drystone France', value: 6.1, color: 'bg-red-500' },
    { label: 'Drystone Belgium', value: 5.8, color: 'bg-red-500' },
    { label: 'Drystone Deutschland', value: 5.3, color: 'bg-red-500' },
    { label: 'Drystone Mexico', value: 5.1, color: 'bg-red-500' },
    { label: 'Drystone UK Ltd', value: 5.0, color: 'bg-red-500' },
    { label: 'Drystone Italia', value: 4.9, color: 'bg-green-500' },
    { label: 'Drystone US Inc', value: 4.4, color: 'bg-green-500' },
    { label: 'Drystone Spain', value: 4.2, color: 'bg-green-500' },
    { label: 'Drystone Ireland', value: 3.2, color: 'bg-green-500' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Lead Time Analyzer</h1>
        <p className="text-gray-600">
          Analyze process lead times across different dimensions
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
          />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start event</label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
              <option>Create Sales Order</option>
              <option>Receive Purchase Order</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End event</label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
              <option>Create Invoice</option>
              <option>Clear Invoice</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pick as start event</label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
              <option>First</option>
              <option>Last</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pick as end event</label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
              <option>Last</option>
              <option>First</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time unit</label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
              <option>Days</option>
              <option>Hours</option>
              <option>Minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attribute</label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
              <option>SO: Company Code</option>
              <option>SO: Material Group</option>
              <option>SO: Customer</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="flex items-center">
              <input type="checkbox" id="business-calendar" className="mr-2" checked />
              <label htmlFor="business-calendar" className="text-sm">Use business calendar</label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">Lead Times - Selected Data</h3>
        <BarChart 
          data={leadTimeSelectedData}
          height={400}
          xAxisLabel="Company"
          yAxisLabel="Days"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Lead Times - All Data</h3>
        <BarChart 
          data={leadTimeAllData}
          height={400}
          xAxisLabel="Company"
          yAxisLabel="Days"
        />
      </div>
    </DashboardLayout>
  );
}
