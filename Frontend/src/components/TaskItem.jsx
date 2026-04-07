import React from 'react';

const TaskItem = ({ title, meta, status, color }) => {
  const colorStyles = {
    green: 'bg-emerald-900/30 text-emerald-400',
    yellow: 'bg-amber-900/30 text-amber-400',
    red: 'bg-red-900/30 text-red-400',
    gray: 'bg-gray-800 text-gray-400'
  };

  const bulletColors = {
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    red: 'bg-red-500',
    gray: 'bg-blue-500' // Using blue for unstarted based on Figma
  };

  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 ${bulletColors[color]}`}></div>
        <div>
          <h4 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{meta}</p>
        </div>
      </div>
      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${colorStyles[color]}`}>
        {status}
      </span>
    </div>
  );
};

export default TaskItem;