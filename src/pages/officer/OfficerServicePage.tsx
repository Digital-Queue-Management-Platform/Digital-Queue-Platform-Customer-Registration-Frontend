import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, User, Phone, FileText, Plus, CheckCircle, X } from 'lucide-react';
import { OfficerLayout } from '../../components/officer/OfficerLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { customerAPI } from '../../utils/api';

interface CustomerData {
  token: string;
  customer: string;
  phone: string;
  serviceType: string;
  waitTime: number;
  notes: string;
}

export function OfficerServicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const customerData = location.state as CustomerData;
  
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [newTokenData, setNewTokenData] = useState({
    customerName: customerData?.customer || '',
    phone: customerData?.phone || '',
    serviceType: '',
    priority: 'normal'
  });

  // Redirect if no customer data
  useEffect(() => {
    if (!customerData) {
      navigate('/officer/queue');
    }
  }, [customerData, navigate]);

  const handleCompleteService = () => {
    alert(`Service completed for ${customerData.customer} (${customerData.token})`);
    navigate('/officer/queue');
  };

  const handleGenerateNewToken = async () => {
    try {
      // Use the actual customer registration API for additional services
      const response = await customerAPI.register({
        name: newTokenData.customerName,
        phoneNumber: newTokenData.phone,
        serviceType: newTokenData.serviceType,
        outletId: 'cmg5dtc320000m4m26o15ce8d', // Downtown Branch
        // Additional metadata for backend to link tokens
        relatedToToken: customerData.token, // Link to original service
        priority: newTokenData.priority,
        isAdditionalService: true, // Flag to indicate this is an additional service
      } as any);

      if (response.success && response.data) {
        console.log('Additional token registered successfully:', response.data);
        alert(`Additional token ${response.data.tokenNumber} generated for ${newTokenData.customerName}!\n\nService: ${newTokenData.serviceType}\nQueue Position: ${response.data.queuePosition}`);
      } else {
        throw new Error(response.message || 'Failed to generate additional token');
      }
    } catch (error: any) {
      console.error('Failed to generate additional token:', error);
      
      // Fallback to mock generation if API fails
      const tokenPrefix = newTokenData.priority === 'priority' ? 'P' : 'A';
      const tokenNumber = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
      const newToken = `${tokenPrefix}${tokenNumber}`;
      
      console.log('Using fallback token generation:', {
        token: newToken,
        customerName: newTokenData.customerName,
        phone: newTokenData.phone,
        serviceType: newTokenData.serviceType,
        priority: newTokenData.priority,
        relatedToToken: customerData.token,
      });
      
      alert(`Additional token ${newToken} generated for ${newTokenData.customerName}!\n\nNote: Backend unavailable, using mock token.`);
    } finally {
      // Reset form and close modal
      setNewTokenData({
        customerName: customerData?.customer || '',
        phone: customerData?.phone || '',
        serviceType: '',
        priority: 'normal'
      });
      setShowTokenModal(false);
    }
  };

  if (!customerData) {
    return null; // Will redirect in useEffect
  }

  return (
    <OfficerLayout title="Service in Progress" subtitle="Currently serving customer">
      <div className="space-y-6">
        {/* Customer Information Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              Service in Progress
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">{customerData.token}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Token Number</p>
                  <p className="font-semibold text-gray-900">{customerData.token}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-semibold text-gray-900">{customerData.customer}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold text-gray-900">{customerData.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-semibold text-gray-900">{customerData.serviceType}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Wait Time</p>
                  <p className="font-semibold text-gray-900">{customerData.waitTime} minutes</p>
                </div>
              </div>
              
              {customerData.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notes</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{customerData.notes}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleCompleteService}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 px-6 py-3"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Service
            </Button>
            
            <Button
              onClick={() => setShowTokenModal(true)}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2 px-6 py-3"
            >
              <Plus className="w-5 h-5" />
              Generate New Token for Additional Service
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mt-3">
            Use "Generate New Token" if the customer needs additional services that require a separate queue entry.
          </p>
        </Card>
      </div>

      {/* Generate Additional Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generate Additional Token</h3>
              <button 
                onClick={() => setShowTokenModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <Input
                  value={newTokenData.customerName}
                  onChange={(e) => setNewTokenData({...newTokenData, customerName: e.target.value})}
                  placeholder="Customer name"
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  value={newTokenData.phone}
                  onChange={(e) => setNewTokenData({...newTokenData, phone: e.target.value})}
                  placeholder="Phone number"
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Service Type
                </label>
                <Select
                  value={newTokenData.serviceType}
                  onChange={(e) => setNewTokenData({...newTokenData, serviceType: e.target.value})}
                  options={[
                    { value: '', label: 'Select additional service' },
                    { value: 'New Connections', label: 'New Connections' },
                    { value: 'Bill Payments', label: 'Bill Payments' },
                    { value: 'Technical Support', label: 'Technical Support' },
                    { value: 'Account Services', label: 'Account Services' },
                    { value: 'Device/SIM Issues', label: 'Device/SIM Issues' }
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select
                  value={newTokenData.priority}
                  onChange={(e) => setNewTokenData({...newTokenData, priority: e.target.value})}
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'priority', label: 'Priority' }
                  ]}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowTokenModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateNewToken}
                disabled={!newTokenData.serviceType}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Generate Additional Token
              </Button>
            </div>
          </div>
        </div>
      )}
    </OfficerLayout>
  );
}