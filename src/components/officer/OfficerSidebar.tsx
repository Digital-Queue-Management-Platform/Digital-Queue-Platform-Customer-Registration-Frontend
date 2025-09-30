import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';

interface OfficerSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function OfficerSidebar({ isOpen, onToggle }: OfficerSidebarProps) {
  const location = useLocation();

  const navigationItems = [
    {
      path: '/officer-dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      isActive: location.pathname === '/officer-dashboard'
    },
    {
      path: '/officer/queue-management',
      name: 'Queue Management',
      icon: Users,
      isActive: location.pathname === '/officer/queue-management'
    },
    {
      path: '/officer/daily-summary',
      name: 'Daily Summary',
      icon: BarChart3,
      isActive: location.pathname === '/officer/daily-summary'
    },
    {
      path: '/officer/settings',
      name: 'Settings',
      icon: Settings,
      isActive: location.pathname === '/officer/settings'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 lg:w-64
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src="/Logo.jpg"
              alt="SLTMobitel Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SLTMobitel</h2>
              <p className="text-sm text-gray-600">Queue Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                    ${item.isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <IconComponent className={`w-5 h-5 ${
                    item.isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">SLTMobitel Digital Queue Management System</p>
            <p className="text-xs text-gray-500 mt-1">© 2025 SLTMobitel. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}