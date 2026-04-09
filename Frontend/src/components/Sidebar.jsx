import React from 'react';
import { FiCheckSquare, FiClock, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// Ensure the name here is onNavigateTab
const Sidebar = ({ activeTab, onNavigateTab }) => {
  const auth = useAuth();
  const currentUser = auth?.currentUser || { name: 'Abdulrafay', role: 'Dev' };

  // DEBUG LOG: If this says 'undefined', the problem is in DashboardLayout.jsx
  console.log("2. SIDEBAR received function:", typeof onNavigateTab);

  const navItems = [
    { name: 'My Tasks', icon: <FiCheckSquare className="w-4 h-4 mr-3" /> },
    { name: 'Work Sessions', icon: <FiClock className="w-4 h-4 mr-3" /> },
    { name: 'Progress Updates', icon: <FiActivity className="w-4 h-4 mr-3" /> },
    { name: 'Flag Delay', icon: <FiAlertCircle className="w-4 h-4 mr-3" /> },
  ];

  return (
    <aside className="w-64 bg-[#190e2d] border-r border-[#2a1b4d] flex flex-col justify-between h-full relative z-10">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-400 rounded flex items-center justify-center text-black font-bold">C</div>
          <span className="text-xl font-bold tracking-wide text-white">Collab<span className="text-emerald-400">Tracker</span></span>
        </div>
        
        <nav className="mt-2 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              // The error happens here because onNavigateTab is undefined
              onClick={() => onNavigateTab && onNavigateTab(item.name)} 
              className={`w-full flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${
                activeTab === item.name 
                  ? 'bg-white/10 text-emerald-400 border-l-2 border-emerald-400' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;