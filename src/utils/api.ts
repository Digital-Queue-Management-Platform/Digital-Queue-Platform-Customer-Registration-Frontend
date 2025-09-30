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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds
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
    // Better error handling for connection issues
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('API Error: Connection timeout - Backend server may be down');
      const errorMessage = 'Backend server is not responding. Please check if the server is running on port 5001.';
      return Promise.reject(new Error(errorMessage));
    }
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      console.error('API Error: Connection refused - Backend server is not running');
      const errorMessage = 'Cannot connect to backend server. Please start the backend server.';
      return Promise.reject(new Error(errorMessage));
    }
    
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

  // Get all tokens for a customer by phone number
  getCustomerTokens: async (phoneNumber: string): Promise<ApiResponse<Customer[]>> => {
    return apiClient.get(`/customer/tokens/${phoneNumber}`);
  },

  // Get all tokens for a customer by customer ID
  getCustomerTokensById: async (customerId: string): Promise<ApiResponse<Customer[]>> => {
    return apiClient.get(`/customer/${customerId}/tokens`);
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