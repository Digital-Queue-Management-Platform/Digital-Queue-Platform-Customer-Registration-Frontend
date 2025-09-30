// Main App component with React Router
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import { RegistrationPage } from './pages/RegistrationPage';
import { QueueStatusBoardPage } from './pages/QueueStatusBoard';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { OfficerLogin } from './pages/OfficerLogin';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { OfficerQueueManagement } from './pages/OfficerQueueManagement';
import { OfficerSettings } from './pages/OfficerSettings';
import { Layout } from './components/layout/Layout';
import { OfficerProtectedRoute } from './components/officer/OfficerProtectedRoute';

// Component to handle page info based on current route
function AppContent() {
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/queue-board':
        return {
          title: 'Queue Status Board',
          subtitle: 'Real-time queue monitoring and management'
        };
      case '/analytics':
        return {
          title: 'Analytics Dashboard',
          subtitle: 'Performance metrics and insights'
        };
      case '/officer-login':
        return {
          title: 'Officer Login',
          subtitle: 'Service officer authentication'
        };
      case '/officer-dashboard':
        return {
          title: 'Officer Dashboard',
          subtitle: 'Queue management and customer service'
        };
      default:
        return {
          title: 'Customer Registration',
          subtitle: 'New customer check-in and queue entry'
        };
    }
  };

  const pageInfo = getPageInfo();

  // Officer pages don't need the main customer layout
  if (location.pathname.startsWith('/officer')) {
    return (
      <Routes>
        <Route path="/officer-login" element={<OfficerLogin />} />
        <Route path="/officer-dashboard" element={
          <OfficerProtectedRoute>
            <OfficerDashboard />
          </OfficerProtectedRoute>
        } />
        <Route path="/officer/queue-management" element={
          <OfficerProtectedRoute>
            <OfficerQueueManagement />
          </OfficerProtectedRoute>
        } />
        <Route path="/officer/settings" element={
          <OfficerProtectedRoute>
            <OfficerSettings />
          </OfficerProtectedRoute>
        } />
      </Routes>
    );
  }

  return (
    <Layout 
      title={pageInfo.title}
      subtitle={pageInfo.subtitle}
      currentPath={location.pathname}
    >
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/queue-board" element={<QueueStatusBoardPage />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueueProvider>
      <Router>
        <AppContent />
      </Router>
    </QueueProvider>
  );
}

export default App;