import { useState, useEffect } from 'react';
import { OfficerLayout } from '../../components/officer/OfficerLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { analyticsAPI } from '../../utils/api';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  BarChart3,
  Download,
  Mail,
  Printer
} from 'lucide-react';

// Normalize service types to prevent backend inconsistencies
const normalizeServiceType = (serviceType: string): string => {
  if (!serviceType) return 'Technical Support';
  
  const normalized = serviceType.toLowerCase().trim();
  
  // Map backend service types to frontend service types
  const serviceTypeMapping: { [key: string]: string } = {
    'new_connections': 'New Connections',
    'new connections': 'New Connections',
    'bill_payments': 'Bill Payments',
    'bill payments': 'Bill Payments',
    'technical_support': 'Technical Support',
    'technical support': 'Technical Support',
    'account_services': 'Account Services',
    'account services': 'Account Services',
    'device_sim_issues': 'Device/SIM Issues',
    'device sim issues': 'Device/SIM Issues',
    'device/sim issues': 'Device/SIM Issues'
  };
  
  if (serviceTypeMapping[normalized]) {
    return serviceTypeMapping[normalized];
  }
  
  // Fallback to partial matching
  if (normalized.includes('connection') || normalized.includes('new')) {
    return 'New Connections';
  } else if (normalized.includes('bill') || normalized.includes('payment')) {
    return 'Bill Payments';
  } else if (normalized.includes('technical') || normalized.includes('support') || normalized.includes('tech')) {
    return 'Technical Support';
  } else if (normalized.includes('account') || normalized.includes('service')) {
    return 'Account Services';
  } else if (normalized.includes('device') || normalized.includes('sim') || normalized.includes('mobile')) {
    return 'Device/SIM Issues';
  }
  
  return 'Technical Support';
};

// Types for backend integration
interface DailySummaryMetrics {
  customersServed: number;
  averageServiceTime: string; // e.g., "8m 24s"
  queueEfficiency: number; // percentage 0-100
  customerSatisfaction: number; // rating out of 5
}

interface ServiceBreakdown {
  serviceType: string;
  count: number;
  percentage: number;
}

interface TimeAnalysis {
  peakHour: string; // e.g., "10:00 - 11:00"
  activeTime: string; // e.g., "6h 12m"
  breakTime: string; // e.g., "45m"
}

interface CustomerServiceDetail {
  time: string;
  token: string;
  customer: string;
  serviceType: string;
  duration: string; // e.g., "18m"
  status: 'completed' | 'transferred' | 'cancelled';
}

interface DailySummaryData {
  date: string;
  metrics: DailySummaryMetrics;
  serviceBreakdown: ServiceBreakdown[];
  timeAnalysis: TimeAnalysis;
  customerServiceDetails: CustomerServiceDetail[];
  totalCustomers: number;
  currentPage: number;
  totalPages: number;
}

// API functions that backend developers can implement
const dailySummaryAPI = {
  // GET /api/officer/daily-summary?date=2025-09-30&officer_id=officer1
  getDailySummary: async (date: string, officerId: string): Promise<DailySummaryData> => {
    try {
      // TODO: Backend developers implement this endpoint
      console.log('🔄 API Call: getDailySummary', { date, officerId });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, return mock data (Backend developers: replace this with actual API call)
      console.log('✅ Using mock data - Backend developers should implement real endpoint');
      return mockDailySummaryData;
      
      // When backend is ready, replace above with:
      // const response = await fetch(`/api/officer/daily-summary?date=${date}&officer_id=${officerId}`);
      // return await response.json();
    } catch (error) {
      console.log('⚠️ Backend not available, using mock data for development');
      return mockDailySummaryData;
    }
  },

  // POST /api/officer/daily-summary/export
  exportSummary: async (date: string, officerId: string, format: 'pdf' | 'csv' | 'excel'): Promise<Blob> => {
    try {
      // TODO: Backend developers implement this endpoint
      console.log('🔄 API Call: exportSummary', { date, officerId, format });
      
      // Mock implementation - Backend developers: replace with real export logic
      await new Promise(resolve => setTimeout(resolve, 500));
      return new Blob([`Mock ${format.toUpperCase()} export data for ${date}`], { 
        type: format === 'pdf' ? 'application/pdf' : 'text/csv' 
      });
    } catch (error) {
      console.log('⚠️ Export API not available, using mock data');
      return new Blob(['Mock export data'], { type: 'application/pdf' });
    }
  },

  // POST /api/officer/daily-summary/email
  emailSummary: async (date: string, officerId: string, email: string): Promise<void> => {
    try {
      // TODO: Backend developers implement this endpoint
      console.log('🔄 API Call: emailSummary', { date, officerId, email });
      
      // Mock implementation - Backend developers: integrate with SMTP service
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Mock email sent successfully');
    } catch (error) {
      console.log('⚠️ Email API not available - Backend developers need to implement SMTP integration');
    }
  }
};

// Mock data for development (Backend developers can use this as reference)
const mockDailySummaryData: DailySummaryData = {
  date: '2025-09-30',
  metrics: {
    customersServed: 27,
    averageServiceTime: '8m 24s',
    queueEfficiency: 94,
    customerSatisfaction: 4.2
  },
  serviceBreakdown: [
    { serviceType: normalizeServiceType('New Connections'), count: 5, percentage: 18.5 },
    { serviceType: normalizeServiceType('Bill Payments'), count: 9, percentage: 33.3 },
    { serviceType: normalizeServiceType('Technical Support'), count: 8, percentage: 29.6 },
    { serviceType: normalizeServiceType('Account Services'), count: 3, percentage: 11.1 },
    { serviceType: normalizeServiceType('Device/SIM Issues'), count: 2, percentage: 7.4 }
  ],
  timeAnalysis: {
    peakHour: '10:00 - 11:00',
    activeTime: '6h 12m',
    breakTime: '45m'
  },
  customerServiceDetails: [
    { time: '09:00', token: 'A040', customer: 'Customer 1', serviceType: normalizeServiceType('New Connections'), duration: '18m', status: 'transferred' },
    { time: '09:30', token: 'A041', customer: 'Customer 2', serviceType: normalizeServiceType('Bill Payments'), duration: '18m', status: 'completed' },
    { time: '10:00', token: 'A042', customer: 'Customer 3', serviceType: normalizeServiceType('Technical Support'), duration: '9m', status: 'completed' },
    { time: '10:30', token: 'A043', customer: 'Customer 4', serviceType: normalizeServiceType('Account Services'), duration: '9m', status: 'completed' },
    { time: '11:00', token: 'A044', customer: 'Customer 5', serviceType: normalizeServiceType('Device/SIM Issues'), duration: '9m', status: 'completed' }
  ],
  totalCustomers: 27,
  currentPage: 1,
  totalPages: 3
};

export function OfficerDailySummary() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [summaryData, setSummaryData] = useState<DailySummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Get officer data from localStorage (set during login)
  const officerData = JSON.parse(localStorage.getItem('officer_data') || '{}');
  const officerId = officerData.id || 'officer1';

  useEffect(() => {
    loadDailySummary();
  }, [selectedDate, currentPage]);

  const loadDailySummary = async () => {
    setIsLoading(true);
    try {
      // Try to get data from real analytics API
      const analyticsResponse = await analyticsAPI.getDashboard();
      const officerResponse = await analyticsAPI.getOfficerPerformance();
      
      if (analyticsResponse.success && analyticsResponse.data) {
        // Transform backend analytics data to match UI format
        const transformedData: DailySummaryData = {
          date: selectedDate === 'today' ? new Date().toISOString().split('T')[0] : selectedDate,
          metrics: {
            customersServed: analyticsResponse.data.completedServices || 23,
            averageServiceTime: "8m 24s", // TODO: Backend should provide this format
            queueEfficiency: 94, // TODO: Backend should calculate this
            customerSatisfaction: 4.2 // TODO: Backend should provide this
          },
          serviceBreakdown: analyticsResponse.data.serviceTypeBreakdown?.map((item: any) => ({
            serviceType: normalizeServiceType(item.type || item.name),
            count: item.count,
            percentage: Math.round((item.count / (analyticsResponse.data?.completedServices || 1)) * 100)
          })) || [],
          timeAnalysis: {
            peakHour: "10:00 - 11:00", // TODO: Backend should calculate peak hours
            activeTime: "6h 12m", // TODO: Backend should track active time
            breakTime: "45m" // TODO: Backend should track break time
          },
          customerServiceDetails: [], // TODO: Backend should provide detailed service log
          totalCustomers: analyticsResponse.data.totalCustomersToday || 0,
          currentPage: currentPage,
          totalPages: Math.ceil((analyticsResponse.data.totalCustomersToday || 0) / 10)
        };

        // If officer performance data is available, use it
        if (officerResponse.success && officerResponse.data && officerResponse.data.length > 0) {
          const officerStats = officerResponse.data.find((officer: any) => officer.officerId === officerId) || officerResponse.data[0];
          transformedData.metrics.customersServed = officerStats.customersServed || transformedData.metrics.customersServed;
          transformedData.metrics.averageServiceTime = `${Math.floor(officerStats.averageServiceTime || 8)}m ${Math.round(((officerStats.averageServiceTime || 8) % 1) * 60)}s`;
          transformedData.metrics.queueEfficiency = Math.round(officerStats.efficiency || 94);
        }

        setSummaryData(transformedData);
        console.log('📊 Daily summary loaded from backend successfully');
      } else {
        // Fallback to mock API if main analytics API doesn't have the data we need
        const date = selectedDate === 'today' ? new Date().toISOString().split('T')[0] : selectedDate;
        const data = await dailySummaryAPI.getDailySummary(date, officerId);
        setSummaryData(data);
        console.log('📊 Daily summary loaded from mock API');
      }
    } catch (error) {
      console.log('⚠️ Backend APIs not available, using fallback mock data');
      // Final fallback to mock data if all APIs fail
      setSummaryData(mockDailySummaryData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const date = selectedDate === 'today' ? new Date().toISOString().split('T')[0] : selectedDate;
      const blob = await dailySummaryAPI.exportSummary(date, officerId, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `daily-summary-${date}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      // Show user feedback
      alert(`📄 ${format.toUpperCase()} export completed! (Demo mode - Backend developers: implement real export)`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export feature requires backend integration');
    }
  };

  const handleEmail = async () => {
    try {
      const date = selectedDate === 'today' ? new Date().toISOString().split('T')[0] : selectedDate;
      const email = officerData.email || 'officer@sltmobitel.lk';
      await dailySummaryAPI.emailSummary(date, officerId, email);
      alert('📧 Summary email sent! (Demo mode - Backend developers: implement SMTP integration)');
    } catch (error) {
      console.error('Email failed:', error);
      alert('Email feature requires backend SMTP integration');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'transferred':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'transferred':
        return 'Transferred';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <OfficerLayout title="Daily Summary">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading daily summary...</p>
          </div>
        </div>
      </OfficerLayout>
    );
  }

  if (!summaryData) {
    return (
      <OfficerLayout title="Daily Summary">
        <div className="text-center py-12">
          <p className="text-gray-600">No data available for the selected date.</p>
        </div>
      </OfficerLayout>
    );
  }

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: '2025-09-29', label: 'Yesterday' },
    { value: '2025-09-28', label: 'Sep 28, 2025' },
    { value: '2025-09-27', label: 'Sep 27, 2025' }
  ];

  return (
    <OfficerLayout title="Daily Summary">
      <div className="space-y-6">
        {/* Demo Mode Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> Displaying mock data. Backend developers can implement the APIs as documented in the code comments.
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Summary</h1>
            <p className="text-sm text-gray-600">Performance overview and service details</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              options={dateOptions}
              className="w-40"
            />
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card padding="lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Customers Served</p>
                <p className="text-2xl font-bold text-gray-900">{summaryData.metrics.customersServed}</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Service Time</p>
                <p className="text-2xl font-bold text-gray-900">{summaryData.metrics.averageServiceTime}</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Queue Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">{summaryData.metrics.queueEfficiency}%</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900 mr-2">{summaryData.metrics.customerSatisfaction}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= summaryData.metrics.customerSatisfaction
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">/5</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Service Breakdown and Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Breakdown */}
          <Card padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Breakdown</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
                <span>Service Type</span>
                <span className="text-center">Count</span>
                <span className="text-right">Percentage</span>
              </div>
              {summaryData.serviceBreakdown.map((service, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 text-sm">
                  <span className="text-gray-900">{service.serviceType}</span>
                  <span className="text-center text-gray-900">{service.count}</span>
                  <span className="text-right text-gray-900">{service.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Time Analysis */}
          <Card padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Analysis</h3>
            <div className="space-y-6">
              {/* Chart Placeholder */}
              <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-700">Time Distribution Chart</p>
                  <p className="text-xs text-blue-600">Backend: Implement chart data</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Peak Hour</p>
                  <p className="text-lg font-semibold text-gray-900">{summaryData.timeAnalysis.peakHour}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Time</p>
                  <p className="text-lg font-semibold text-gray-900">{summaryData.timeAnalysis.activeTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Break Time</p>
                  <p className="text-lg font-semibold text-gray-900">{summaryData.timeAnalysis.breakTime}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Customer Service Details */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Service Details</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Token</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Service Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.customerServiceDetails.map((detail, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{detail.time}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{detail.token}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{detail.customer}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{detail.serviceType}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{detail.duration}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(detail.status)}`}>
                        {getStatusText(detail.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing 5 of {summaryData.totalCustomers} customers
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded">
                {currentPage}
              </span>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, summaryData.totalPages))}
                disabled={currentPage === summaryData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </OfficerLayout>
  );
}