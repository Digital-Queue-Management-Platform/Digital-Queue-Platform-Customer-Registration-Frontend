import React from 'react';
import { QueueProvider } from './context/QueueContext';
import { RegistrationPage } from './pages/RegistrationPage';
import { QueueStatusBoardPage } from './pages/QueueStatusBoard';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';

function App() {
  // Simple routing based on URL path for demonstration
  // In a real app, you'd use React Router
  const path = window.location.pathname;

  const renderPage = () => {
    switch (path) {
      case '/queue-board':
        return <QueueStatusBoardPage />;
      case '/analytics':
        return <AnalyticsDashboard />;
      default:
        return <RegistrationPage />;
    }
  };

  return (
    <QueueProvider>
      <div className="App">
        {renderPage()}
      </div>
      
      {/* Navigation for demonstration */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Navigation</div>
        <div className="space-y-1">
          <a href="/" className="block text-blue-600 hover:text-blue-800 text-sm">
            Registration
          </a>
          <a href="/queue-board" className="block text-blue-600 hover:text-blue-800 text-sm">
            Queue Board
          </a>
          <a href="/analytics" className="block text-blue-600 hover:text-blue-800 text-sm">
            Analytics
          </a>
        </div>
      </div>
    </QueueProvider>
  );
}

export default App;