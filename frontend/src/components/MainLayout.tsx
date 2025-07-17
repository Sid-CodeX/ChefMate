
import React from 'react';
import Sidebar from './Sidebar';
import ProfileDropdown from './ProfileDropdown';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#1f2636]">
      {/* Global Top Navigation */}
      <nav className="bg-[#242c3c] border-b border-gray-700 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">ChefMate</h1>
          </div>
          
          {/* Profile Dropdown in top-right */}
          <ProfileDropdown />
        </div>
      </nav>

      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
