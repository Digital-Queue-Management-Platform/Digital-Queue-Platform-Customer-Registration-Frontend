import { ReactNode, useState, useEffect } from 'react';
import { Sidebar as ResponsiveSidebar } from './ResponsiveSidebar';
import { TopHeader } from './TopHeader';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentPath: string;
}

export const Layout = ({ children, title, subtitle, currentPath }: LayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ResponsiveSidebar currentPath={currentPath} />
      
      {/* Main Content Area */}
      <div className={`min-h-screen transition-all duration-300 ${
        isMobile ? 'ml-0' : 'ml-16 lg:ml-64'
      }`}>
        {/* Top Header */}
        <TopHeader title={title} subtitle={subtitle} />
        
        {/* Page Content */}
        <main className={`p-4 sm:p-6 ${isMobile ? 'pt-16' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};