import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface OfficerProtectedRouteProps {
  children: React.ReactNode;
}

export function OfficerProtectedRoute({ children }: OfficerProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('officer_token');
      const officerData = localStorage.getItem('officer_data');
      
      // Check if both token and officer data exist
      if (token && officerData) {
        try {
          // Validate that officer data is valid JSON
          JSON.parse(officerData);
          setIsAuthenticated(true);
        } catch (error) {
          // Invalid officer data, clear storage and redirect
          localStorage.removeItem('officer_token');
          localStorage.removeItem('officer_data');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/officer-login" replace />;
  }

  // Render protected content
  return <>{children}</>;
}