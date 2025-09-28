// Header component with company logo

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <img 
                src="/Logo.jpg" 
                alt="Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-800">
                Queue Management System
              </span>
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}