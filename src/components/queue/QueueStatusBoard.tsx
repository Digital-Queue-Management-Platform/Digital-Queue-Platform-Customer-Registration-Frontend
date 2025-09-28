import { useEffect, useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Clock, Users } from 'lucide-react';
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
    const loadQueueData = async () => {
      try {
        console.log('[QueueStatusBoard] Loading initial queue data for outlet:', outletId);
        await fetchOutletQueue(outletId);
      } catch (error) {
        console.error('[QueueStatusBoard] Failed to load initial queue data:', error);
      }
    };

    loadQueueData();

    // Update queue every 10 seconds (increased interval to reduce load and prevent errors)
    const queueInterval = setInterval(async () => {
      try {
        console.log('[QueueStatusBoard] Auto-refreshing queue data...');
        await fetchOutletQueue(outletId);
      } catch (error) {
        console.error('[QueueStatusBoard] Auto-refresh failed:', error);
      }
    }, 10000); // Changed to 10 seconds to reduce API calls

    // Update clock every second
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(queueInterval);
      clearInterval(clockInterval);
    };
  }, [outletId]); // Removed fetchOutletQueue from dependencies to prevent infinite loop

  useEffect(() => {
    if (outletQueue) {
      console.log('[QueueStatusBoard] Outlet queue data:', outletQueue);
    }
  }, [outletQueue]);

  // Enhanced error handling with fallback data and null checks
  const displayData = useMemo(() => {
    try {
      return {
        currentlyServing: (outletQueue?.currentlyServing && typeof outletQueue.currentlyServing === 'string') ? outletQueue.currentlyServing : '--',
        totalWaiting: (typeof outletQueue?.totalWaiting === 'number' && !isNaN(outletQueue.totalWaiting)) ? outletQueue.totalWaiting : 0,
        averageWaitTime: (typeof outletQueue?.averageWaitTime === 'number' && !isNaN(outletQueue.averageWaitTime)) ? outletQueue.averageWaitTime : 0,
        nextTokens: (Array.isArray(outletQueue?.nextTokens)) ? outletQueue.nextTokens.filter(token => token && typeof token === 'string') : [],
      };
    } catch (error) {
      console.warn('[QueueStatusBoard] Error processing queue data:', error);
      return {
        currentlyServing: '--',
        totalWaiting: 0,
        averageWaitTime: 0,
        nextTokens: [],
      };
    }
  }, [outletQueue]);

  if (isLoading && !outletQueue) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Card className="p-8 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading queue data...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Current Time Display */}
      <div className="text-center">
        <p className="text-base sm:text-lg font-medium text-gray-700">
          <span className="hidden sm:inline">{format(currentTime, 'EEEE, MMMM do, yyyy - HH:mm:ss')}</span>
          <span className="sm:hidden">{format(currentTime, 'MMM do - HH:mm:ss')}</span>
        </p>
      </div>

      <div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Currently Serving */}
          <Card padding="lg" className="xl:col-span-2">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Now Serving</h2>
              <div className="text-4xl sm:text-6xl lg:text-8xl font-bold text-blue-600 mb-4 break-all">
                {displayData.currentlyServing}
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600 flex-wrap">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-lg sm:text-xl font-semibold text-center">Please proceed to counter</span>
              </div>
            </div>
          </Card>

          {/* Queue Statistics */}
          <div className="space-y-4 sm:space-y-6">
            <Card padding="md">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Waiting</h3>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                  {displayData.totalWaiting}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">customers in queue</p>
              </div>
            </Card>

            <Card padding="md">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Avg Wait</h3>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-green-600">
                  {displayData.averageWaitTime}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">minutes</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Next in Line */}
        {displayData.nextTokens.length > 0 && (
          <Card padding="lg" className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Next in Line</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayData.nextTokens.slice(0, 12).map((token, index) => (
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