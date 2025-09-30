import { OfficerLayout } from '../components/officer/OfficerLayout';
import { Card } from '../components/ui/Card';
import { Users, Clock, ArrowRight } from 'lucide-react';

export function OfficerQueueManagement() {
  const mockQueueData = [
    { token: 'A046', customer: 'Priyantha Silva', serviceType: 'Bill Payments', waitTime: 15, status: 'waiting' },
    { token: 'A047', customer: 'Malini Fernando', serviceType: 'Account Services', waitTime: 12, status: 'waiting' },
    { token: 'P012', customer: 'Asanka Perera', serviceType: 'New Connections', waitTime: 10, status: 'priority' },
    { token: 'A048', customer: 'Lakshmi Gunawardena', serviceType: 'Device/SIM Issues', waitTime: 8, status: 'waiting' },
    { token: 'A049', customer: 'Thilak Rathnayake', serviceType: 'Technical Support', waitTime: 5, status: 'waiting' },
  ];

  return (
    <OfficerLayout title="Queue Management" subtitle="Manage customer queue and service flow">
      <div className="space-y-6">
        {/* Queue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total in Queue</p>
                <p className="text-2xl font-bold text-gray-900">{mockQueueData.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Wait</p>
                <p className="text-2xl font-bold text-gray-900">12 min</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowRight className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Next Available</p>
                <p className="text-2xl font-bold text-gray-900">A046</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Queue List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Queue</h3>
          <div className="space-y-3">
            {mockQueueData.map((customer, index) => (
              <div key={customer.token} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    customer.status === 'priority' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {customer.token}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{customer.customer}</p>
                    <p className="text-sm text-gray-600">{customer.serviceType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Wait Time</p>
                    <p className="font-medium text-gray-900">{customer.waitTime} min</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Call
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                      Skip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </OfficerLayout>
  );
}