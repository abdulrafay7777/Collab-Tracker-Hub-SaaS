import React from 'react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children, activeTab, onNavigateTab }) => {
  return (
    <div className="flex h-screen text-white bg-[#0a0514]">
      {/* Ensure these names match EXACTLY what App.jsx is sending */}
      <Sidebar activeTab={activeTab} onNavigateTab={onNavigateTab} />
      
      <div className="flex-1 overflow-hidden relative">
        <main className="h-full overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;