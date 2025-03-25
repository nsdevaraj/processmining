'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import PerformanceMetrics from '../../components/PerformanceMetrics';
import BottleneckAnalysis from '../../components/BottleneckAnalysis';
import ActivityDurationAnalysis from '../../components/ActivityDurationAnalysis';
import CaseVariantAnalysis from '../../components/CaseVariantAnalysis';
import LeadTimeDistribution from '../../components/LeadTimeDistribution';
import BarChart from '../../components/BarChart';
import csvDataService from '../../lib/csvDataService';

export default function PerformanceAnalysis() {
  const [materialGroups, setMaterialGroups] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [filters, setFilters] = useState({});
  const [performanceMetricsData, setPerformanceMetricsData] = useState<any[]>([]);
  const [bottlenecksData, setBottlenecksData] = useState<any[]>([]);
  const [leadTimeByCompanyData, setLeadTimeByCompanyData] = useState<any[]>([]);
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
        
        // Format performance metrics for the component
        const formattedMetrics = [
          {
            category: 'Process Efficiency',
            metrics: [
              { name: 'Average Lead Time', value: `${metrics.avgLeadTime} days`, trend: -2.5, status: 'positive' },
              { name: 'Median Lead Time', value: `${metrics.medianLeadTime} days`, trend: -1.8, status: 'positive' },
              { name: 'Straight-Through Processing', value: '57%', trend: 3, status: 'positive' },
              { name: 'Rework Rate', value: '8.3%', trend: -1.5, status: 'positive' }
            ]
          },
          {
            category: 'Process Volume',
            metrics: [
              { name: 'Total Cases', value: metrics.caseCount.toLocaleString() },
              { name: 'Completed Cases', value: metrics.completedCases.toLocaleString(), trend: 2.3, status: 'positive' },
              { name: 'Active Cases', value: metrics.activeCases.toLocaleString() },
              { name: 'Cases per Day', value: '324', trend: 5.7, status: 'positive' }
            ]
          },
          {
            category: 'Process Quality',
            metrics: [
              { name: 'On-Time Delivery Rate', value: `${metrics.onTimeDeliveryRate}%`, trend: 3.1, status: 'positive' },
              { name: 'First-Time-Right Rate', value: '81%', trend: 1.2, status: 'positive' },
              { name: 'Exception Rate', value: '12.4%', trend: -0.8, status: 'positive' },
              { name: 'SLA Compliance', value: '85.3%', trend: 2.5, status: 'positive' }
            ]
          }
        ];
        
        setPerformanceMetricsData(formattedMetrics);
        
        // Load bottlenecks data
        const bottlenecks = await csvDataService.getBottlenecks();
        setBottlenecksData(bottlenecks);
        
        // Load lead time by company data
        const leadTimeByCompany = await csvDataService.getLeadTimeByCompany();
        setLeadTimeByCompanyData(leadTimeByCompany);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading performance analysis data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Mock activity duration analysis data (to be replaced with real data)
  const activityDurationData = [
    {
      name: 'Receive Purchase Order',
      avgDuration: '0.5 days',
      medianDuration: '0.4 days',
      minDuration: '0.1 days',
      maxDuration: '3.2 days',
      caseCount: 5000,
      trend: -5
    },
    {
      name: 'Create Sales Order',
      avgDuration: '1.2 days',
      medianDuration: '0.9 days',
      minDuration: '0.2 days',
      maxDuration: '7.5 days',
      caseCount: 5000,
      trend: 2
    },
    {
      name: 'Change Net Price in Sales Order',
      avgDuration: '0.7 days',
      medianDuration: '0.5 days',
      minDuration: '0.1 days',
      maxDuration: '4.3 days',
      caseCount: 850,
      trend: -3
    },
    {
      name: 'Create Delivery',
      avgDuration: '2.3 days',
      medianDuration: '1.8 days',
      minDuration: '0.3 days',
      maxDuration: '12.6 days',
      caseCount: 4800,
      trend: 8
    },
    {
      name: 'Create Shipment',
      avgDuration: '1.8 days',
      medianDuration: '1.5 days',
      minDuration: '0.2 days',
      maxDuration: '9.4 days',
      caseCount: 4750,
      trend: 4
    },
    {
      name: 'Issue Goods',
      avgDuration: '1.1 days',
      medianDuration: '0.8 days',
      minDuration: '0.1 days',
      maxDuration: '6.7 days',
      caseCount: 4700,
      trend: -2
    },
    {
      name: 'Create Invoice',
      avgDuration: '1.4 days',
      medianDuration: '1.1 days',
      minDuration: '0.2 days',
      maxDuration: '8.3 days',
      caseCount: 4650,
      trend: 1
    },
    {
      name: 'Clear Invoice',
      avgDuration: '5.2 days',
      medianDuration: '4.5 days',
      minDuration: '0.5 days',
      maxDuration: '32.8 days',
      caseCount: 4000,
      trend: 7
    }
  ];

  // Mock case variant analysis data (to be replaced with real data)
  const caseVariantData = [
    {
      id: 'variant-1',
      path: 'Receive Purchase Order → Create Sales Order → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Clear Invoice',
      caseCount: 2855,
      percentage: 57.1,
      avgDuration: '10.2 days',
      conformant: true
    },
    {
      id: 'variant-2',
      path: 'Receive Purchase Order → Create Sales Order → Change Net Price → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Clear Invoice',
      caseCount: 850,
      percentage: 17.0,
      avgDuration: '12.8 days',
      conformant: true
    },
    {
      id: 'variant-3',
      path: 'Receive Purchase Order → Create Sales Order → Create Invoice → Create Delivery → Create Shipment → Issue Goods → Clear Invoice',
      caseCount: 350,
      percentage: 7.0,
      avgDuration: '14.5 days',
      conformant: false
    },
    {
      id: 'variant-4',
      path: 'Receive Purchase Order → Create Sales Order → Create Delivery → Create Shipment → Issue Goods → Create Invoice → Create Invoice → Clear Invoice',
      caseCount: 320,
      percentage: 6.4,
      avgDuration: '13.7 days',
      conformant: false
    },
    {
      id: 'variant-5',
      path: 'Receive Purchase Order → Create Sales Order → Create Delivery → Create Shipment → Issue Goods',
      caseCount: 230,
      percentage: 4.6,
      avgDuration: '7.3 days',
      conformant: false
    }
  ];

  // Mock lead time distribution data (to be replaced with real data)
  const leadTimeDistributionData = [
    {
      category: 'Overall Lead Time Distribution',
      distribution: [
        { range: '0-5 days', count: 685, percentage: 13.7 },
        { range: '5-10 days', count: 1580, percentage: 31.6 },
        { range: '10-15 days', count: 1325, percentage: 26.5 },
        { range: '15-20 days', count: 790, percentage: 15.8 },
        { range: '20-30 days', count: 430, percentage: 8.6 },
        { range: '30+ days', count: 190, percentage: 3.8 }
      ]
    },
    {
      category: 'Lead Time by Region',
      distribution: [
        { range: 'Europe', count: 2320, percentage: 46.4 },
        { range: 'Asia-Pacific', count: 1705, percentage: 34.1 },
        { range: 'Americas', count: 975, percentage: 19.5 }
      ]
    }
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading data...</div>
        </div>
      ) : (
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
      )}
    </DashboardLayout>
  );
}
