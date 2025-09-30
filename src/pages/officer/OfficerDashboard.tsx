import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfficerLayout } from '../../components/officer/OfficerLayout';
import { Card } from '../../components/ui/Card';
import { analyticsAPI, queueAPI } from '../../utils/api';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Phone,
  CreditCard,
  Settings as SettingsIcon,
  Shield,
  Smartphone,
  Star
} from 'lucide-react';

// Normalize service types to prevent backend inconsistencies
const normalizeServiceType = (serviceType: string): string => {
  if (!serviceType) return 'Technical Support';
  
  const normalized = serviceType.toLowerCase().trim();
  
  // Log the original backend service type for debugging
  console.log('Dashboard - Backend service type:', serviceType, '-> normalized:', normalized);
  
  // Map backend service types to frontend service types
  const serviceTypeMapping: { [key: string]: string } = {
    // Common variations for New Connections
    'new_connections': 'New Connections',
    'new connections': 'New Connections',
    'newconnections': 'New Connections',
    'new_connection': 'New Connections',
    'new connection': 'New Connections',
    'connection': 'New Connections',
    'connections': 'New Connections',
    
    // Common variations for Bill Payments
    'bill_payments': 'Bill Payments',
    'bill payments': 'Bill Payments',
    'billpayments': 'Bill Payments',
    'bill_payment': 'Bill Payments',
    'bill payment': 'Bill Payments',
    'payment': 'Bill Payments',
    'payments': 'Bill Payments',
    'billing': 'Bill Payments',
    
    // Common variations for Technical Support
    'technical_support': 'Technical Support',
    'technical support': 'Technical Support',
    'technicalsupport': 'Technical Support',
    'tech_support': 'Technical Support',
    'tech support': 'Technical Support',
    'support': 'Technical Support',
    'technical': 'Technical Support',
    'tech': 'Technical Support',
    
    // Common variations for Account Services
    'account_services': 'Account Services',
    'account services': 'Account Services',
    'accountservices': 'Account Services',
    'account_service': 'Account Services',
    'account service': 'Account Services',
    'account': 'Account Services',
    'services': 'Account Services',
    'service': 'Account Services',
    
    // Common variations for Device/SIM Issues
    'device_sim_issues': 'Device/SIM Issues',
    'device sim issues': 'Device/SIM Issues',
    'device/sim issues': 'Device/SIM Issues',
    'devicesimissues': 'Device/SIM Issues',
    'device_issues': 'Device/SIM Issues',
    'device issues': 'Device/SIM Issues',
    'sim_issues': 'Device/SIM Issues',
    'sim issues': 'Device/SIM Issues',
    'device': 'Device/SIM Issues',
    'sim': 'Device/SIM Issues',
    'mobile': 'Device/SIM Issues',
    'mobile_issues': 'Device/SIM Issues',
    'mobile issues': 'Device/SIM Issues'
  };
  
  // Check direct mapping first
  if (serviceTypeMapping[normalized]) {
    console.log('Dashboard - Mapped to:', serviceTypeMapping[normalized]);
    return serviceTypeMapping[normalized];
  }
  
  // Fallback to partial matching
  if (normalized.includes('connection') || normalized.includes('new')) {
    console.log('Dashboard - Mapped to: New Connections (partial match)');
    return 'New Connections';
  } else if (normalized.includes('bill') || normalized.includes('payment')) {
    console.log('Dashboard - Mapped to: Bill Payments (partial match)');
    return 'Bill Payments';
  } else if (normalized.includes('technical') || normalized.includes('support') || normalized.includes('tech')) {
    console.log('Dashboard - Mapped to: Technical Support (partial match)');
    return 'Technical Support';
  } else if (normalized.includes('account') || normalized.includes('service')) {
    console.log('Dashboard - Mapped to: Account Services (partial match)');
    return 'Account Services';
  } else if (normalized.includes('device') || normalized.includes('sim') || normalized.includes('mobile')) {
    console.log('Dashboard - Mapped to: Device/SIM Issues (partial match)');
    return 'Device/SIM Issues';
  }
  
  // If no match found, default to Technical Support and log for debugging
  console.warn('Dashboard - Unknown service type from backend:', serviceType, '- defaulting to Technical Support');
  return 'Technical Support';
};

export function OfficerDashboard() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    totalCustomersWaiting: 14,
    averageWaitTime: 12,
    customersServedToday: 27
  });
  const [serviceTypeData, setServiceTypeData] = useState<any[]>([]);
  const [nextInQueueData, setNextInQueueData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if officer is authenticated
    const token = localStorage.getItem('officer_token');
    if (!token) {
      navigate('/officer-login');
      return;
    }
    
    // Load dashboard data
    loadDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const outletId = 'cmg5dtc320000m4m26o15ce8d'; // Downtown Branch
      
      // Load analytics and queue data in parallel
      const [analyticsResponse, queueResponse] = await Promise.all([
        analyticsAPI.getDashboard().catch(() => null),
        queueAPI.getOutletQueue(outletId).catch(() => null)
      ]);

      // Update stats data
      if (analyticsResponse?.success && analyticsResponse.data) {
        setStatsData({
          totalCustomersWaiting: analyticsResponse.data.totalCustomersToday || 14,
          averageWaitTime: analyticsResponse.data.averageWaitTime || 12,
          customersServedToday: analyticsResponse.data.completedServices || 27
        });

        // Update service type breakdown
        if (analyticsResponse.data.serviceTypeBreakdown) {
          const transformedServiceData = analyticsResponse.data.serviceTypeBreakdown.map((item: any, index: number) => {
            const colors = ['bg-orange-400', 'bg-green-400', 'bg-yellow-400', 'bg-cyan-400', 'bg-emerald-400'];
            const icons = [Phone, CreditCard, SettingsIcon, Shield, Smartphone];
            const normalizedType = normalizeServiceType(item.type || item.name);
            return {
              type: normalizedType,
              count: item.count,
              color: colors[index % colors.length],
              icon: icons[index % icons.length]
            };
          });
          setServiceTypeData(transformedServiceData);
        }
      }

      // Update queue data
      if (queueResponse?.success && queueResponse.data) {
        const transformedQueueData = queueResponse.data.nextTokens?.slice(0, 3).map((token: any, index: number) => ({
          number: index + 1,
          token: token.tokenNumber || token.token || `A ${String(89 + index)}`,
          type: normalizeServiceType(token.serviceType || 'General Service'),
          waitTime: token.estimatedWaitTime || Math.floor(Math.random() * 20) + 5
        })) || [];
        setNextInQueueData(transformedQueueData);

        // Update waiting count from queue data
        if (queueResponse.data && queueResponse.data.totalWaiting !== undefined) {
          setStatsData(prev => ({
            ...prev,
            totalCustomersWaiting: queueResponse.data.totalWaiting
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback data for when backend is unavailable
  const fallbackServiceTypeData = [
    { type: 'New Connections', count: 5, color: 'bg-orange-400', icon: Phone },
    { type: 'Bill Payments', count: 4, color: 'bg-green-400', icon: CreditCard },
    { type: 'Technical Support', count: 3, color: 'bg-yellow-400', icon: SettingsIcon },
    { type: 'Account Services', count: 2, color: 'bg-cyan-400', icon: Shield },
    { type: 'Device/SIM Issues', count: 2, color: 'bg-emerald-400', icon: Smartphone }
  ];

  const fallbackNextInQueueData = [
    { number: 1, token: 'A 89', type: normalizeServiceType('New Connections'), waitTime: 8 },
    { number: 2, token: 'A 98', type: normalizeServiceType('Device/SIM Issues'), waitTime: 17 },
    { number: 3, token: 'A 80', type: normalizeServiceType('Bill Payments'), waitTime: 9 }
  ];

  // Initialize with fallback data if state is empty
  const currentServiceTypeData = serviceTypeData.length > 0 ? serviceTypeData : fallbackServiceTypeData;
  const currentNextInQueueData = nextInQueueData.length > 0 ? nextInQueueData : fallbackNextInQueueData;

  const performanceData = {
    averageServiceTime: '8m 24s',
    customersServed: 27,
    serviceEfficiency: '94%',
    customerSatisfaction: 4.2
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <OfficerLayout title="Service Officer Dashboard">
      <div className="space-y-6">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Customers Waiting */}
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers Waiting</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.totalCustomersWaiting}</p>
              </div>
            </div>
          </Card>

          {/* Average Wait Time */}
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Wait Time</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.averageWaitTime} min</p>
              </div>
            </div>
          </Card>

          {/* Customers Served Today */}
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Customers Served Today</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.customersServedToday}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Queue by Service Type */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue by Service Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {currentServiceTypeData.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${service.color} rounded-lg mb-3 mx-auto`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{service.type}</p>
                  <div className={`w-full h-2 ${service.color} rounded-full`}></div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Next in Queue */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next in Queue</h3>
            <div className="space-y-4">
              {currentNextInQueueData.map((customer) => (
                <div key={customer.token} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{customer.number}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Token: {customer.token}</p>
                      <p className="text-sm text-gray-600">{customer.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Wait time</p>
                    <p className="text-sm text-gray-600">{customer.waitTime} min</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Queue
              </button>
            </div>
          </Card>

          {/* Your Performance Today */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Performance Today</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Service Time</span>
                <span className="font-semibold text-gray-900">{performanceData.averageServiceTime}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customers Served</span>
                <span className="font-semibold text-gray-900">{performanceData.customersServed}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service Efficiency</span>
                <span className="font-semibold text-green-600">{performanceData.serviceEfficiency}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer Satisfaction</span>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {renderStarRating(performanceData.customerSatisfaction)}
                  </div>
                  <span className="font-semibold text-gray-900">{performanceData.customerSatisfaction}/5</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Full Report
              </button>
            </div>
          </Card>
        </div>
      </div>
    </OfficerLayout>
  );
}