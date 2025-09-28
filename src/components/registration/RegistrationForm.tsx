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
  phoneNumber: string;
  nicPassport: string;
  serviceType: string;
}

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  nicPassport?: string;
  serviceType?: string;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const { setCurrentCustomer } = useQueue();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    nicPassport: '',
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
      'General Inquiry': 5,
      'Account Services': 15,
      'Card Services': 10,
      'Loan Applications': 30,
      'Money Transfer': 8
    };
    return timeMap[serviceName] || 10;
  };

  const getDefaultServiceTypes = () => [
    { id: 'general-inquiry', name: 'General Inquiry', estimatedTime: 5, category: 'Information' },
    { id: 'account-services', name: 'Account Services', estimatedTime: 15, category: 'Banking' },
    { id: 'card-services', name: 'Card Services', estimatedTime: 10, category: 'Cards' },
    { id: 'loan-applications', name: 'Loan Applications', estimatedTime: 30, category: 'Lending' },
    { id: 'money-transfer', name: 'Money Transfer', estimatedTime: 8, category: 'Transfers' },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^0\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid phone number (0XXXXXXXXX)';
    }

    if (!formData.nicPassport.trim()) {
      newErrors.nicPassport = 'NIC/Passport is required';
    } else if (!/^(\d{9}[vVxX]|\d{12})$/.test(formData.nicPassport.replace(/\s/g, ''))) {
      newErrors.nicPassport = 'Enter a valid NIC or Passport number';
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
      const response = await customerAPI.register({
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        nicPassport: formData.nicPassport.trim(),
        serviceType: formData.serviceType,
        outletId: 'outlet-001', // <-- Add this line
      } as any); // Type cast to allow outletId

      if (response.success && response.data) {
        setCurrentCustomer(response.data);
        onSuccess(response.data);
      } else {
        setErrors({ serviceType: response.message || 'Registration failed' });
      }
    } catch (error: any) {
      setErrors({ serviceType: error.message || 'Registration failed. Please try again.' });
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
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            error={errors.phoneNumber}
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