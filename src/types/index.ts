export interface Customer {
  id: string;
  name: string;
  phoneNumber: string; // Mobile number (primary contact)
  telephoneNumber?: string;
  nicPassport?: string;
  email?: string;
  serviceType: string;
  tokenNumber: string;
  queuePosition: number;
  estimatedWaitTime: number;
  status: 'waiting' | 'being_served' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface QueueStatus {
  tokenId: string;
  position: number;
  estimatedWaitTime: number;
  currentlyServing: string;
  nextInLine: string[];
  totalInQueue: number;
}

export interface OutletQueue {
  outletId: string;
  currentlyServing: string;
  nextTokens: string[];
  totalWaiting: number;
  averageWaitTime: number;
}

export interface AnalyticsData {
  averageWaitTime: number;
  totalCustomersToday: number;
  completedServices: number;
  peakHours: { hour: number; count: number }[];
  serviceTypeBreakdown: { type: string; count: number }[];
}

export interface OfficerPerformance {
  officerId: string;
  name: string;
  customersServed: number;
  averageServiceTime: number;
  efficiency: number;
}

export interface WaitTimeData {
  time: string;
  waitTime: number;
  queueLength: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  estimatedTime: number;
  category: string;
}