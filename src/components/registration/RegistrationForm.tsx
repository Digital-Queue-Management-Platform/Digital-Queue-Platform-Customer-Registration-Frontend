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

  const loadServiceTypes = async () => {
    try {
      const response = await serviceAPI.getServiceTypes();
      if (response.success && response.data) {
        setServiceTypes(response.data);
      }
    } catch (error) {
      console.error('Failed to load service types:', error);
      // Fallback service types
      setServiceTypes([
        { id: '1', name: 'New Connection', estimatedTime: 15, category: 'Connection' },
        { id: '2', name: 'Bill Payment', estimatedTime: 5, category: 'Payment' },
        { id: '3', name: 'Technical Support', estimatedTime: 20, category: 'Support' },
        { id: '4', name: 'Account Update', estimatedTime: 10, category: 'Account' },
        { id: '5', name: 'Package Change', estimatedTime: 8, category: 'Service' },
      ]);
    }
  };

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
      });

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
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Registration</h2>
        <p className="text-gray-600">Please fill in your details to join the queue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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