// Main App component with React Router
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import { RegistrationPage } from './pages/RegistrationPage';
import { QueueStatusBoardPage } from './pages/QueueStatusBoard';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { Layout } from './components/layout/Layout';

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
      default:
        return {
          title: 'Customer Registration',
          subtitle: 'New customer check-in and queue entry'
        };
    }
  };

  const pageInfo = getPageInfo();

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