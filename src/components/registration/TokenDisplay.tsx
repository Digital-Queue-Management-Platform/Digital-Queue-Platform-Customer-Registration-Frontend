import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, Users, QrCode, CheckCircle, Plus, RefreshCw } from 'lucide-react';
import type { Customer } from '../../types';
import { useQueue } from '../../context/QueueContext';
import { customerAPI } from '../../utils/api';

interface TokenDisplayProps {
  customer: Customer;
  onBack: () => void;
}

export function TokenDisplay({ customer, onBack }: TokenDisplayProps) {
  const { queueStatus, startRealTimeUpdates, stopRealTimeUpdates } = useQueue();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [allCustomerTokens, setAllCustomerTokens] = useState<Customer[]>([customer]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Customer>(customer);

  useEffect(() => {
    startRealTimeUpdates(selectedToken.tokenNumber);
    generateQRCode();
    loadAllCustomerTokens();

    return () => {
      stopRealTimeUpdates();
    };
  }, [selectedToken.tokenNumber, startRealTimeUpdates, stopRealTimeUpdates]);

  const loadAllCustomerTokens = async () => {
    try {
      setIsLoadingTokens(true);
      const response = await customerAPI.getCustomerTokens(customer.phoneNumber);
      
      if (response.success && response.data) {
        // Filter out tokens that are older than 24 hours and not completed
        const recentTokens = response.data.filter((token: Customer) => {
          const tokenDate = new Date(token.createdAt);
          const hoursDiff = (Date.now() - tokenDate.getTime()) / (1000 * 60 * 60);
          return hoursDiff < 24 || token.status !== 'completed';
        });
        
        setAllCustomerTokens(recentTokens.length > 0 ? recentTokens : [customer]);
      } else {
        // Fallback to just the current customer if API fails
        setAllCustomerTokens([customer]);
      }
    } catch (error) {
      console.log('Could not load all customer tokens, using current token only:', error);
      setAllCustomerTokens([customer]);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  const generateQRCode = async () => {
    try {
      // Create QR code data for the selected token
      const qrData = JSON.stringify({
        tokenNumber: selectedToken.tokenNumber,
        name: selectedToken.name,
        serviceType: selectedToken.serviceType,
        timestamp: selectedToken.createdAt,
      });

      // For demonstration, create a simple QR code URL using qr-server.com
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const currentPosition = queueStatus?.position || selectedToken.queuePosition;
  const estimatedWaitTime = queueStatus?.estimatedWaitTime || selectedToken.estimatedWaitTime;
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Your Token Number</h2>
            {allCustomerTokens.length > 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadAllCustomerTokens}
                disabled={isLoadingTokens}
                className="text-xs"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isLoadingTokens ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {selectedToken.tokenNumber}
          </div>
          <p className="text-gray-600">{selectedToken.name}</p>
          <p className="text-sm text-gray-500">{selectedToken.serviceType}</p>
        </div>

        {selectedToken.status === 'being_served' && (
          <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">You're being served!</span>
          </div>
        )}
      </Card>

      {/* Multiple Tokens Card - Show if customer has additional service tokens */}
      {allCustomerTokens.length > 1 && (
        <Card padding="md">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">All Your Service Tokens</h3>
            <p className="text-xs text-gray-500">
              You have {allCustomerTokens.length} service requests. Tap a token to view its status.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {allCustomerTokens.map((token) => (
              <button
                key={token.tokenNumber}
                onClick={() => setSelectedToken(token)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  selectedToken.tokenNumber === token.tokenNumber
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-blue-600">
                    {token.tokenNumber}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    token.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                    token.status === 'being_served' ? 'bg-green-100 text-green-800' :
                    token.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {token.status === 'waiting' ? 'Waiting' :
                     token.status === 'being_served' ? 'Serving' :
                     token.status === 'completed' ? 'Done' : 'Cancelled'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate">
                  {token.serviceType}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(token.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </button>
            ))}
          </div>
        </Card>
      )}

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