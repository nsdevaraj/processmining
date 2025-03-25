'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import ProcessFlow from '../../components/ProcessFlow';
import RootCauseAnalysis from '../../components/RootCauseAnalysis';

export default function ProcessFlowPage() {
  const materialGroups = ['Power Tools', 'Safety equipment', 'Building Materials', 'Fasteners', 'Agriculture', 'Fertilizers'];
  const companies = ['Drystone Belgium NV', 'Drystone Australia Ltd', 'Drystone Mexico Inc', 'Drystone UK Ltd'];
  const regions = ['Europe', 'Asia-Pacific', 'Americas'];

  const [filters, setFilters] = React.useState({});

  // Mock process flow data
  const processNodes = [
    { id: 'node1', label: 'Receive Purchase Order', count: 91746, isConformant: true },
    { id: 'node2', label: 'Create Sales Order', count: 91746, isConformant: true },
    { id: 'node3', label: 'Change Net Price in Sales Order', count: 15585, isConformant: true },
    { id: 'node4', label: 'Create Delivery', count: 86704, isConformant: true },
    { id: 'node5', label: 'Create Shipment', count: 85513, isConformant: true },
    { id: 'node6', label: 'Issue Goods', count: 83137, isConformant: true },
    { id: 'node7', label: 'Create Invoice', count: 81858, isConformant: true },
    { id: 'node8', label: 'Clear Invoice', count: 68106, isConformant: true },
    { id: 'node9', label: 'Reject Sales Order', count: 5188, isConformant: false },
  ];

  const processEdges = [
    { source: 'node1', target: 'node2', value: 91746 },
    { source: 'node2', target: 'node3', value: 15585 },
    { source: 'node2', target: 'node4', value: 76161 },
    { source: 'node3', target: 'node4', value: 15585 },
    { source: 'node4', target: 'node5', value: 85513 },
    { source: 'node5', target: 'node6', value: 83137 },
    { source: 'node6', target: 'node7', value: 81858 },
    { source: 'node7', target: 'node8', value: 68106 },
    { source: 'node2', target: 'node9', value: 5188 },
  ];

  // Mock root cause analysis data
  const rootCauses = [
    {
      factor: 'KPI: On Time Delivery',
      category: 'Yes',
      impact: -26,
      occurrences: 5800,
      totalCases: 57600,
      percentage: 10
    },
    {
      factor: 'KPI: On Time Delivery',
      category: 'No',
      impact: 21,
      occurrences: 7600,
      totalCases: 25500,
      percentage: 30
    },
    {
      factor: 'SO: Customer Country',
      category: 'United Kingdom',
      impact: -15,
      occurrences: 1900,
      totalCases: 24700,
      percentage: 7.8
    },
    {
      factor: 'SO: Company Code',
      category: 'Drystone UK Ltd',
      impact: -13,
      occurrences: 1400,
      totalCases: 19800,
      percentage: 7.1
    },
    {
      factor: 'SO: Material Group',
      category: 'Fertilizers',
      impact: 6.0,
      occurrences: 3400,
      totalCases: 14400,
      percentage: 23
    },
    {
      factor: 'SO: Company Code',
      category: 'Drystone India Ltd',
      impact: 4.6,
      occurrences: 1100,
      totalCases: 2300,
      percentage: 48
    },
    {
      factor: 'KPI: On Time Delivery',
      category: 'Goods not Issued or Confirmed Delivery Date',
      impact: 4.3,
      occurrences: 2100,
      totalCases: 8600,
      percentage: 25
    },
    {
      factor: 'SO: Payment term',
      category: '60 days from date of invoice',
      impact: 3.6,
      occurrences: 2900,
      totalCases: 14000,
      percentage: 21
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Process Flow Analysis</h1>
        <p className="text-gray-600">
          Visualize process flows and identify root causes of issues
        </p>
      </div>

      <FilterBar 
        onFilterChange={setFilters}
        filters={filters}
        materialGroups={materialGroups}
        companies={companies}
        regions={regions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Process Flow Visualization</h3>
          <ProcessFlow 
            nodes={processNodes}
            edges={processEdges}
          />
          <div className="mt-4 text-sm text-gray-500">
            <p>Note: The process flow shows the main path from Receive Purchase Order to Clear Invoice, with a deviation path for Reject Sales Order.</p>
          </div>
        </div>
        
        <RootCauseAnalysis 
          rootCauses={rootCauses}
          kpiName="Change Net Price in Sales Order"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Process Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Process Statistics</h4>
            <ul className="space-y-2">
              <li><span className="font-medium">Total Cases:</span> 91,746</li>
              <li><span className="font-medium">Completed Cases:</span> 68,106 (74.2%)</li>
              <li><span className="font-medium">Average Case Duration:</span> 12.3 days</li>
              <li><span className="font-medium">Median Case Duration:</span> 8.7 days</li>
              <li><span className="font-medium">Minimum Case Duration:</span> 3.2 days</li>
              <li><span className="font-medium">Maximum Case Duration:</span> 189.5 days</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Activity Statistics</h4>
            <ul className="space-y-2">
              <li><span className="font-medium">Total Activities:</span> 9</li>
              <li><span className="font-medium">Total Events:</span> 523,587</li>
              <li><span className="font-medium">Most Frequent Activity:</span> Create Sales Order (91,746 occurrences)</li>
              <li><span className="font-medium">Least Frequent Activity:</span> Reject Sales Order (5,188 occurrences)</li>
              <li><span className="font-medium">Bottleneck Activity:</span> Change Net Price in Sales Order (avg. 12.7h)</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
