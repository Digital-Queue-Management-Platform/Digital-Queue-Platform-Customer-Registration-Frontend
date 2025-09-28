import axios from 'axios';
import type { 
  Customer, 
  QueueStatus, 
  OutletQueue, 
  AnalyticsData, 
  OfficerPerformance, 
  WaitTimeData, 
  ApiResponse,
  ServiceType 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export const customerAPI = {
  register: async (customerData: Omit<Customer, 'id' | 'tokenNumber' | 'queuePosition' | 'estimatedWaitTime' | 'status' | 'createdAt'>): Promise<ApiResponse<Customer>> => {
    return apiClient.post('/customer/register', customerData);
  },

  getQRCode: async (outletId: string): Promise<ApiResponse<{ qrCode: string }>> => {
    return apiClient.get(`/outlet/${outletId}/qr`);
  },

  getCustomerStatus: async (tokenId: string): Promise<ApiResponse<Customer>> => {
    return apiClient.get(`/customer/status/${tokenId}`);
  },
};

export const queueAPI = {
  getStatus: async (tokenId: string): Promise<ApiResponse<QueueStatus>> => {
    return apiClient.get(`/queue/status/${tokenId}`);
  },

  getOutletQueue: async (outletId: string): Promise<ApiResponse<OutletQueue>> => {
    return apiClient.get(`/queue/outlet/${outletId}`);
  },

  updateStatus: async (tokenId: string, status: Customer['status']): Promise<ApiResponse<void>> => {
    return apiClient.put(`/queue/update/${tokenId}`, { status });
  },
};

export const analyticsAPI = {
  getDashboard: async (): Promise<ApiResponse<AnalyticsData>> => {
    return apiClient.get('/analytics/dashboard');
  },

  getWaitTimes: async (period: string = '24h'): Promise<ApiResponse<WaitTimeData[]>> => {
    return apiClient.get(`/analytics/wait-times?period=${period}`);
  },

  getOfficerPerformance: async (): Promise<ApiResponse<OfficerPerformance[]>> => {
    return apiClient.get('/analytics/officer-performance');
  },
};

export const serviceAPI = {
  getServiceTypes: async (): Promise<ApiResponse<ServiceType[]>> => {
    return apiClient.get('/services/types');
  },
};

export default apiClient;