import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    startRealTimeUpdates(customer.tokenNumber);
    generateQRCode();

    return () => {
      stopRealTimeUpdates();
    };
  }, [customer.tokenNumber, startRealTimeUpdates, stopRealTimeUpdates]);

  const generateQRCode = async () => {
    try {
      // Create QR code data
      const qrData = JSON.stringify({
        tokenNumber: customer.tokenNumber,
        name: customer.name,
        serviceType: customer.serviceType,
        timestamp: customer.createdAt,
      });

      // For demonstration, create a simple QR code URL using qr-server.com
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const currentPosition = queueStatus?.position || customer.queuePosition;
  const estimatedWaitTime = queueStatus?.estimatedWaitTime || customer.estimatedWaitTime;
  const progressPercentage = Math.max(0, 100 - (currentPosition * 10));

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Token Number Card */}
      <Card padding="lg" className="text-center">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Token Number</h2>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {customer.tokenNumber}
          </div>
          <p className="text-gray-600">{customer.name}</p>
          <p className="text-sm text-gray-500">{customer.serviceType}</p>
        </div>

        {customer.status === 'serving' && (
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
              {formatWaitTime(estimatedWaitTime)}
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