'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import PerformanceMetrics from '../../components/PerformanceMetrics';
import BottleneckAnalysis from '../../components/BottleneckAnalysis';
import ActivityDurationAnalysis from '../../components/ActivityDurationAnalysis';
import CaseVariantAnalysis from '../../components/CaseVariantAnalysis';
import LeadTimeDistribution from '../../components/LeadTimeDistribution';
import BarChart from '../../components/BarChart';

export default function PerformanceAnalysis() {
  const materialGroups = ['Power Tools', 'Safety equipment', 'Building Materials', 'Fasteners', 'Agriculture', 'Fertilizers'];
  const companies = ['Drystone Belgium NV', 'Drystone Australia Ltd', 'Drystone Mexico Inc', 'Drystone UK Ltd'];
  const regions = ['Europe', 'Asia-Pacific', 'Americas'];

  const [filters, setFilters] = React.useState({});

  // Mock performance metrics data
  const performanceMetricsData = [
    {
      category: 'Process Efficiency',
      metrics: [
        { name: 'Average Lead Time', value: '12.3 days', trend: 5, status: 'negative' },
        { name: 'Median Lead Time', value: '8.7 days', trend: -2, status: 'positive' },
        { name: 'Straight-Through Processing', value: '57%', trend: 3, status: 'positive' },
        { name: 'Rework Rate', value: '8.3%', trend: -1.5, status: 'positive' }
      ]
    },
    {
      category: 'Process Volume',
      metrics: [
        { name: 'Total Cases', value: '91,746' },
        { name: 'Completed Cases', value: '68,106', trend: 2.3, status: 'positive' },
        { name: 'Active Cases', value: '18,452' },
        { name: 'Cases per Day', value: '324', trend: 5.7, status: 'positive' }
      ]
    },
    {
      category: 'Process Quality',
      metrics: [
        { name: 'Conformance Rate', value: '72%', trend: 3.1, status: 'positive' },
        { name: 'First-Time-Right Rate', value: '81%', trend: 1.2, status: 'positive' },
        { name: 'Exception Rate', value: '12.4%', trend: -0.8, status: 'positive' },
        { name: 'SLA Compliance', value: '85.3%', trend: 2.5, status: 'positive' }
      ]
    }
  ];

  // Mock bottleneck analysis data
  const bottlenecksData = [
    {
      activity: 'Clear Invoice',
      avgDuration: '5.2 days',
      caseCount: 68106,
      impactScore: 87,
      waitTime: '4.1 days',
      processingTime: '1.1 days'
    },
    {
      activity: 'Create Delivery',
      avgDuration: '2.3 days',
      caseCount: 86704,
      impactScore: 65,
      waitTime: '1.8 days',
      processingTime: '0.5 days'
    },
    {
      activity: 'Create Shipment',
      avgDuration: '1.8 days',
      caseCount: 85513,
      impactScore: 52,
      waitTime: '1.2 days',
      processingTime: '0.6 days'
    },
    {
      activity: 'Create Invoice',
      avgDuration: '1.4 days',
      caseCount: 81858,
      impactScore: 43,
      waitTime: '0.9 days',
      processingTime: '0.5 days'
    },
    {
      activity: 'Create Sales Order',
      avgDuration: '1.2 days',
      caseCount: 91746,
      impactScore: 38,
      waitTime: '0.7 days',
      processingTime: '0.5 days'
    }
  ];

  // Mock activity duration analysis data
  const activityDurationData = [
    {
      name: 'Receive Purchase Order',
      avgDuration: '0.5 days',
      medianDuration: '0.4 days',
      minDuration: '0.1 days',
      maxDuration: '3.2 days',
      caseCount: 91746,
      trend: -5
    },
    {
      name: 'Create Sales Order',
      avgDuration: '1.2 days',
      medianDuration: '0.9 days',
      minDuration: '0.2 days',
      maxDuration: '7.5 days',
      caseCount: 91746,
      trend: 2
    },
    {
      name: 'Change Net Price in Sales Order',
      avgDuration: '0.7 days',
      medianDuration: '0.5 days',
      minDuration: '0.1 days',
      maxDuration: '4.3 days',
      caseCount: 15585,
      trend: -3
    },
    {
      name: 'Create Delivery',
      avgDuration: '2.3 days',
      medianDuration: '1.8 days',
      minDuration: '0.3 days',
      maxDuration: '12.6 days',
      caseCount: 86704,
      trend: 8
    },
    {
      name: 'Create Shipment',
      avgDuration: '1.8 days',
      medianDuration: '1.5 days',
      minDuration: '0.2 days',
      maxDuration: '9.4 days',
      caseCount: 85513,
      trend: 4
    },
    {
      name: 'Issue Goods',
      avgDuration: '1.1 days',
      medianDuration: '0.8 days',
      minDuration: '0.1 days',
      maxDuration: '6.7 days',
      caseCount: 83137,
      trend: -2
    },
    {
      name: 'Create Invoice',
      avgDuration: '1.4 days',
      medianDuration: '1.1 days',
      minDuration: '0.2 days',
      maxDuration: '8.3 days',
      caseCount: 81858,
      trend: 1
    },
    {
      name: 'Clear Invoice',
      avgDuration: '5.2 days',
      medianDuration: '4.5 days',
      minDuration: '0.5 days',
      maxDuration: '32.8 days',
      caseCount: 68106,
      trend: 7
    }
  ];

  // Mock case variant analysis data
  const caseVariantData = [
    {
      id: 'variant-1',
      path: 'Receive Purchase Order → Create Sales Order → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Clear Invoice',
      caseCount: 52341,
      percentage: 57.1,
      avgDuration: '10.2 days',
      conformant: true
    },
    {
      id: 'variant-2',
      path: 'Receive Purchase Order → Create Sales Order → Change Net Price → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Clear Invoice',
      caseCount: 15585,
      percentage: 17.0,
      avgDuration: '12.8 days',
      conformant: true
    },
    {
      id: 'variant-3',
      path: 'Receive Purchase Order → Create Sales Order → Create Invoice → Create Delivery → Create Shipment → Issue Goods → Clear Invoice',
      caseCount: 6452,
      percentage: 7.0,
      avgDuration: '14.5 days',
      conformant: false
    },
    {
      id: 'variant-4',
      path: 'Receive Purchase Order → Create Sales Order → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Create Invoice → Clear Invoice',
      caseCount: 5872,
      percentage: 6.4,
      avgDuration: '13.7 days',
      conformant: false
    },
    {
      id: 'variant-5',
      path: 'Receive Purchase Order → Create Sales Order → Create Delivery → Create Shipment → Issue Goods',
      caseCount: 4231,
      percentage: 4.6,
      avgDuration: '7.3 days',
      conformant: false
    }
  ];

  // Mock lead time distribution data
  const leadTimeDistributionData = [
    {
      category: 'Overall Lead Time Distribution',
      distribution: [
        { range: '0-5 days', count: 12543, percentage: 13.7 },
        { range: '5-10 days', count: 28976, percentage: 31.6 },
        { range: '10-15 days', count: 24321, percentage: 26.5 },
        { range: '15-20 days', count: 14532, percentage: 15.8 },
        { range: '20-30 days', count: 7865, percentage: 8.6 },
        { range: '30+ days', count: 3509, percentage: 3.8 }
      ]
    },
    {
      category: 'Lead Time by Region',
      distribution: [
        { range: 'Europe', count: 42567, percentage: 46.4 },
        { range: 'Asia-Pacific', count: 31254, percentage: 34.1 },
        { range: 'Americas', count: 17925, percentage: 19.5 }
      ]
    }
  ];

  // Mock lead time by company data for bar chart
  const leadTimeByCompanyData = [
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
    { label: 'Drystone UK Ltd', value: 2.2, color: 'bg-green-500' }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Performance Analysis</h1>
        <p className="text-gray-600">
          Comprehensive analysis of process performance metrics, bottlenecks, and lead times
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
        <PerformanceMetrics metrics={performanceMetricsData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart 
            data={leadTimeByCompanyData}
            title="Lead Times by Company (days)"
            xAxisLabel="Company"
            yAxisLabel="Days"
            height={400}
          />
          
          <LeadTimeDistribution leadTimeData={leadTimeDistributionData} />
        </div>
        
        <BottleneckAnalysis bottlenecks={bottlenecksData} />
        
        <ActivityDurationAnalysis activities={activityDurationData} />
        
        <CaseVariantAnalysis variants={caseVariantData} />
      </div>
    </DashboardLayout>
  );
}
