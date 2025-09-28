import React from 'react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'gray';
  className?: string;
}

export function LoadingSpinner({ size = 'md', color = 'blue', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    gray: 'text-gray-600',
  };

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}