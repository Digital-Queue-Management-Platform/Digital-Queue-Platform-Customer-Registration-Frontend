// Main App component with professional layout
import { QueueProvider } from './context/QueueContext';
import { RegistrationPage } from './pages/RegistrationPage';
import { QueueStatusBoardPage } from './pages/QueueStatusBoard';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { Layout } from './components/layout/Layout';

function App() {
  // Simple routing based on URL path for demonstration
  // In a real app, you'd use React Router
  const path = window.location.pathname;

  const getPageInfo = () => {
    switch (path) {
      case '/queue-board':
        return {
          title: 'Queue Status Board',
          subtitle: 'Real-time queue monitoring and management',
          component: <QueueStatusBoardPage />
        };
      case '/analytics':
        return {
          title: 'Analytics Dashboard',
          subtitle: 'Performance metrics and insights',
          component: <AnalyticsDashboard />
        };
      default:
        return {
          title: 'Customer Registration',
          subtitle: 'New customer check-in and queue entry',
          component: <RegistrationPage />
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <QueueProvider>
      <Layout 
        title={pageInfo.title}
        subtitle={pageInfo.subtitle}
        currentPath={path}
      >
        {pageInfo.component}
      </Layout>
    </QueueProvider>
  );
}

export default App;