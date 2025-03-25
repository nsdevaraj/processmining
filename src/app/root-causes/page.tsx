'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import RootCauseAnalysis from '../../components/RootCauseAnalysis';

export default function RootCauses() {
  const materialGroups = ['Power Tools', 'Safety equipment', 'Building Materials', 'Fasteners', 'Agriculture', 'Fertilizers'];
  const companies = ['Drystone Belgium NV', 'Drystone Australia Ltd', 'Drystone Mexico Inc', 'Drystone UK Ltd'];
  const regions = ['Europe', 'Asia-Pacific', 'Americas'];

  const [filters, setFilters] = React.useState({});
  
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
        <h1 className="text-2xl font-bold mb-2">Root Cause Analysis</h1>
        <p className="text-gray-600">
          Identify the root causes of process issues and performance problems
        </p>
      </div>

      <FilterBar 
        onFilterChange={setFilters}
        filters={filters}
        materialGroups={materialGroups}
        companies={companies}
        regions={regions}
      />

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Attribute</label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
              <option>Activity</option>
              <option>Resource</option>
              <option>Timestamp</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Case Attribute</label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
              <option>KPI: Material Changed</option>
              <option>KPI: On Time Delivery</option>
              <option>SO: Customer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contribution</label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
              <option>Show both</option>
              <option>Positive only</option>
              <option>Negative only</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Finding root causes for feature occurring in 17% (15.6K) cases.</p>
          <p className="text-sm font-medium">Cases with event Activity is Change Net Price in Sales Order</p>
        </div>
      </div>

      <RootCauseAnalysis 
        rootCauses={rootCauses}
        kpiName="Change Net Price in Sales Order"
      />

      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h3 className="text-lg font-medium mb-4">Root Cause Interpretation</h3>
        <div className="prose max-w-none">
          <p>The root cause analysis reveals several key factors influencing the occurrence of price changes in sales orders:</p>
          
          <h4 className="font-medium mt-4">Key Findings:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">On-Time Delivery Impact:</span> Cases with "No" for on-time delivery are 21% more likely to have price changes, suggesting that delayed deliveries often result in price adjustments.
            </li>
            <li>
              <span className="font-medium">Regional Variations:</span> United Kingdom customers show 15% fewer price changes than average, indicating more stable pricing in this market.
            </li>
            <li>
              <span className="font-medium">Company-Specific Patterns:</span> Drystone UK Ltd has 13% fewer price changes, while Drystone India Ltd has 4.6% more price changes than average, pointing to different pricing practices across subsidiaries.
            </li>
            <li>
              <span className="font-medium">Product Category Effect:</span> The Fertilizers material group shows 6% more price changes, possibly due to market volatility or seasonal pricing adjustments in this category.
            </li>
            <li>
              <span className="font-medium">Payment Terms Correlation:</span> Orders with 60-day payment terms show 3.6% more price changes, suggesting a relationship between extended payment terms and price negotiations.
            </li>
          </ul>
          
          <h4 className="font-medium mt-4">Recommendations:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Implement more robust initial pricing strategies for the Fertilizers category to reduce subsequent adjustments</li>
            <li>Investigate pricing practices at Drystone India Ltd to understand the higher rate of price changes</li>
            <li>Review the relationship between delivery performance and price changes to reduce adjustment frequency</li>
            <li>Consider adopting the more stable pricing approach used with UK customers across other regions</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
