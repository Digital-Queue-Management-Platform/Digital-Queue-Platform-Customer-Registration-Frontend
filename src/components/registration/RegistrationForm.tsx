import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { customerAPI, serviceAPI } from '../../utils/api';
import type { Customer, ServiceType } from '../../types';
import { useQueue } from '../../context/QueueContext';

interface RegistrationFormProps {
  onSuccess: (customer: Customer) => void;
}

interface FormData {
  name: string;
  telephoneNumber: string;
  mobileNumber: string;
  nicPassport: string;
  email: string;
  serviceType: string;
}

interface FormErrors {
  name?: string;
  telephoneNumber?: string;
  mobileNumber?: string;
  nicPassport?: string;
  email?: string;
  serviceType?: string;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const { setCurrentCustomer } = useQueue();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    telephoneNumber: '',
    mobileNumber: '',
    nicPassport: '',
    email: '',
    serviceType: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  useEffect(() => {
    loadServiceTypes();
  }, []);

  useEffect(() => {
    if (isLoading) {
      console.log('[RegistrationForm] Registering customer:', formData);
    }
  }, [isLoading]);

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      console.error('[RegistrationForm] Registration errors:', errors);
    }
  }, [errors]);

  const loadServiceTypes = async () => {
    try {
      console.log('Loading service types from API...');
      const response = await serviceAPI.getServiceTypes();
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        console.log('Service types loaded:', response.data);
        
        // Transform the API data to ensure estimatedTime is present
        const transformedServices = response.data.map((service: any) => ({
          id: service.id,
          name: service.name,
          estimatedTime: service.estimatedTime || 
                        (service.estimatedDuration ? Math.round(service.estimatedDuration / 60) : getDefaultTime(service.name)),
          category: service.category
        }));
        
        setServiceTypes(transformedServices);
      } else {
        console.warn('API response was not successful or data is missing');
        // Use fallback services
        setServiceTypes(getDefaultServiceTypes());
      }
    } catch (error) {
      console.error('Failed to load service types:', error);
      // Fallback service types matching what the API should return
      setServiceTypes(getDefaultServiceTypes());
    }
  };

  const getDefaultTime = (serviceName: string): number => {
    const timeMap: { [key: string]: number } = {
      'Bill Payments': 8,
      'Technical Support & Troubleshooting': 15,
      'Service Disconnections/Reconnections': 12,
      'International Roaming Services': 10,
      'New Connections': 20,
      'Device Issues/Repairs': 15,
      'Complaint Resolution': 18,
      'Corporate Account Management': 25,
      'Plan Changes/Upgrades': 9,
      'Account Management': 12,
      'Document Submission/Verification': 6
    };
    return timeMap[serviceName] || 12;
  };

  const getDefaultServiceTypes = () => [
    { id: 'bill-payments', name: 'Bill Payments', estimatedTime: 8, category: 'Billing' },
    { id: 'technical-support', name: 'Technical Support & Troubleshooting', estimatedTime: 15, category: 'Support' },
    { id: 'service-disconnections', name: 'Service Disconnections/Reconnections', estimatedTime: 12, category: 'Service Management' },
    { id: 'international-roaming', name: 'International Roaming Services', estimatedTime: 10, category: 'International Services' },
    { id: 'new-connections', name: 'New Connections', estimatedTime: 20, category: 'Registration' },
    { id: 'device-issues', name: 'Device Issues/Repairs', estimatedTime: 15, category: 'Device Support' },
    { id: 'complaint-resolution', name: 'Complaint Resolution', estimatedTime: 18, category: 'Customer Service' },
    { id: 'corporate-account', name: 'Corporate Account Management', estimatedTime: 25, category: 'Corporate Services' },
    { id: 'plan-changes', name: 'Plan Changes/Upgrades', estimatedTime: 9, category: 'Plan Management' },
    { id: 'account-management', name: 'Account Management', estimatedTime: 12, category: 'Account Services' },
    { id: 'document-submission', name: 'Document Submission/Verification', estimatedTime: 6, category: 'Documentation' },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate telephone number (optional)
    if (formData.telephoneNumber.trim() && !/^0\d{9}$/.test(formData.telephoneNumber)) {
      newErrors.telephoneNumber = 'Enter a valid telephone number (0XXXXXXXXX)';
    }

    // Validate mobile number (required)
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^07\d{8}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Enter a valid mobile number (07XXXXXXXX)';
    }

    if (!formData.nicPassport.trim()) {
      newErrors.nicPassport = 'NIC/Passport is required';
    } else if (!/^(\d{9}[vVxX]|\d{12})$/.test(formData.nicPassport.replace(/\s/g, ''))) {
      newErrors.nicPassport = 'Enter a valid NIC or Passport number';
    }

    // Validate email (optional)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const outletId = import.meta.env.VITE_OUTLET_ID;
      console.log('[RegistrationForm] Using outlet ID:', outletId);
      
      const response = await customerAPI.register({
        name: formData.name.trim(),
        phoneNumber: formData.mobileNumber.trim(), // Use mobile number as primary phone
        telephoneNumber: formData.telephoneNumber.trim(),
        email: formData.email.trim(),
        nicPassport: formData.nicPassport.trim(),
        serviceType: formData.serviceType,
        outletId: outletId,
      } as any);

      if (response.success && response.data) {
        console.log('[RegistrationForm] API Response data:', response.data);
        const responseData = response.data as any;
        const customerData = responseData.customer || response.data;
        console.log('[RegistrationForm] Customer data being passed:', customerData);
        setCurrentCustomer(customerData);
        onSuccess(customerData);
      } else {
        // Handle duplicate registration error specifically
        if (response.message && response.message.includes('already registered today')) {
          const responseData = response.data as any;
          const existingToken = responseData?.existingToken;
          const message = existingToken 
            ? `You're already registered today! Your token number is: ${existingToken}`
            : 'You have already registered today. Please check your existing token.';
          setErrors({ serviceType: message });
        } else {
          setErrors({ serviceType: response.message || 'Registration failed' });
        }
      }
    } catch (error: any) {
      console.error('[RegistrationForm] Registration error:', error);
      
      // Check if it's a duplicate registration error from the API
      if (error.response?.data?.message?.includes('already registered today')) {
        const existingToken = error.response.data.data?.existingToken;
        const message = existingToken 
          ? `You're already registered today! Your token number is: ${existingToken}`
          : 'You have already registered today. Please check your existing token.';
        setErrors({ serviceType: message });
      } else {
        setErrors({ serviceType: error.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const serviceOptions = serviceTypes.map(service => ({
    value: service.id,
    label: `${service.name} (~${service.estimatedTime} min)`,
  }));

  return (
    <Card className="w-full max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <img 
            src="/Logo.jpg" 
            alt="Logo" 
            className="w-8 h-8 object-contain"
          />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Registration</h2>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Please fill in your details to join the queue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="Enter your full name"
            required
            fullWidth
          />

          <Input
            label="Telephone Number"
            value={formData.telephoneNumber}
            onChange={(e) => handleInputChange('telephoneNumber', e.target.value)}
            error={errors.telephoneNumber}
            placeholder="0112345678 (Optional)"
            fullWidth
          />

          <Input
            label="Mobile Number"
            value={formData.mobileNumber}
            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
            error={errors.mobileNumber}
            placeholder="0771234567"
            required
            fullWidth
          />

          <Input
            label="NIC/Passport Number"
            value={formData.nicPassport}
            onChange={(e) => handleInputChange('nicPassport', e.target.value)}
            error={errors.nicPassport}
            placeholder="971234567V or 199712345678"
            required
            fullWidth
          />

          <Input
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="example@email.com (Optional)"
            type="email"
            fullWidth
          />

          <Select
            label="Service Type"
            value={formData.serviceType}
            onChange={(e) => handleInputChange('serviceType', e.target.value)}
            options={serviceOptions}
            error={errors.serviceType}
            required
            fullWidth
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          fullWidth
          size="lg"
          className="mt-6"
        >
          {isLoading ? 'Registering...' : 'Register & Join Queue'}
        </Button>
      </form>
    </Card>
  );
}