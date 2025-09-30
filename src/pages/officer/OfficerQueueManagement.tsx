import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, ChevronRight, Phone, Calendar } from 'lucide-react';
import { OfficerLayout } from '../../components/officer/OfficerLayout';
import { queueAPI, customerAPI } from '../../utils/api';

// Normalize service types to prevent icon flickering from backend inconsistencies
const normalizeServiceType = (serviceType: string): string => {
  if (!serviceType) return 'Technical Support';
  
  const normalized = serviceType.toLowerCase().trim();
  
  // Log the original backend service type for debugging
  console.log('Backend service type:', serviceType, '-> normalized:', normalized);
  
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
    console.log('Mapped to:', serviceTypeMapping[normalized]);
    return serviceTypeMapping[normalized];
  }
  
  // Fallback to partial matching
  if (normalized.includes('connection') || normalized.includes('new')) {
    console.log('Mapped to: New Connections (partial match)');
    return 'New Connections';
  } else if (normalized.includes('bill') || normalized.includes('payment')) {
    console.log('Mapped to: Bill Payments (partial match)');
    return 'Bill Payments';
  } else if (normalized.includes('technical') || normalized.includes('support') || normalized.includes('tech')) {
    console.log('Mapped to: Technical Support (partial match)');
    return 'Technical Support';
  } else if (normalized.includes('account') || normalized.includes('service')) {
    console.log('Mapped to: Account Services (partial match)');
    return 'Account Services';
  } else if (normalized.includes('device') || normalized.includes('sim') || normalized.includes('mobile')) {
    console.log('Mapped to: Device/SIM Issues (partial match)');
    return 'Device/SIM Issues';
  }
  
  // If no match found, default to Technical Support and log for debugging
  console.warn('Unknown service type from backend:', serviceType, '- defaulting to Technical Support');
  return 'Technical Support';
};

export function OfficerQueueManagement() {
  const navigate = useNavigate();
  
  const [currentCustomer, setCurrentCustomer] = useState({
    token: 'A045',
    customer: 'Kumara Jayawardena',
    phone: '071-555-7890',
    serviceType: 'Technical Support',
    waitTime: 18,
    notes: 'Router configuration issue'
  });

  const [activeTab, setActiveTab] = useState('All Services');
  const [currentPage, setCurrentPage] = useState(1);
  const [queueData, setQueueData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingRealData, setIsUsingRealData] = useState(false);

  // Fallback mock data for when backend is unavailable - using normalized service types
  const mockQueueData = [
    { token: 'A044', customer: 'Nuwan Test', serviceType: 'Technical Support', waitTime: 22, status: 'waiting', phone: '071-234-5678' },
    { token: 'A046', customer: 'Priyantha Silva', serviceType: 'Bill Payments', waitTime: 15, status: 'waiting' },
    { token: 'A047', customer: 'Malini Fernando', serviceType: 'Account Services', waitTime: 12, status: 'waiting' },
    { token: 'P012', customer: 'Asanka Perera', serviceType: 'New Connections', waitTime: 10, status: 'priority' },
    { token: 'A048', customer: 'Lakshmi Gunawardena', serviceType: 'Device/SIM Issues', waitTime: 8, status: 'waiting' },
    { token: 'A049', customer: 'Thilak Rathnayake', serviceType: 'Technical Support', waitTime: 5, status: 'waiting' },
  ].map(customer => ({
    ...customer,
    serviceType: normalizeServiceType(customer.serviceType)
  }));

  // Use static SVG icons to prevent hydration issues
  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'New Connections':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'Bill Payments':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'Technical Support':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'Account Services':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'Device/SIM Issues':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const serviceTypes = [
    { 
      id: 'All Services', 
      label: 'All Services', 
      color: 'bg-gray-100 text-gray-700', 
      hoverColor: 'hover:bg-gray-200' 
    },
    { 
      id: 'New Connections', 
      label: 'New Connections', 
      color: 'bg-blue-100 text-blue-700', 
      hoverColor: 'hover:bg-blue-200' 
    },
    { 
      id: 'Bill Payments', 
      label: 'Bill Payments', 
      color: 'bg-teal-100 text-teal-700', 
      hoverColor: 'hover:bg-teal-200' 
    },
    { 
      id: 'Technical Support', 
      label: 'Technical Support', 
      color: 'bg-orange-100 text-orange-700', 
      hoverColor: 'hover:bg-orange-200' 
    },
    { 
      id: 'Account Services', 
      label: 'Account Services', 
      color: 'bg-green-100 text-green-700', 
      hoverColor: 'hover:bg-green-200' 
    },
    { 
      id: 'Device/SIM Issues', 
      label: 'Device/SIM Issues', 
      color: 'bg-pink-100 text-pink-700', 
      hoverColor: 'hover:bg-pink-200' 
    }
  ];

  // Load queue data from backend
  useEffect(() => {
    loadQueueData();
    // Refresh every 30 seconds
    const interval = setInterval(loadQueueData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadQueueData = async () => {
    try {
      setIsLoading(true);
      const outletId = 'cmg5dtc320000m4m26o15ce8d'; // Downtown Branch
      
      console.log('Loading queue data for outlet:', outletId);
      const response = await queueAPI.getOutletQueue(outletId);
      
      console.log('Queue API Response:', response);
      
      if (response.success && response.data) {
        let transformedData: any[] = [];
        
        // Handle different response formats
        if (response.data.nextTokens && Array.isArray(response.data.nextTokens)) {
          if (response.data.nextTokens.length > 0) {
            // Check if it's an array of customer objects or token strings
            const firstItem = response.data.nextTokens[0];
            
            if (typeof firstItem === 'string') {
              // Array of token strings - need to fetch customer details for each
              console.log('Processing token strings:', response.data.nextTokens);
              
              const tokenStrings = response.data.nextTokens as string[];
              console.log('Fetching customer details for all tokens...');
              const customerPromises = tokenStrings.map(async (tokenId: string) => {
                try {
                  const customerResponse = await customerAPI.getCustomerStatus(tokenId);
                  if (customerResponse.success && customerResponse.data) {
                    return {
                      token: customerResponse.data.tokenNumber,
                      customer: customerResponse.data.name,
                      phone: customerResponse.data.phoneNumber,
                      serviceType: customerResponse.data.serviceType,
                      waitTime: customerResponse.data.estimatedWaitTime || 0,
                      status: customerResponse.data.status || 'waiting'
                    };
                  }
                } catch (error) {
                  console.warn(`Failed to fetch customer details for token ${tokenId}:`, error);
                }
                return null;
              });
              
              // Wait for ALL customer data before updating UI (prevents flickering)
              console.log('Waiting for all customer API calls to complete...');
              const customerResults = await Promise.all(customerPromises);
              transformedData = customerResults.filter(result => result !== null);
              console.log('All customer data loaded:', transformedData);
              
            } else if (typeof firstItem === 'object') {
              // Array of customer objects - transform directly
              console.log('Processing customer objects:', response.data.nextTokens);
              transformedData = response.data.nextTokens.map((customer: any) => ({
                token: customer.tokenNumber || customer.token || customer.id,
                customer: customer.name || customer.customerName || 'Unknown Customer',
                phone: customer.phoneNumber || customer.phone || '',
                serviceType: customer.serviceType || 'General Service',
                waitTime: customer.estimatedWaitTime || Math.floor(Math.random() * 20) + 5,
                status: customer.status || 'waiting'
              }));
            }
          }
        }
        
        console.log('Transformed queue data:', transformedData);
        
        // Normalize service types to prevent icon flickering
        const normalizedData = transformedData.map(customer => ({
          ...customer,
          serviceType: normalizeServiceType(customer.serviceType)
        }));
        
        if (normalizedData.length > 0) {
          setQueueData(normalizedData);
          setIsUsingRealData(true);
        } else {
          setQueueData(mockQueueData);
          setIsUsingRealData(false);
        }
        
        // Set current customer from currently serving
        if (response.data.currentlyServing && response.data.currentlyServing !== '--') {
          try {
            const customerResponse = await customerAPI.getCustomerStatus(response.data.currentlyServing);
            if (customerResponse.success && customerResponse.data) {
              setCurrentCustomer({
                token: customerResponse.data.tokenNumber,
                customer: customerResponse.data.name,
                phone: customerResponse.data.phoneNumber,
                serviceType: customerResponse.data.serviceType,
                waitTime: customerResponse.data.estimatedWaitTime || 0,
                notes: 'Currently being served'
              });
            }
          } catch (error) {
            console.warn('Could not fetch current customer details:', error);
          }
        }
      } else {
        console.warn('Queue API returned no data or failed, using mock data');
        setQueueData(mockQueueData);
        setIsUsingRealData(false);
      }
    } catch (error) {
      console.error('Failed to load queue data:', error);
      // Use fallback data
      setQueueData(mockQueueData);
      setIsUsingRealData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallCustomer = () => {
    alert(`Calling customer ${currentCustomer.token}`);
  };

  const handleCustomerArrived = () => {
    alert(`Customer ${currentCustomer.token} marked as arrived`);
  };

  const handleSkipCustomer = () => {
    alert(`Customer ${currentCustomer.token} skipped`);
  };

  const handleStartService = () => {
    // Navigate to service page with customer data
    navigate('/officer/service', { 
      state: currentCustomer 
    });
  };

  const handleTransferCounter = () => {
    alert(`Transferring ${currentCustomer.token} to another counter`);
  };

  const handleCallNext = () => {
    const currentQueueData = queueData.length > 0 ? queueData : mockQueueData;
    if (currentQueueData.length > 0) {
      setCurrentCustomer({
        token: currentQueueData[0].token,
        customer: currentQueueData[0].customer,
        phone: '071-555-7890',
        serviceType: currentQueueData[0].serviceType,
        waitTime: currentQueueData[0].waitTime,
        notes: 'Service request'
      });
      // Refresh queue data after calling next customer
      loadQueueData();
    }
  };

  return (
    <OfficerLayout title="Queue Management" subtitle="Tuesday, September 23, 2025 • 02:33 PM">
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button 
                onClick={handleCallNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Call Next Customer
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors">
                Recall
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Seat
              </button>
            </div>
            <div className="flex items-center space-x-3">
              {isLoading && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Loading queue...
                </div>
              )}
              <button 
                onClick={loadQueueData}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors disabled:opacity-50"
              >
                Refresh Queue
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-6">
            {/* Current Customer */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Customer</h2>
              
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-blue-600 mb-2">{currentCustomer.token}</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{currentCustomer.customer}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{currentCustomer.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{currentCustomer.serviceType}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">Waiting for: {currentCustomer.waitTime} min</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes:</label>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {currentCustomer.notes}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <button 
                  onClick={handleCallCustomer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Call Customer
                </button>
                <button 
                  onClick={handleCustomerArrived}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Customer Arrived
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleStartService}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Start Service
                </button>
                <button 
                  onClick={handleSkipCustomer}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                >
                  Skip Customer
                </button>
              </div>

              <button 
                onClick={handleTransferCounter}
                className="w-full mt-3 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Transfer To Another Counter
              </button>
            </div>

            {/* Queue List */}
            <div className="col-span-2 bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Queue List</h2>
              </div>

              {/* Service Type Icons */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {serviceTypes.map((serviceType) => {
                    const isActive = activeTab === serviceType.id;
                    const ServiceIcon = getServiceIcon(serviceType.id);
                    
                    return (
                      <button
                        key={serviceType.id}
                        onClick={() => setActiveTab(serviceType.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[40px] ${
                          isActive 
                            ? `${serviceType.color} ring-2 ring-offset-1 ring-blue-300 shadow-sm` 
                            : `bg-gray-50 text-gray-600 ${serviceType.hoverColor} hover:shadow-sm`
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {ServiceIcon && (
                            <span className="w-4 h-4 flex items-center justify-center">
                              {ServiceIcon}
                            </span>
                          )}
                          <span>{serviceType.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Data Source Indicator */}
              <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {isUsingRealData ? (
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Real-time data from backend ({queueData.length} customers)
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          Using fallback data - backend unavailable ({queueData.length} customers)
                        </span>
                      )}
                    </span>
                    <span className="text-gray-500">Auto-refresh every 30 seconds</span>
                  </div>
                  
                  {/* Debug: Show unique service types found in data */}
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Service types in queue:</span>{' '}
                    {Array.from(new Set(queueData.map(customer => customer.serviceType))).join(', ') || 'None'}
                  </div>
                </div>
              </div>

              {/* Queue Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Token
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Service Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Wait Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {queueData
                      .filter(customer => activeTab === 'All Services' || customer.serviceType === activeTab)
                      .map((customer) => (
                      <tr key={customer.token} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            customer.status === 'priority'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {customer.token}
                            {customer.status === 'priority' && (
                              <span className="ml-1 text-xs">Priority</span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {customer.serviceType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.waitTime} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-orange-600 hover:bg-orange-50 rounded">
                            <Phone className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing 5 of 14 Customers
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded text-sm ${
                      currentPage === 1 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    1
                  </button>
                  <button 
                    onClick={() => setCurrentPage(2)}
                    className={`px-3 py-1.5 rounded text-sm ${
                      currentPage === 2 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    2
                  </button>
                  <button 
                    onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}