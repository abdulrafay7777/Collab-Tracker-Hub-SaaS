import React, { useState } from 'react';
import { FiCheckSquare, FiClock, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('My Tasks');
  const { currentUser } = useAuth(); 

  const navItems = [
    { name: 'My Tasks', icon: <FiCheckSquare className="w-4 h-4 mr-3" /> },
    { name: 'Work Sessions', icon: <FiClock className="w-4 h-4 mr-3" /> },
    { name: 'Progress Updates', icon: <FiActivity className="w-4 h-4 mr-3" /> },
    { name: 'Flag Delay', icon: <FiAlertCircle className="w-4 h-4 mr-3" /> },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    // UPDATED: Restored exact solid hex color and solid border extracted from Figma
    <aside className="w-64 bg-[#190e2d] border-r border-[#2a1b4d] flex flex-col justify-between h-full relative z-10">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-400 rounded flex items-center justify-center text-black font-bold">C</div>
          <span className="text-xl font-bold tracking-wide text-white">Collab<span className="text-emerald-400">Tracker</span></span>
        </div>
        
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</div>
        
        <nav className="mt-2 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
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

      {/* UPDATED: Matched the top border to the new solid theme */}
      <div className="p-4 border-t border-[#2a1b4d] flex items-center gap-3 hover:bg-white/5 cursor-pointer transition-colors">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${currentUser?.avatarColor || 'bg-indigo-900'}`}>
          {getInitials(currentUser?.name)}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-medium truncate w-full text-white">{currentUser?.name || 'Unknown User'}</div>
          <div className="text-xs text-gray-400 truncate w-full">{currentUser?.role || 'Member'}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;