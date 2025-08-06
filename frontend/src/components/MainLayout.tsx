import React from 'react';
import Sidebar from './Sidebar';
import ProfileDropdown from './ProfileDropdown';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    // Set the main container to be a flex column that fills the entire viewport height
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#1f2636]">
      {/* Top Navigation remains fixed at the top */}
      <nav className="bg-[#242c3c] border-b border-gray-700 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">ChefMate</h1>
          </div>
          <ProfileDropdown />
        </div>
      </nav>

      {/* This flex container now holds the sidebar and the main content area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* The main content area is now a flex item that fills the remaining space */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;