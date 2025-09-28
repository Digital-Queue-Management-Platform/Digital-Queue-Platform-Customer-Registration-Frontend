

interface SidebarProps {
  currentPath: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ currentPath, isCollapsed, onToggle }: SidebarProps) => {

  const navigationItems = [
    {
      path: '/',
      name: 'Registration',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      path: '/queue-board',
      name: 'Queue Board',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      path: '/analytics',
      name: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo and Toggle */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img
                src="/Logo.jpg"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <div>
                <h2 className="text-lg font-semibold">Queue System</h2>
                <p className="text-xs text-slate-400">Management Platform</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <img
                src="/Logo.jpg"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-slate-800 rounded-md transition-colors ml-2"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
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
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                currentPath === item.path
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`${currentPath === item.path ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </a>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 text-center">
            <p>© 2025 Queue Management</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
};