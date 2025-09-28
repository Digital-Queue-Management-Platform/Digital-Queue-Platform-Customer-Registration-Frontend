import React, { useState } from 'react';
import { Header } from '../components/common/Header';
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Queue Management System" 
        subtitle="Customer Registration Portal"
      />
      
      <main className="py-8 px-4">
        {currentCustomer ? (
          <TokenDisplay customer={currentCustomer} onBack={handleBack} />
        ) : (
          <RegistrationForm onSuccess={handleRegistrationSuccess} />
        )}
      </main>
    </div>
  );
}