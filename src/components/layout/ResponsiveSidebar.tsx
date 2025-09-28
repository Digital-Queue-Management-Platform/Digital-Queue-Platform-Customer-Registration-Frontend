import { useState, useEffect } from 'react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar = ({ currentPath }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const navigationItems = [
    {
      path: '/',
      name: 'Registration',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      path: '/queue-board',
      name: 'Queue Board',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      path: '/analytics',
      name: 'Analytics',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-lg transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50
          ${isMobile 
            ? `${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
            : `${isCollapsed ? 'w-16' : 'w-64'}`
          }
        `}
      >
        {/* Logo and Toggle */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between h-12">
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <img
                  src="/Logo.jpg"
                  alt="Logo"
                  className="w-8 h-8 object-contain flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold truncate leading-tight">Queue System</h2>
                  <p className="text-xs text-slate-400 truncate leading-tight">Management Platform</p>
                </div>
              </div>
            )}
            
            {isCollapsed && !isMobile && (
              <div className="flex justify-center items-center w-full h-full">
                <img
                  src="/Logo.jpg"
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
            )}
            
            {!isMobile && !isCollapsed && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 hover:bg-slate-800 rounded-md transition-colors flex-shrink-0 flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Expand Button for Collapsed State */}
        {isCollapsed && !isMobile && (
          <div className="p-4 border-b border-slate-700">
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full p-2 hover:bg-slate-800 rounded-md transition-colors flex items-center justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={handleNavClick}
                className={`
                  relative flex items-center rounded-lg transition-all duration-200 group min-w-0
                  ${isCollapsed && !isMobile 
                    ? 'px-3 py-3 justify-center' 
                    : 'px-3 py-3'
                  }
                  ${currentPath === item.path
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <div className={`flex-shrink-0 flex items-center justify-center ${
                  currentPath === item.path 
                    ? 'text-white' 
                    : 'text-slate-400 group-hover:text-white'
                }`}>
                  {item.icon}
                </div>
                {(!isCollapsed || isMobile) && (
                  <span className="font-medium ml-3 truncate flex items-center">{item.name}</span>
                )}
                
                {/* Tooltip for collapsed desktop mode */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-600">
                    {item.name}
                  </div>
                )}
              </a>
            ))}
          </div>
        </nav>

        {/* Footer */}
        {(!isCollapsed || isMobile) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
            <div className="text-xs text-slate-400 text-center">
              <p>© 2025 Queue Management</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};