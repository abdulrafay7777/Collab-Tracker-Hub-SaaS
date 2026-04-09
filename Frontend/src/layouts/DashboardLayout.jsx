import React from 'react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children, activeTab, onNavigateTab }) => {
  // DEBUG LOG: If this says 'undefined', the problem is in App.jsx
  console.log("1. LAYOUT received function:", typeof onNavigateTab);

  return (
    <div className="flex h-screen text-white font-sans overflow-hidden bg-[#0a0514] bg-[radial-gradient(circle_at_10%_10%,#26124b_0%,#150a2e_40%,#0a0514_100%)]">
      
      {/* Pass the prop down to Sidebar */}
      <Sidebar activeTab={activeTab} onNavigateTab={onNavigateTab} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;