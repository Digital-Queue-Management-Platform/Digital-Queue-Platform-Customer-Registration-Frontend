import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export function OfficerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    officerId: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    officerId?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.officerId.trim()) {
      newErrors.officerId = 'Officer ID is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual authentication API call
      // For now, we'll simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - replace with real authentication logic
      if (formData.officerId === 'officer1' && formData.password === 'password') {
        // Store authentication token/data
        localStorage.setItem('officer_token', 'mock-token');
        localStorage.setItem('officer_data', JSON.stringify({
          id: 'officer1',
          name: 'John Perera',
          role: 'Customer Service Officer',
        }));
        
        // Redirect to officer dashboard
        navigate('/officer-dashboard');
      } else {
        setErrors({ general: 'Invalid Officer ID or Password' });
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCustomer = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Customer Portal */}
        <div className="mb-6">
          <button
            onClick={handleBackToCustomer}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back to Customer Portal</span>
          </button>
        </div>

        <Card padding="lg">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/Logo.jpg" 
                alt="Logo" 
                className="w-10 h-10 object-contain"
              />
              <h2 className="text-2xl font-bold text-gray-900">SLTMobitel</h2>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Service Officer Login</h3>
            <p className="text-gray-600">Sign in to access the queue management system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <Input
              label="Service Officer ID / Username"
              value={formData.officerId}
              onChange={(e) => handleInputChange('officerId', e.target.value)}
              error={errors.officerId}
              placeholder="Enter your Officer ID"
              required
              fullWidth
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder="Enter your Password"
              required
              fullWidth
            />

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
            >
              {isLoading ? 'Signing In...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Forgot Password?
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-xs text-gray-500">
              <p>© 2025 SLTMobitel. All rights reserved.</p>
              <p className="mt-1">For technical support, contact IT Department</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}