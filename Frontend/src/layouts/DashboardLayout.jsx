import React from 'react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    // Fallback to dark space-black, then apply the inline gradient directly
    <div className="flex h-screen text-white font-sans overflow-hidden bg-[#0a0514] bg-[radial-gradient(circle_at_10%_10%,#26124b_0%,#150a2e_40%,#0a0514_100%)]">
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar has been completely removed from here */}
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;