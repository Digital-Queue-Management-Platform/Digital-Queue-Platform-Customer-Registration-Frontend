import React, { useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
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
    loadDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
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

  const loadWaitTimeData = async () => {
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
  };

  const loadOfficerData = async () => {
    try {
      const response = await analyticsAPI.getOfficerPerformance();
      if (response.success && response.data) {
        setOfficerData(response.data);
      }
    } catch (error) {
      // Fallback data for demonstration
      setOfficerData([
        { officerId: '1', name: 'Sarah M.', customersServed: 24, averageServiceTime: 8.5, efficiency: 95 },
        { officerId: '2', name: 'John D.', customersServed: 21, averageServiceTime: 9.2, efficiency: 88 },
        { officerId: '3', name: 'Lisa K.', customersServed: 18, averageServiceTime: 10.1, efficiency: 82 },
        { officerId: '4', name: 'Mike R.', customersServed: 26, averageServiceTime: 7.8, efficiency: 98 },
      ]);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

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
    <div className="min-h-screen bg-gray-50">
      <Header title="Analytics Dashboard" subtitle="Real-time queue insights and performance metrics" />
      
      <main className="py-8 px-4 max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            isLoading={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WaitTimeChart data={waitTimeData} />
          <OfficerPerformanceChart data={officerData} />
        </div>

        {/* Service Type Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceTypeBreakdown data={dashboardData.serviceTypeBreakdown} />
          
          {/* Additional Metrics Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Highlights</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Peak Hour</span>
                  <span className="font-semibold text-gray-900">2:00 PM - 3:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Busiest Service</span>
                  <span className="font-semibold text-gray-900">New Connection</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Top Performer</span>
                  <span className="font-semibold text-gray-900">Mike R. (26 customers)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Efficiency Rate</span>
                  <span className="font-semibold text-green-600">91%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}