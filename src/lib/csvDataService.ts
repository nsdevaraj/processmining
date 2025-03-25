// Using Papa from global CDN instead of import
declare const Papa: any;

export interface EventLogEntry {
  case_id: string;
  activity: string;
  timestamp: string;
  company: string;
  region: string;
  material_group: string;
  payment_term: string;
  variant: string;
}

export interface CaseAttribute {
  case_id: string;
  company: string;
  region: string;
  material_group: string;
  payment_term: string;
  variant: string;
  start_time: string;
  end_time: string;
  case_duration: number;
  on_time_delivery: boolean;
}

class CSVDataService {
  private eventLogData: EventLogEntry[] = [];
  private caseAttributesData: CaseAttribute[] = [];
  private dataLoaded = false;

  async loadData(): Promise<void> {
    if (this.dataLoaded) {
      return;
    }

    try {
      // Load event log data
      const eventLogResponse = await fetch('/data/event_log.csv');
      const eventLogText = await eventLogResponse.text();
      
      const eventLogResult = Papa.parse<EventLogEntry>(eventLogText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      
      this.eventLogData = eventLogResult.data;
      
      // Load case attributes data
      const caseAttributesResponse = await fetch('/data/case_attributes.csv');
      const caseAttributesText = await caseAttributesResponse.text();
      
      const caseAttributesResult = Papa.parse<CaseAttribute>(caseAttributesText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      
      this.caseAttributesData = caseAttributesResult.data.map(item => ({
        ...item,
        on_time_delivery: item.on_time_delivery === 'True' || item.on_time_delivery === true
      }));
      
      this.dataLoaded = true;
      console.log('CSV data loaded successfully');
    } catch (error) {
      console.error('Error loading CSV data:', error);
      throw error;
    }
  }

  async getEventLog(): Promise<EventLogEntry[]> {
    await this.loadData();
    return this.eventLogData;
  }

  async getCaseAttributes(): Promise<CaseAttribute[]> {
    await this.loadData();
    return this.caseAttributesData;
  }

  async getFilteredEventLog(filters: Record<string, any>): Promise<EventLogEntry[]> {
    await this.loadData();
    
    return this.eventLogData.filter(entry => {
      for (const [key, value] of Object.entries(filters)) {
        if (value && entry[key as keyof EventLogEntry] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async getFilteredCaseAttributes(filters: Record<string, any>): Promise<CaseAttribute[]> {
    await this.loadData();
    
    return this.caseAttributesData.filter(entry => {
      for (const [key, value] of Object.entries(filters)) {
        if (value && entry[key as keyof CaseAttribute] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async getUniqueValues(field: keyof EventLogEntry | keyof CaseAttribute): Promise<string[]> {
    await this.loadData();
    
    const values = new Set<string>();
    
    // Check if field exists in event log
    if (field in (this.eventLogData[0] || {})) {
      this.eventLogData.forEach(entry => {
        const value = entry[field as keyof EventLogEntry];
        if (value) values.add(String(value));
      });
    }
    
    // Check if field exists in case attributes
    if (field in (this.caseAttributesData[0] || {})) {
      this.caseAttributesData.forEach(entry => {
        const value = entry[field as keyof CaseAttribute];
        if (value) values.add(String(value));
      });
    }
    
    return Array.from(values).sort();
  }

  async getVariants(): Promise<string[]> {
    return this.getUniqueValues('variant');
  }

  async getCompanies(): Promise<string[]> {
    return this.getUniqueValues('company');
  }

  async getRegions(): Promise<string[]> {
    return this.getUniqueValues('region');
  }

  async getMaterialGroups(): Promise<string[]> {
    return this.getUniqueValues('material_group');
  }

  async getActivities(): Promise<string[]> {
    await this.loadData();
    const activities = new Set<string>();
    
    this.eventLogData.forEach(entry => {
      if (entry.activity) activities.add(entry.activity);
    });
    
    return Array.from(activities).sort();
  }

  async getProcessFlowData(): Promise<{
    nodes: { id: string; label: string; count: number; type?: string }[];
    edges: { source: string; target: string; count: number }[];
  }> {
    await this.loadData();
    
    const activities = await this.getActivities();
    const activityCounts = new Map<string, number>();
    const edgeCounts = new Map<string, number>();
    
    // Count activities
    this.eventLogData.forEach(entry => {
      const activity = entry.activity;
      activityCounts.set(activity, (activityCounts.get(activity) || 0) + 1);
    });
    
    // Count transitions between activities
    const caseActivities = new Map<string, string[]>();
    
    this.eventLogData.forEach(entry => {
      if (!caseActivities.has(entry.case_id)) {
        caseActivities.set(entry.case_id, []);
      }
      caseActivities.get(entry.case_id)?.push(entry.activity);
    });
    
    caseActivities.forEach(activities => {
      for (let i = 0; i < activities.length - 1; i++) {
        const source = activities[i];
        const target = activities[i + 1];
        const edge = `${source}|${target}`;
        edgeCounts.set(edge, (edgeCounts.get(edge) || 0) + 1);
      }
    });
    
    // Create nodes
    const nodes = Array.from(activityCounts.entries()).map(([activity, count]) => {
      let type = 'activity';
      
      if (activity === 'Receive Purchase Order') {
        type = 'start';
      } else if (activity === 'Clear Invoice') {
        type = 'end';
      } else if (activity.includes('Change')) {
        type = 'gateway';
      }
      
      return {
        id: activity,
        label: activity,
        count,
        type
      };
    });
    
    // Create edges
    const edges = Array.from(edgeCounts.entries()).map(([edge, count]) => {
      const [source, target] = edge.split('|');
      return {
        source,
        target,
        count
      };
    });
    
    return { nodes, edges };
  }

  async getConformanceData(): Promise<{
    totalCases: number;
    conformantCases: number;
    nonConformantCases: number;
    conformanceRate: number;
    deviations: {
      type: string;
      count: number;
      percentage: number;
      impact: string;
    }[];
  }> {
    await this.loadData();
    
    const totalCases = this.caseAttributesData.length;
    const standardPathCases = this.caseAttributesData.filter(
      entry => entry.variant === 'standard_path'
    ).length;
    
    const nonConformantCases = totalCases - standardPathCases;
    const conformanceRate = Math.round((standardPathCases / totalCases) * 100);
    
    // Get variant counts
    const variantCounts = new Map<string, number>();
    this.caseAttributesData.forEach(entry => {
      if (entry.variant !== 'standard_path') {
        variantCounts.set(entry.variant, (variantCounts.get(entry.variant) || 0) + 1);
      }
    });
    
    // Create deviations list
    const deviations = Array.from(variantCounts.entries())
      .map(([variant, count]) => {
        const percentage = Math.round((count / totalCases) * 100 * 10) / 10;
        
        // Generate impact text based on variant
        let impact = '';
        if (variant === 'price_change_path') {
          impact = 'Medium impact on process cost (+$45 per case)';
        } else if (variant === 'material_change_path') {
          impact = 'Medium impact on process duration (+2.3 days)';
        } else if (variant === 'invoice_after_invoice') {
          impact = 'High impact on process quality (23% higher rejection rate)';
        } else {
          impact = 'Low impact on process outcome';
        }
        
        return {
          type: variant.replace('_path', '').replace('_', ' '),
          count,
          percentage,
          impact
        };
      })
      .sort((a, b) => b.count - a.count);
    
    return {
      totalCases,
      conformantCases: standardPathCases,
      nonConformantCases,
      conformanceRate,
      deviations
    };
  }

  async getPerformanceMetrics(): Promise<{
    avgLeadTime: number;
    medianLeadTime: number;
    onTimeDeliveryRate: number;
    caseCount: number;
    completedCases: number;
    activeCases: number;
  }> {
    await this.loadData();
    
    const durations = this.caseAttributesData.map(entry => entry.case_duration).sort((a, b) => a - b);
    const onTimeDeliveries = this.caseAttributesData.filter(entry => entry.on_time_delivery).length;
    
    // Calculate median
    const mid = Math.floor(durations.length / 2);
    const medianLeadTime = durations.length % 2 === 0
      ? (durations[mid - 1] + durations[mid]) / 2
      : durations[mid];
    
    // Calculate average
    const avgLeadTime = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
    
    // Calculate on-time delivery rate
    const onTimeDeliveryRate = Math.round((onTimeDeliveries / this.caseAttributesData.length) * 100);
    
    // Count completed vs active cases (assuming cases without end_time are active)
    const completedCases = this.caseAttributesData.filter(entry => entry.end_time).length;
    const activeCases = this.caseAttributesData.length - completedCases;
    
    return {
      avgLeadTime: Math.round(avgLeadTime * 10) / 10,
      medianLeadTime: Math.round(medianLeadTime * 10) / 10,
      onTimeDeliveryRate,
      caseCount: this.caseAttributesData.length,
      completedCases,
      activeCases
    };
  }

  async getLeadTimeByCompany(): Promise<{
    label: string;
    value: number;
    color: string;
  }[]> {
    await this.loadData();
    
    const companies = await this.getCompanies();
    const leadTimeByCompany = new Map<string, number[]>();
    
    // Group durations by company
    this.caseAttributesData.forEach(entry => {
      if (!leadTimeByCompany.has(entry.company)) {
        leadTimeByCompany.set(entry.company, []);
      }
      leadTimeByCompany.get(entry.company)?.push(entry.case_duration);
    });
    
    // Calculate average lead time for each company
    const result = Array.from(leadTimeByCompany.entries())
      .map(([company, durations]) => {
        const avgDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
        return {
          label: company,
          value: Math.round(avgDuration * 10) / 10,
          color: 'bg-blue-500'
        };
      })
      .sort((a, b) => b.value - a.value);
    
    // Assign colors based on performance (top 50% green, bottom 50% red)
    const midpoint = Math.floor(result.length / 2);
    for (let i = 0; i < result.length; i++) {
      result[i].color = i >= midpoint ? 'bg-green-500' : 'bg-red-500';
    }
    
    return result;
  }

  async getBottlenecks(): Promise<{
    activity: string;
    avgDuration: string;
    caseCount: number;
    impactScore: number;
    waitTime: string;
    processingTime: string;
  }[]> {
    await this.loadData();
    
    // Group events by case and calculate activity durations
    const caseEvents = new Map<string, EventLogEntry[]>();
    
    this.eventLogData.forEach(entry => {
      if (!caseEvents.has(entry.case_id)) {
        caseEvents.set(entry.case_id, []);
      }
      caseEvents.get(entry.case_id)?.push(entry);
    });
    
    const activityDurations = new Map<string, number[]>();
    const activityCounts = new Map<string, number>();
    
    caseEvents.forEach(events => {
      // Sort events by timestamp
      events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Calculate duration between consecutive activities
      for (let i = 0; i < events.length - 1; i++) {
        const activity = events[i].activity;
        const startTime = new Date(events[i].timestamp).getTime();
        const endTime = new Date(events[i + 1].timestamp).getTime();
        const duration = (endTime - startTime) / (1000 * 60 * 60 * 24); // Convert to days
        
        if (!activityDurations.has(activity)) {
          activityDurations.set(activity, []);
        }
        activityDurations.get(activity)?.push(duration);
        activityCounts.set(activity, (activityCounts.get(activity) || 0) + 1);
      }
    });
    
    // Calculate average durations and impact scores
    const bottlenecks = Array.from(activityDurations.entries())
      .map(([activity, durations]) => {
        const avgDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
        const caseCount = activityCounts.get(activity) || 0;
        
        // Calculate impact score based on duration and frequency
        const durationFactor = Math.min(avgDuration * 10, 100);
        const frequencyFactor = Math.min(caseCount / 1000, 1) * 100;
        const impactScore = Math.round((durationFactor * 0.7 + frequencyFactor * 0.3));
        
        // Estimate wait time and processing time (70% wait, 30% processing as a simplification)
        const waitTime = avgDuration * 0.7;
        const processingTime = avgDuration * 0.3;
        
        return {
          activity,
          avgDuration: `${avgDuration.toFixed(1)} days`,
          caseCount,
          impactScore,
          waitTime: `${waitTime.toFixed(1)} days`,
          processingTime: `${processingTime.toFixed(1)} days`
        };
      })
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 5); // Top 5 bottlenecks
    
    return bottlenecks;
  }
}

// Create singleton instance
const csvDataService = new CSVDataService();
export default csvDataService;
