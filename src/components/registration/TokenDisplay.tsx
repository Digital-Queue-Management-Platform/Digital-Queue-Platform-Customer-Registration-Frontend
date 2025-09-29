import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, Users, QrCode, CheckCircle } from 'lucide-react';
import type { Customer } from '../../types';
import { useQueue } from '../../context/QueueContext';

interface TokenDisplayProps {
  customer: Customer;
  onBack: () => void;
}

export function TokenDisplay({ customer, onBack }: TokenDisplayProps) {
  const { queueStatus, startRealTimeUpdates, stopRealTimeUpdates } = useQueue();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Debug customer data
  useEffect(() => {
    console.log('TokenDisplay received customer data:', customer);
  }, [customer]);

  useEffect(() => {
    startRealTimeUpdates(customer.tokenNumber);
    generateQRCode();

    return () => {
      stopRealTimeUpdates();
    };
  }, [customer.tokenNumber, startRealTimeUpdates, stopRealTimeUpdates]);

  const generateQRCode = async () => {
    try {
      // Get real QR data from backend API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/customer/${customer.tokenNumber}/qr`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // Use the real QR data from backend
        const qrData = result.data.qrData;
        
        // Generate QR code URL using qr-server.com with real data
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
        setQrCodeUrl(qrUrl);
        
        console.log('Generated QR code with real data:', JSON.parse(qrData));
      } else {
        throw new Error('Failed to get QR data from backend');
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      
      // Fallback to local QR generation if API fails
      const fallbackQrData = JSON.stringify({
        tokenNumber: customer.tokenNumber,
        name: customer.name,
        serviceType: customer.serviceType,
        timestamp: customer.createdAt,
      });

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fallbackQrData)}`;
      setQrCodeUrl(qrUrl);
    }
  };

  const currentPosition = queueStatus?.position || customer.queuePosition;
  const rawWaitTime = queueStatus?.estimatedWaitTime || customer.estimatedWaitTime;
  
  // Calculate realistic progress based on queue position
  // Assume average 5-10 people in queue, so position 2 out of 10 = 80% progress
  const totalQueueEstimate = Math.max(currentPosition + 3, 8); // Minimum queue size of 8
  const progressPercentage = Math.max(10, Math.min(90, ((totalQueueEstimate - currentPosition) / totalQueueEstimate) * 100));

  // Extract short token number (e.g., "QT-20250929-0002" -> "T002") 
  const getShortTokenNumber = (tokenNumber: string | undefined) => {
    if (!tokenNumber) {
      return 'T???';
    }
    const parts = tokenNumber.split('-');
    if (parts.length >= 3) {
      const sequence = parts[parts.length - 1]; // Get last part (e.g., "0002")
      return `T${sequence}`; // Return "T002"
    }
    return tokenNumber; // Fallback to full token if parsing fails
  };

  const formatWaitTime = (timeInMilliseconds: number) => {
    // Convert milliseconds to minutes for realistic display
    const minutes = Math.floor(timeInMilliseconds / (1000 * 60));
    
    // Cap maximum wait time to something reasonable (e.g., 4 hours = 240 minutes)
    const cappedMinutes = Math.min(minutes, 240);
    
    if (cappedMinutes < 60) {
      return `${cappedMinutes}m`;
    }
    const hours = Math.floor(cappedMinutes / 60);
    const remainingMinutes = cappedMinutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  // Get formatted wait time
  const displayWaitTime = formatWaitTime(rawWaitTime);

  // Format service type for display
  const formatServiceType = (serviceType: string | undefined) => {
    // Handle undefined/null service types
    if (!serviceType) {
      return 'General Service';
    }
    
    // Handle different service type formats
    if (serviceType.startsWith('SVC')) {
      // Handle legacy SVC codes
      const serviceMap: { [key: string]: string } = {
        'SVC001': 'New Connection',
        'SVC002': 'Bill Payment', 
        'SVC003': 'Technical Support',
        'SVC004': 'Account Update',
        'SVC005': 'Package Change',
        'SVC006': 'Service Disconnection',
        'SVC007': 'Device Support',
        'SVC008': 'Complaint Resolution'
      };
      return serviceMap[serviceType] || 'General Service';
    }
    
    // Handle hyphenated service types like 'bill-payments'
    if (serviceType.includes('-')) {
      return serviceType
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Handle camelCase or single words
    return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Token Number Card */}
      <Card padding="lg" className="text-center">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Token Number</h2>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {getShortTokenNumber(customer?.tokenNumber)}
          </div>
          <p className="text-lg font-medium text-gray-700">{customer?.name || 'Unknown Customer'}</p>
          <p className="text-sm text-blue-600 font-medium">{formatServiceType(customer?.serviceType)}</p>
        </div>

        {customer.status === 'being_served' && (
          <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">You're being served!</span>
          </div>
        )}
      </Card>

      {/* Queue Status Card */}
      <Card padding="md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Queue Position</span>
            </div>
            <span className="text-lg font-bold text-blue-600">#{currentPosition}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Estimated Wait</span>
            </div>
            <span className="text-lg font-semibold text-green-600">
              {displayWaitTime}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {queueStatus?.currentlyServing && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Currently Serving</p>
              <p className="font-bold text-blue-600">{queueStatus.currentlyServing}</p>
            </div>
          )}
        </div>
      </Card>

      {/* QR Code Card */}
      {qrCodeUrl && (
        <Card padding="md" className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <QrCode className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Your QR Code</span>
          </div>
          <img
            src={qrCodeUrl}
            alt="Token QR Code"
            className="mx-auto mb-3 border border-gray-200 rounded-lg"
          />
          <p className="text-xs text-gray-500">
            Show this QR code to the service representative
          </p>
        </Card>
      )}

      <Button variant="outline" fullWidth onClick={onBack}>
        Register Another Customer
      </Button>
    </div>
  );
}