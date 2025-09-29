import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import type { Customer, QueueStatus, OutletQueue, AnalyticsData } from '../types';
import { queueAPI, analyticsAPI } from '../utils/api';

interface QueueState {
  currentCustomer: Customer | null;
  queueStatus: QueueStatus | null;
  outletQueue: OutletQueue | null;
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
}

type QueueAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_CUSTOMER'; payload: Customer | null }
  | { type: 'SET_QUEUE_STATUS'; payload: QueueStatus | null }
  | { type: 'SET_OUTLET_QUEUE'; payload: OutletQueue | null }
  | { type: 'SET_ANALYTICS'; payload: AnalyticsData | null }
  | { type: 'UPDATE_QUEUE_POSITION'; payload: { position: number; estimatedWaitTime: number } };

const initialState: QueueState = {
  currentCustomer: null,
  queueStatus: null,
  outletQueue: null,
  analytics: null,
  isLoading: false,
  error: null,
};

function queueReducer(state: QueueState, action: QueueAction): QueueState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CURRENT_CUSTOMER':
      return { ...state, currentCustomer: action.payload };
    case 'SET_QUEUE_STATUS':
      return { ...state, queueStatus: action.payload };
    case 'SET_OUTLET_QUEUE':
      return { ...state, outletQueue: action.payload };
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    case 'UPDATE_QUEUE_POSITION':
      return {
        ...state,
        currentCustomer: state.currentCustomer ? {
          ...state.currentCustomer,
          queuePosition: action.payload.position,
          estimatedWaitTime: action.payload.estimatedWaitTime,
        } : null,
      };
    default:
      return state;
  }
}

interface QueueContextType extends QueueState {
  setCurrentCustomer: (customer: Customer | null) => void;
  fetchQueueStatus: (tokenId: string) => Promise<void>;
  fetchOutletQueue: (outletId: string) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  startRealTimeUpdates: (tokenId: string) => void;
  stopRealTimeUpdates: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

interface QueueProviderProps {
  children: ReactNode;
}

export function QueueProvider({ children }: QueueProviderProps) {
  const [state, dispatch] = useReducer(queueReducer, initialState);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const setCurrentCustomer = (customer: Customer | null) => {
    dispatch({ type: 'SET_CURRENT_CUSTOMER', payload: customer });
  };

  const fetchQueueStatus = useCallback(async (tokenId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await queueAPI.getStatus(tokenId);
      if (response.success && response.data) {
        dispatch({ type: 'SET_QUEUE_STATUS', payload: response.data });
      }
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch queue status' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchOutletQueue = useCallback(async (outletId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      console.log('[QueueContext] Fetching outlet queue for:', outletId);
      const response = await queueAPI.getOutletQueue(outletId);
      
      console.log('[QueueContext] Queue API Response:', response);
      console.log('[QueueContext] Raw API Data:', JSON.stringify(response.data, null, 2));
      
      if (response.success && response.data) {
        // Ensure the response data has all required fields with defaults
        const rawData = response.data as any; // Use any to access queueList
        const queueData = {
          outletId: rawData.outletId || outletId,
          currentlyServing: rawData.currentlyServing || '--',
          totalWaiting: typeof rawData.totalWaiting === 'number' ? rawData.totalWaiting : 0,
          averageWaitTime: typeof rawData.averageWaitTime === 'number' ? rawData.averageWaitTime : 0,
          nextTokens: Array.isArray(rawData.nextTokens) 
            ? rawData.nextTokens 
            : Array.isArray(rawData.queueList) 
              ? rawData.queueList.map((customer: any) => customer.tokenNumber)
              : [],
        };
        
        console.log('[QueueContext] Setting queue data:', queueData);
        dispatch({ type: 'SET_OUTLET_QUEUE', payload: queueData });
      } else {
        throw new Error(response.message || 'Invalid response format');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch outlet queue';
      console.error('[QueueContext] Queue fetch error:', errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      // Set fallback queue data to prevent UI crashes
      dispatch({ type: 'SET_OUTLET_QUEUE', payload: {
        outletId,
        currentlyServing: '--',
        totalWaiting: 0,
        averageWaitTime: 0,
        nextTokens: [],
      }});
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const outletId = import.meta.env.VITE_OUTLET_ID;
      const response = await analyticsAPI.getDashboard(outletId);
      if (response.success && response.data) {
        dispatch({ type: 'SET_ANALYTICS', payload: response.data });
      } else {
        console.error('Analytics API error:', response);
      }
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch analytics' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const startRealTimeUpdates = useCallback((tokenId: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetchQueueStatus(tokenId);
    }, 5000);
  }, [fetchQueueStatus]);

  const stopRealTimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const contextValue: QueueContextType = {
    ...state,
    setCurrentCustomer,
    fetchQueueStatus,
    fetchOutletQueue,
    fetchAnalytics,
    startRealTimeUpdates,
    stopRealTimeUpdates,
  };

  return (
    <QueueContext.Provider value={contextValue}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}