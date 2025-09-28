import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Clock, Users, TrendingUp } from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { format } from 'date-fns';

interface QueueStatusBoardProps {
  outletId: string;
}

export function QueueStatusBoard({ outletId }: QueueStatusBoardProps) {
  const { outletQueue, fetchOutletQueue, isLoading } = useQueue();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchOutletQueue(outletId);

    // Update queue every 3 seconds
    const queueInterval = setInterval(() => {
      fetchOutletQueue(outletId);
    }, 3000);

    // Update clock every second
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(queueInterval);
      clearInterval(clockInterval);
    };
  }, [outletId, fetchOutletQueue]);

  if (isLoading && !outletQueue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            MOBITEL Queue Status
          </h1>
        </div>
        <p className="text-xl text-gray-600">
          {format(currentTime, 'EEEE, MMMM do, yyyy - HH:mm:ss')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Currently Serving */}
          <Card padding="lg" className="lg:col-span-2">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Now Serving</h2>
              <div className="text-8xl font-bold text-blue-600 mb-4">
                {outletQueue?.currentlyServing || '--'}
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Clock className="w-6 h-6" />
                <span className="text-xl font-semibold">Please proceed to counter</span>
              </div>
            </div>
          </Card>

          {/* Queue Statistics */}
          <div className="space-y-6">
            <Card padding="md">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Waiting</h3>
                </div>
                <div className="text-4xl font-bold text-blue-600">
                  {outletQueue?.totalWaiting || 0}
                </div>
                <p className="text-sm text-gray-600 mt-1">customers in queue</p>
              </div>
            </Card>

            <Card padding="md">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Avg Wait</h3>
                </div>
                <div className="text-4xl font-bold text-green-600">
                  {outletQueue?.averageWaitTime || 0}
                </div>
                <p className="text-sm text-gray-600 mt-1">minutes</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Next in Line */}
        {outletQueue?.nextTokens && outletQueue.nextTokens.length > 0 && (
          <Card padding="lg" className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Next in Line</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {outletQueue.nextTokens.slice(0, 12).map((token, index) => (
                <div
                  key={token}
                  className="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
                >
                  <div className="text-2xl font-bold text-gray-700 mb-1">
                    {token}
                  </div>
                  <div className="text-xs text-gray-500">
                    Position {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Service Information */}
        <Card padding="md" className="mt-6 bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Service Information
            </h3>
            <p className="text-blue-700">
              Please have your documents ready • Stay alert for your token number • 
              Visit customer service for assistance
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}