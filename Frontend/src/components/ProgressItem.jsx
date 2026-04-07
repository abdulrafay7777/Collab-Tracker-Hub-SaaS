import React from 'react';
import { FaCheck, FaPlay, FaExclamation } from 'react-icons/fa';

const ProgressItem = ({ type, title, time }) => {
  const iconConfig = {
    success: { bg: 'bg-emerald-900/30', color: 'text-emerald-500', icon: <FaCheck /> },
    play: { bg: 'bg-blue-900/30', color: 'text-blue-500', icon: <FaPlay /> },
    warning: { bg: 'bg-amber-900/30', color: 'text-amber-500', icon: <FaExclamation /> },
  };

  const current = iconConfig[type];

  return (
    <div className="flex items-start gap-4 relative">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${current.bg} ${current.color}`}>
        {React.cloneElement(current.icon, { size: 16 })}
      </div>
      <div>
        <p className="text-sm text-gray-300">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default ProgressItem;