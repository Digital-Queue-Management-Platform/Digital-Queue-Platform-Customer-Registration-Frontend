import { ReactNode, useState, useEffect } from 'react';
import { OfficerSidebar } from './OfficerSidebar';
import { OfficerTopHeader } from './OfficerTopHeader';

interface OfficerLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function OfficerLayout({ children, title, subtitle }: OfficerLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Officer Sidebar */}
      <OfficerSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content Area */}
      <div className={`min-h-screen transition-all duration-300 ${
        isMobile ? 'ml-0' : 'ml-64'
      }`}>
        {/* Officer Top Header */}
        <OfficerTopHeader 
          title={title} 
          subtitle={subtitle} 
          onMenuClick={toggleSidebar}
          isMobile={isMobile}
        />
        
        {/* Page Content */}
        <main className={`p-4 sm:p-6 ${isMobile ? 'pt-20' : 'pt-4'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}