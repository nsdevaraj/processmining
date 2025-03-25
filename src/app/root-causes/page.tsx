'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import FilterBar from '../../components/FilterBar';
import RootCauseAnalysis from '../../components/RootCauseAnalysis';
import csvDataService from '../../lib/csvDataService';

export default function RootCausesPage() {
  const [materialGroups, setMaterialGroups] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [filters, setFilters] = useState({});
  const [rootCauseData, setRootCauseData] = useState([]);
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
        
        // Generate root cause analysis data from case attributes
        const caseAttributes = await csvDataService.getCaseAttributes();
        
        // Analyze on-time delivery KPI
        const onTimeDeliveryAnalysis = analyzeRootCauses(
          caseAttributes, 
          'on_time_delivery', 
          true, 
          ['company', 'region', 'material_group', 'payment_term']
        );
        
        // Analyze price change cases
        const priceChangeCases = caseAttributes.filter(c => c.variant === 'price_change_path');
        const priceChangeAnalysis = analyzeRootCauses(
          priceChangeCases,
          'variant',
          'price_change_path',
          ['company', 'region', 'material_group', 'payment_term']
        );
        
        setRootCauseData([
          {
            title: 'Root Causes for Late Delivery',
            feature: 'On-Time Delivery = False',
            data: onTimeDeliveryAnalysis
          },
          {
            title: 'Root Causes for Price Changes',
            feature: 'Variant = price_change_path',
            data: priceChangeAnalysis
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading root cause data:', error);
        setIsLoading(false);
      }
    };
    
    // Helper function to analyze root causes
    const analyzeRootCauses = (data, targetField, targetValue, dimensions) => {
      const results = [];
      
      // Filter cases with the target feature
      const targetCases = data.filter(c => c[targetField] === targetValue);
      const targetCount = targetCases.length;
      const totalCount = data.length;
      const baseRate = totalCount > 0 ? (targetCount / totalCount) * 100 : 0;
      
      // Analyze each dimension
      dimensions.forEach(dimension => {
        // Get unique values for this dimension
        const uniqueValues = [...new Set(data.map(c => c[dimension]))];
        
        // Calculate impact for each value
        const dimensionResults = uniqueValues.map(value => {
          // Cases with this dimension value
          const casesWithValue = data.filter(c => c[dimension] === value);
          const countWithValue = casesWithValue.length;
          
          // Target cases with this dimension value
          const targetWithValue = casesWithValue.filter(c => c[targetField] === targetValue);
          const targetCountWithValue = targetWithValue.length;
          
          // Calculate rate and impact
          const rate = countWithValue > 0 ? (targetCountWithValue / countWithValue) * 100 : 0;
          const impact = rate - baseRate;
          
          return {
            dimension,
            value,
            totalCases: countWithValue,
            targetCases: targetCountWithValue,
            rate: Math.round(rate * 10) / 10,
            impact: Math.round(impact * 10) / 10,
            contribution: countWithValue > 0 ? (countWithValue / totalCount) * 100 : 0
          };
        });
        
        // Sort by absolute impact and filter out low-contribution items
        const significantResults = dimensionResults
          .filter(r => r.totalCases > 5) // Minimum case threshold
          .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
          .slice(0, 5); // Top 5 per dimension
        
        results.push(...significantResults);
      });
      
      // Sort by absolute impact
      return results.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    };
    
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Root Cause Analysis</h1>
        <p className="text-gray-600">
          Identification of root causes for process deviations and performance issues using real CSV data
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
          {rootCauseData.map((analysis, index) => (
            <RootCauseAnalysis 
              key={index}
              title={analysis.title}
              feature={analysis.feature}
              data={analysis.data}
            />
          ))}
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Root Cause Insights</h2>
            
            <div className="prose max-w-none">
              <p>
                Root cause analysis of process issues reveals several key insights:
              </p>
              
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <span className="font-medium">Late Delivery Factors:</span> The strongest predictors of late delivery are payment terms (60+ days), certain material groups (Fertilizers), and specific companies (Drystone India).
                </li>
                <li>
                  <span className="font-medium">Price Change Drivers:</span> Price changes occur most frequently with Building Materials and Safety Equipment, suggesting pricing volatility in these categories.
                </li>
                <li>
                  <span className="font-medium">Regional Variations:</span> The Asia-Pacific region shows significantly higher rates of process deviations compared to Europe, indicating potential process standardization issues.
                </li>
                <li>
                  <span className="font-medium">Company Practices:</span> Companies with higher conformance rates also show better on-time delivery performance, confirming the link between process discipline and outcomes.
                </li>
              </ul>
              
              <p className="mt-4">
                <strong>Recommendations:</strong>
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>Implement special monitoring for orders with identified risk factors for late delivery.</li>
                <li>Review pricing strategies for Building Materials and Safety Equipment to reduce the need for price changes.</li>
                <li>Standardize processes across regions, with particular focus on Asia-Pacific operations.</li>
                <li>Share best practices from high-performing companies with the rest of the organization.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
