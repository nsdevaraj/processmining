'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import ConformanceChecking from '../../components/ConformanceChecking';
import DeviatingFlows from '../../components/DeviatingFlows';
import UndesiredActivities from '../../components/UndesiredActivities';
import ConformanceByGroup from '../../components/ConformanceByGroup';
import ProgressBar from '../../components/ProgressBar';

export default function ConformanceAnalysis() {
  const materialGroups = ['Power Tools', 'Safety equipment', 'Building Materials', 'Fasteners', 'Agriculture', 'Fertilizers'];
  const companies = ['Drystone Belgium NV', 'Drystone Australia Ltd', 'Drystone Mexico Inc', 'Drystone UK Ltd'];
  const regions = ['Europe', 'Asia-Pacific', 'Americas'];

  const [filters, setFilters] = React.useState({});

  // Mock conformance data
  const conformanceData = {
    totalCases: 91746,
    conformantCases: 66106,
    nonConformantCases: 25640,
    conformanceRate: 72,
    deviations: [
      {
        type: 'Skipped Activity',
        count: 12543,
        percentage: 13.7,
        impact: 'Medium impact on process duration (+2.3 days)'
      },
      {
        type: 'Activity Order Violation',
        count: 8765,
        percentage: 9.6,
        impact: 'High impact on process quality (23% higher rejection rate)'
      },
      {
        type: 'Unexpected Activity',
        count: 3421,
        percentage: 3.7,
        impact: 'Low impact on process outcome'
      },
      {
        type: 'Repeated Activity',
        count: 911,
        percentage: 1.0,
        impact: 'Medium impact on process cost (+$45 per case)'
      }
    ]
  };

  // Mock deviating flows data
  const deviatingFlowsData = [
    { 
      flow: 'Create Invoice occurred directly after Create Invoice', 
      percentage: '21.6%', 
      duration: '-1.0 days', 
      events: '0.7 events',
      impact: 'high'
    },
    { 
      flow: 'Create Invoice occurred directly after Create Shipment', 
      percentage: '7.2%', 
      duration: '2.7 days', 
      events: '-0.2 events',
      impact: 'medium'
    },
    { 
      flow: 'Clear Invoice is the starting event', 
      percentage: '5.4%', 
      duration: '189.5 days', 
      events: '0.5 events',
      impact: 'high'
    },
    { 
      flow: 'Create Shipment occurred directly after Create Sales Order', 
      percentage: '1.0%', 
      duration: '-4.7 days', 
      events: '0.0 events',
      impact: 'low'
    },
    { 
      flow: 'Create Delivery occurred directly after Create Invoice', 
      percentage: '0.9%', 
      duration: '-6.8 days', 
      events: '4.0 events',
      impact: 'medium'
    },
    { 
      flow: 'Create Invoice occurred directly after Create Sales Order', 
      percentage: '0.7%', 
      duration: '-32.5 days', 
      events: '1.3 events',
      impact: 'medium'
    },
    { 
      flow: 'Clear Invoice occurred directly after Clear Invoice', 
      percentage: '0.6%', 
      duration: '-14.5 days', 
      events: '0.0 events',
      impact: 'low'
    }
  ];

  // Mock undesired activities data
  const undesiredActivitiesData = [
    { 
      activity: 'Deactivate Billing Block', 
      percentage: '8.3%', 
      duration: '6.5 days', 
      events: '1.9 events',
      impact: 'high'
    },
    { 
      activity: 'Change Manual Price in Sales Order', 
      percentage: '4.6%', 
      duration: '-3.4 days', 
      events: '2.7 events',
      impact: 'medium'
    },
    { 
      activity: 'Deactivate Delivery Block', 
      percentage: '4.5%', 
      duration: '18.1 days', 
      events: '1.8 events',
      impact: 'high'
    },
    { 
      activity: 'Change Material in Sales Order', 
      percentage: '3.0%', 
      duration: '9.3 days', 
      events: '1.6 events',
      impact: 'medium'
    },
    { 
      activity: 'Reject Sales Order', 
      percentage: '1.2%', 
      duration: '17.7 days', 
      events: '3.2 events',
      impact: 'high'
    },
    { 
      activity: 'Cancel Sales Order Rejection', 
      percentage: '1.0%', 
      duration: '29.3 days', 
      events: '3.8 events',
      impact: 'medium'
    }
  ];

  // Mock conformance by material group data
  const conformanceByMaterialGroupData = [
    { group: 'Power Tools', conformant: 17760, total: 41302, percentage: 43 },
    { group: 'Safety equipment', conformant: 13182, total: 29293, percentage: 45 },
    { group: 'Building Materials', conformant: 9349, total: 30158, percentage: 31 },
    { group: 'Fasteners', conformant: 8935, total: 15675, percentage: 57 },
    { group: 'Agriculture', conformant: 8594, total: 25276, percentage: 34 }
  ];

  // Mock conformance by company data
  const conformanceByCompanyData = [
    { name: 'Drystone UK Ltd', conformant: 15482, total: 19800, percentage: 78 },
    { name: 'Drystone Ireland Ltd', conformant: 8765, total: 12500, percentage: 70 },
    { name: 'Drystone US Inc', conformant: 9876, total: 14500, percentage: 68 },
    { name: 'Drystone Spain Co', conformant: 7654, total: 11300, percentage: 68 },
    { name: 'Drystone Italia S.P.A', conformant: 6543, total: 9800, percentage: 67 }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Conformance Analysis</h1>
        <p className="text-gray-600">
          Analyze how well your processes conform to the expected model and identify deviations
        </p>
      </div>

      <FilterBar 
        onFilterChange={setFilters}
        filters={filters}
        materialGroups={materialGroups}
        companies={companies}
        regions={regions}
      />

      <div className="space-y-6">
        <ConformanceChecking conformanceData={conformanceData} />
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-medium mb-4">Conformance Success</h3>
          <ProgressBar 
            value={conformanceData.conformantCases}
            total={conformanceData.totalCases}
            label="Overall Conformance"
            successColor="bg-green-500"
            failureColor="bg-red-500"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConformanceByGroup 
            title="Conformance by Material Group"
            groups={conformanceByMaterialGroupData}
          />
          
          <ConformanceByGroup 
            title="Top Conformant Companies"
            groups={conformanceByCompanyData}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeviatingFlows deviatingFlows={deviatingFlowsData} />
          <UndesiredActivities undesiredActivities={undesiredActivitiesData} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Conformance Insights</h3>
          <div className="prose max-w-none">
            <p>
              The conformance analysis reveals several key insights about the order-to-cash process:
            </p>
            
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <span className="font-medium">Overall Conformance Rate:</span> 72% of cases follow the expected process model, indicating room for improvement in process standardization.
              </li>
              <li>
                <span className="font-medium">Material Group Variations:</span> Significant conformance differences exist across material groups, with Fasteners showing the highest conformance (57%) and Building Materials the lowest (31%).
              </li>
              <li>
                <span className="font-medium">Common Deviations:</span> The most frequent deviation is "Create Invoice occurred directly after Create Invoice" (21.6% of cases), suggesting potential issues with the invoicing process.
              </li>
              <li>
                <span className="font-medium">Problematic Activities:</span> "Deactivate Billing Block" and "Deactivate Delivery Block" are the most common undesired activities, indicating frequent process blocks that require manual intervention.
              </li>
              <li>
                <span className="font-medium">Regional Differences:</span> UK and Ireland operations show higher conformance rates (78% and 70% respectively) compared to other regions, suggesting better process standardization in these locations.
              </li>
            </ul>
            
            <p className="mt-4">
              <span className="font-medium">Recommendations:</span>
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Investigate and address the root causes of duplicate invoice creation to reduce the most common deviation.</li>
              <li>Implement process improvements for Building Materials to increase the conformance rate from the current low level of 31%.</li>
              <li>Review and optimize the billing and delivery block processes to reduce the frequency of manual interventions.</li>
              <li>Document and share best practices from UK and Ireland operations to improve conformance in other regions.</li>
              <li>Establish regular conformance monitoring and implement targeted training for process areas with low conformance.</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
