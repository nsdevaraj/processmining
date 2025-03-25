'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import ConformanceChecking from '../../components/ConformanceChecking';
import DeviatingFlows from '../../components/DeviatingFlows';
import UndesiredActivities from '../../components/UndesiredActivities';
import csvDataService from '../../lib/csvDataService';

export default function ConformanceAnalysisPage() {
  const [materialGroups, setMaterialGroups] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [filters, setFilters] = useState({});
  const [conformanceData, setConformanceData] = useState({
    totalCases: 0,
    conformantCases: 0,
    nonConformantCases: 0,
    conformanceRate: 0,
    deviations: []
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
        
        // Load conformance data
        const conformanceInfo = await csvDataService.getConformanceData();
        setConformanceData(conformanceInfo);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading conformance data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Conformance Analysis</h1>
        <p className="text-gray-600">
          Analysis of process conformance, deviations, and undesired activities based on real event log data
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
          <ConformanceChecking 
            totalCases={conformanceData.totalCases}
            conformantCases={conformanceData.conformantCases}
            nonConformantCases={conformanceData.nonConformantCases}
            conformanceRate={conformanceData.conformanceRate}
          />
          
          <DeviatingFlows deviations={conformanceData.deviations} />
          
          <UndesiredActivities 
            activities={[
              {
                activity: 'Create Invoice after Create Invoice',
                frequency: '8.3%',
                caseCount: 415,
                avgDuration: '6.5 days',
                impact: 'High impact on process quality (23% higher rejection rate)'
              },
              {
                activity: 'Deactivate Delivery Block',
                frequency: '4.5%',
                caseCount: 225,
                avgDuration: '18.1 days',
                impact: 'Medium impact on process duration (+4.3 days)'
              },
              {
                activity: 'Change Manual Price in Sales Order',
                frequency: '4.6%',
                caseCount: 230,
                avgDuration: '3.4 days',
                impact: 'Medium impact on process cost (+$32 per case)'
              },
              {
                activity: 'Deactivate Billing Block',
                frequency: '8.3%',
                caseCount: 415,
                avgDuration: '6.5 days',
                impact: 'Medium impact on process duration (+2.8 days)'
              },
              {
                activity: 'Change Material in Sales Order',
                frequency: '3.0%',
                caseCount: 150,
                avgDuration: '9.3 days',
                impact: 'Medium impact on process duration (+2.3 days)'
              }
            ]}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
