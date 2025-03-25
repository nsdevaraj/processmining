'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import KPICard from '../../components/KPICard';
import ProgressBar from '../../components/ProgressBar';
import DataTable from '../../components/DataTable';

export default function Conformance() {
  // Mock data for demonstration
  const kpiData = [
    { title: 'Total Cases', value: '5,000' },
    { title: 'Conformant Cases', value: '3,452', trend: 5, trendLabel: 'vs. last month' },
    { title: 'Conformance Rate', value: '72%', trend: 3, trendLabel: 'vs. last month' },
    { title: 'Avg. Deviation Cost', value: '$245', trend: -8, trendLabel: 'vs. last month' },
  ];

  const materialGroups = ['Power Tools', 'Safety equipment', 'Building Materials', 'Fasteners', 'Agriculture', 'Fertilizers'];
  const companies = ['Drystone Belgium NV', 'Drystone Australia Ltd', 'Drystone Mexico Inc', 'Drystone UK Ltd'];
  const regions = ['Europe', 'Asia-Pacific', 'Americas'];

  const [filters, setFilters] = React.useState({});

  // Mock conformance data by material group
  const conformanceByMaterialGroup = [
    { group: 'Power Tools', conformant: 17760, total: 41302, percentage: 43 },
    { group: 'Safety equipment', conformant: 13182, total: 29293, percentage: 45 },
    { group: 'Building Materials', conformant: 9349, total: 30158, percentage: 31 },
    { group: 'Fasteners', conformant: 8935, total: 15675, percentage: 57 },
    { group: 'Agriculture', conformant: 8594, total: 25276, percentage: 34 },
  ];

  // Mock deviating flows data
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
    { 
      flow: 'Create Invoice occurred directly after Create Sales Order', 
      percentage: '0.7%', 
      duration: '-32.5 days', 
      events: '1.3 events' 
    },
    { 
      flow: 'Clear Invoice occurred directly after Clear Invoice', 
      percentage: '0.6%', 
      duration: '-14.5 days', 
      events: '0.0 events' 
    },
  ];

  const deviatingFlowsColumns = [
    { header: 'Deviating Flow', accessor: 'flow' },
    { header: '%', accessor: 'percentage' },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Events', accessor: 'events' },
  ];

  // Mock undesired activities data
  const undesiredActivitiesData = [
    { 
      activity: 'Deactivate Billing Block', 
      percentage: '8.3%', 
      duration: '6.5 days', 
      events: '1.9 events' 
    },
    { 
      activity: 'Change Manual Price in Sales Order', 
      percentage: '4.6%', 
      duration: '-3.4 days', 
      events: '2.7 events' 
    },
    { 
      activity: 'Deactivate Delivery Block', 
      percentage: '4.5%', 
      duration: '18.1 days', 
      events: '1.8 events' 
    },
    { 
      activity: 'Change Material in Sales Order', 
      percentage: '3.0%', 
      duration: '9.3 days', 
      events: '1.6 events' 
    },
    { 
      activity: 'Reject Sales Order', 
      percentage: '1.2%', 
      duration: '17.7 days', 
      events: '3.2 events' 
    },
    { 
      activity: 'Cancel Sales Order Rejection', 
      percentage: '1.0%', 
      duration: '29.3 days', 
      events: '3.8 events' 
    },
  ];

  const undesiredActivitiesColumns = [
    { header: 'Undesired Activity', accessor: 'activity' },
    { header: '%', accessor: 'percentage' },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Events', accessor: 'events' },
  ];

  // Mock process variants data
  const processVariantsData = [
    { 
      variant: 'Receive Purchase Order → Create Sales Order → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Clear Invoice', 
      cases: 3176, 
      percentage: '63.5%',
      duration: '34 days'
    },
    { 
      variant: 'Receive Purchase Order → Create Sales Order → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Clear Invoice', 
      cases: 2533, 
      percentage: '50.7%',
      duration: '91 days'
    },
    { 
      variant: 'Receive Purchase Order → Create Sales Order → Change Net Price in Sales Order → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Clear Invoice', 
      cases: 1450, 
      percentage: '29.0%',
      duration: '81 days'
    },
    { 
      variant: 'Clear Invoice → Receive Purchase Order → Create Sales Order → Create Delivery → Create Shipment → Issue Goods → Create Invoice', 
      cases: 1064, 
      percentage: '21.3%',
      duration: '268 days'
    },
    { 
      variant: 'Clear Invoice → Receive Purchase Order → Create Sales Order → Create Delivery → Create Shipment → Issue Goods → Create Invoice', 
      cases: 694, 
      percentage: '13.9%',
      duration: '300 days'
    },
  ];

  const processVariantsColumns = [
    { header: 'Process Variant', accessor: 'variant' },
    { header: 'Cases', accessor: 'cases' },
    { header: '%', accessor: 'percentage' },
    { header: 'Avg. Duration', accessor: 'duration' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Conformance Checking</h1>
        <p className="text-gray-600">
          Analyze how well your processes conform to the expected model
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

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">Conformance Success</h3>
        <ProgressBar 
          value={28525}
          total={66106}
          label="Overall Conformance"
          successColor="bg-green-500"
          failureColor="bg-red-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-4">Conformance by Material Group</h3>
        <div className="space-y-4">
          {conformanceByMaterialGroup.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{item.group}</span>
                <span className="text-sm text-gray-500">{item.conformant} cases</span>
              </div>
              <ProgressBar 
                value={item.conformant}
                total={item.total}
                showPercentage={false}
                successColor="bg-blue-500"
                failureColor="bg-gray-200"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Deviating Flows</h3>
          <DataTable 
            data={deviatingFlowsData}
            columns={deviatingFlowsColumns}
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Undesired Activities</h3>
          <DataTable 
            data={undesiredActivitiesData}
            columns={undesiredActivitiesColumns}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Process Variants</h3>
        <DataTable 
          data={processVariantsData}
          columns={processVariantsColumns}
        />
      </div>
    </DashboardLayout>
  );
}
