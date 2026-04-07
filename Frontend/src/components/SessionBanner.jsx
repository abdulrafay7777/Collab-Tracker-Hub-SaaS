import React from 'react';
import { FiPlay, FiSquare } from 'react-icons/fi';

const SessionBanner = ({ isTracking, secondsElapsed, onToggle, isToggling }) => {
  // Formats the raw seconds passed down from Workspace into 00:00:00
  const formatTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds < 0) return "00:00:00";
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="bg-[#110c1c]/60 border border-gray-800/80 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between backdrop-blur-md shadow-lg">
      <div>
        <div className="flex items-center gap-4 mb-1">
          {/* Ticking Timer */}
          <span className={`text-4xl font-mono font-bold tracking-wider ${isTracking ? 'text-emerald-400' : 'text-gray-500'}`}>
            {formatTime(secondsElapsed)}
          </span>
          {/* Task Title from Figma */}
          <span className="text-lg font-medium text-white tracking-wide">
            Fix login redirect bug — Sprint 4
          </span>
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {isTracking ? 'Session in progress...' : 'Session not started'} 
          <span className="mx-3 opacity-40">|</span> 
          Assigned by: Kamran M. 
          <span className="mx-3 opacity-40">|</span> 
          Due: Tomorrow
        </div>
      </div>
      
      {/* Start/Stop Button */}
      <button 
        onClick={onToggle}
        disabled={isToggling}
        className={`mt-4 md:mt-0 px-6 py-2.5 font-semibold rounded-lg flex items-center gap-2 transition-all duration-200 ${
          isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
        } ${
          isTracking 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
            : 'bg-emerald-400 hover:bg-emerald-500 text-black shadow-[0_0_15px_rgba(52,211,153,0.2)]'
        }`}
      >
        {isTracking ? <FiSquare className="w-4 h-4 fill-current" /> : <FiPlay className="w-4 h-4 fill-current" />}
        {isTracking ? 'Stop Session' : 'Start Session'}
      </button>
    </div>
  );
};

export default SessionBanner;