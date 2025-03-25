'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import ConformanceChecking from '../../components/ConformanceChecking';
import DeviatingFlows from '../../components/DeviatingFlows';
import ConformanceByGroup from '../../components/ConformanceByGroup';
import csvDataService from '../../lib/csvDataService';

export default function ConformanceCheckingPage() {
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
  const [conformanceByGroup, setConformanceByGroup] = useState([]);
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
        
        // Generate conformance by group data
        const caseAttributes = await csvDataService.getCaseAttributes();
        
        // Group by material group
        const materialGroupMap = new Map();
        materialGroupsData.forEach(group => {
          materialGroupMap.set(group, {
            total: 0,
            conformant: 0,
            rate: 0
          });
        });
        
        // Group by company
        const companyMap = new Map();
        companiesData.forEach(company => {
          companyMap.set(company, {
            total: 0,
            conformant: 0,
            rate: 0
          });
        });
        
        // Calculate conformance by group
        caseAttributes.forEach(caseAttr => {
          // Update material group stats
          if (materialGroupMap.has(caseAttr.material_group)) {
            const stats = materialGroupMap.get(caseAttr.material_group);
            stats.total += 1;
            if (caseAttr.variant === 'standard_path') {
              stats.conformant += 1;
            }
          }
          
          // Update company stats
          if (companyMap.has(caseAttr.company)) {
            const stats = companyMap.get(caseAttr.company);
            stats.total += 1;
            if (caseAttr.variant === 'standard_path') {
              stats.conformant += 1;
            }
          }
        });
        
        // Calculate rates and format data
        const materialGroupConformance = Array.from(materialGroupMap.entries())
          .map(([group, stats]) => {
            const rate = stats.total > 0 ? Math.round((stats.conformant / stats.total) * 100) : 0;
            return {
              group,
              total: stats.total,
              conformant: stats.conformant,
              rate,
              impact: rate >= 70 ? 'positive' : rate >= 50 ? 'neutral' : 'negative'
            };
          })
          .filter(item => item.total > 0)
          .sort((a, b) => b.rate - a.rate);
        
        const companyConformance = Array.from(companyMap.entries())
          .map(([company, stats]) => {
            const rate = stats.total > 0 ? Math.round((stats.conformant / stats.total) * 100) : 0;
            return {
              group: company,
              total: stats.total,
              conformant: stats.conformant,
              rate,
              impact: rate >= 70 ? 'positive' : rate >= 50 ? 'neutral' : 'negative'
            };
          })
          .filter(item => item.total > 0)
          .sort((a, b) => b.rate - a.rate);
        
        setConformanceByGroup([
          {
            title: 'Conformance by Material Group',
            data: materialGroupConformance
          },
          {
            title: 'Conformance by Company',
            data: companyConformance
          }
        ]);
        
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
        <h1 className="text-2xl font-bold mb-2">Conformance Checking</h1>
        <p className="text-gray-600">
          Analysis of process conformance, deviations, and conformance by different dimensions using real CSV data
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
          
          {conformanceByGroup.map((group, index) => (
            <ConformanceByGroup 
              key={index}
              title={group.title}
              data={group.data}
            />
          ))}
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Conformance Insights</h2>
            
            <div className="prose max-w-none">
              <p>
                Analysis of the process conformance reveals several key insights:
              </p>
              
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">Overall Conformance:</span> {conformanceData.conformanceRate}% of cases follow the standard process path, indicating good overall process discipline.
                </li>
                <li>
                  <span className="font-medium">Material Group Impact:</span> Power Tools have the highest conformance rate at {conformanceByGroup[0]?.data[0]?.rate || 0}%, while Fertilizers have the lowest at {conformanceByGroup[0]?.data[conformanceByGroup[0]?.data.length - 1]?.rate || 0}%.
                </li>
                <li>
                  <span className="font-medium">Company Variations:</span> {conformanceByGroup[1]?.data[0]?.group || 'Top companies'} shows the best conformance at {conformanceByGroup[1]?.data[0]?.rate || 0}%, while {conformanceByGroup[1]?.data[conformanceByGroup[1]?.data.length - 1]?.group || 'bottom companies'} has the lowest at {conformanceByGroup[1]?.data[conformanceByGroup[1]?.data.length - 1]?.rate || 0}%.
                </li>
                <li>
                  <span className="font-medium">Common Deviations:</span> Price changes and material changes are the most common deviations, accounting for {conformanceData.deviations[0]?.percentage || 0}% and {conformanceData.deviations[1]?.percentage || 0}% of cases respectively.
                </li>
              </ul>
              
              <p className="mt-4">
                <strong>Recommendations:</strong>
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>Standardize pricing processes to reduce the need for price changes after sales order creation.</li>
                <li>Improve material selection accuracy during initial order entry to reduce material changes.</li>
                <li>Share best practices from high-conformance companies with lower-performing entities.</li>
                <li>Implement automated validation checks to prevent common deviations.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
