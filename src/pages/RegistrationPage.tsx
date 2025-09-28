import { useState } from 'react';
import { RegistrationForm } from '../components/registration/RegistrationForm';
import { TokenDisplay } from '../components/registration/TokenDisplay';
import type { Customer } from '../types';

export function RegistrationPage() {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const handleRegistrationSuccess = (customer: Customer) => {
    setCurrentCustomer(customer);
  };

  const handleBack = () => {
    setCurrentCustomer(null);
  };

  return (
    <div className="space-y-6">
      {currentCustomer ? (
        <TokenDisplay customer={currentCustomer} onBack={handleBack} />
      ) : (
        <RegistrationForm onSuccess={handleRegistrationSuccess} />
      )}
    </div>
  );
}