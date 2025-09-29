import { useEffect, useState, useCallback } from 'react';
import { StatCard } from '../components/analytics/StatCard';
import { WaitTimeChart } from '../components/analytics/WaitTimeChart';
import { OfficerPerformanceChart } from '../components/analytics/OfficerPerformanceChart';
import { ServiceTypeBreakdown } from '../components/analytics/ServiceTypeBreakdown';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useQueue } from '../context/QueueContext';
import { analyticsAPI } from '../utils/api';
import type { WaitTimeData, OfficerPerformance } from '../types';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  TrendingUp,
  RefreshCw 
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export function AnalyticsDashboard() {
  const { analytics, fetchAnalytics, isLoading } = useQueue();
  const [waitTimeData, setWaitTimeData] = useState<WaitTimeData[]>([]);
  const [officerData, setOfficerData] = useState<OfficerPerformance[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await Promise.all([
          fetchAnalytics(),
          loadWaitTimeData(),
          loadOfficerData(),
        ]);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    initializeDashboard();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(initializeDashboard, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent infinite loops

  const loadWaitTimeData = useCallback(async () => {
    try {
      const response = await analyticsAPI.getWaitTimes('24h');
      if (response.success && response.data) {
        setWaitTimeData(response.data);
      }
    } catch (error) {
      // Fallback data for demonstration
      setWaitTimeData([
        { time: '09:00', waitTime: 8, queueLength: 5 },
        { time: '10:00', waitTime: 12, queueLength: 8 },
        { time: '11:00', waitTime: 15, queueLength: 12 },
        { time: '12:00', waitTime: 18, queueLength: 15 },
        { time: '13:00', waitTime: 14, queueLength: 10 },
        { time: '14:00', waitTime: 10, queueLength: 7 },
        { time: '15:00', waitTime: 16, queueLength: 13 },
        { time: '16:00', waitTime: 20, queueLength: 16 },
      ]);
    }
  }, []);

  const loadOfficerData = useCallback(async () => {
    try {
      const response = await analyticsAPI.getOfficerPerformance();
      if (response.success && response.data) {
        setOfficerData(response.data);
      } else {
        // Set empty array if no data
        setOfficerData([]);
      }
    } catch (error) {
      console.error('Failed to load officer data:', error);
      // Set empty array on error instead of fallback data
      setOfficerData([]);
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      await Promise.all([
        fetchAnalytics(),
        loadWaitTimeData(),
        loadOfficerData(),
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }, [fetchAnalytics, loadWaitTimeData, loadOfficerData]);

  const handleRefresh = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Fallback data for demonstration
  const dashboardData = analytics || {
    averageWaitTime: 12,
    totalCustomersToday: 156,
    completedServices: 142,
    peakHours: [],
    serviceTypeBreakdown: [
      { type: 'New Connection', count: 45 },
      { type: 'Bill Payment', count: 38 },
      { type: 'Technical Support', count: 32 },
      { type: 'Account Update', count: 25 },
      { type: 'Package Change', count: 16 },
    ],
  };

  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Dashboard Overview</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          isLoading={isLoading}
          className="flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </Button>
      </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Average Wait Time"
            value={`${dashboardData.averageWaitTime} min`}
            change={{ value: 8, type: 'decrease' }}
            icon={Clock}
            color="blue"
          />
          <StatCard
            title="Total Customers"
            value={dashboardData.totalCustomersToday}
            change={{ value: 12, type: 'increase' }}
            icon={Users}
            color="green"
          />
          <StatCard
            title="Completed Services"
            value={dashboardData.completedServices}
            change={{ value: 5, type: 'increase' }}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Service Rate"
            value={`${Math.round((dashboardData.completedServices / dashboardData.totalCustomersToday) * 100)}%`}
            change={{ value: 3, type: 'increase' }}
            icon={TrendingUp}
            color="blue"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <WaitTimeChart data={waitTimeData} />
          <OfficerPerformanceChart data={officerData} />
        </div>

        {/* Service Type Breakdown */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <ServiceTypeBreakdown data={dashboardData.serviceTypeBreakdown} />
          
          {/* Additional Metrics Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Highlights</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Peak Hour</span>
                  <span className="font-semibold text-gray-900">
                    {dashboardData.peakHours && dashboardData.peakHours.length > 0 
                      ? `${dashboardData.peakHours[0].hour}:00 - ${dashboardData.peakHours[0].hour + 1}:00` 
                      : 'No data yet'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Busiest Service</span>
                  <span className="font-semibold text-gray-900">
                    {dashboardData.serviceTypeBreakdown && dashboardData.serviceTypeBreakdown.length > 0
                      ? dashboardData.serviceTypeBreakdown[0].type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      : 'No services yet'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Top Performer</span>
                  <span className="font-semibold text-gray-900">
                    {officerData && officerData.length > 0 
                      ? `${officerData[0].name} (${officerData[0].customersServed} customers)`
                      : 'No officers available'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Customers</span>
                  <span className="font-semibold text-green-600">{dashboardData.totalCustomersToday || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}