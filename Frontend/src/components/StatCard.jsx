import React from 'react';

const StatCard = ({ title, value, sub, type }) => {
  const colorMap = {
    blue: { bar: 'bg-blue-600', badge: 'bg-blue-900/30 text-blue-400' },
    green: { bar: 'bg-emerald-500', badge: 'bg-emerald-900/30 text-emerald-400' },
    yellow: { bar: 'bg-amber-500', badge: 'bg-amber-900/30 text-amber-400' },
    red: { bar: 'bg-red-500', badge: 'bg-red-900/30 text-red-400' },
  };

  const colors = colorMap[type];

  return (
    <div className="bg-[#110c1c]/80 border border-gray-800 rounded-xl p-5 flex flex-col justify-between backdrop-blur-sm">
      <div className={`w-1/3 h-1 rounded-full mb-3 ${colors.bar}`}></div>
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
      <div className="">{value}</div>
      <div className="mt-3 flex">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
          {sub}
        </span>
      </div>
    </div>
  );
};

export default StatCard;