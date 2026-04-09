import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiTrendingUp, FiMessageSquare, FiHash, FiClock, FiActivity } from 'react-icons/fi';

const ProgressFeed = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/workspace/dashboard');
        // We use progressLogs or a specific updates array from our dashboard controller
        setUpdates(response.data.data.progressLogs || []); 
      } catch (error) {
        console.error("Error fetching progress updates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-emerald-400 animate-pulse">
      Syncing project pulse...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b border-[#2a1b4d] pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Progress Feed</h2>
          <p className="text-gray-400 mt-1 text-sm italic font-light">"The Standup Replacement"</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
           <FiActivity className="text-indigo-400 animate-pulse" />
           <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Live Activity</span>
        </div>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-[#2a1b4d] before:via-emerald-500/20 before:to-transparent">
        
        {updates.length > 0 ? updates.map((update, index) => (
          <div key={update._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12">
            
            {/* Timeline Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#2a1b4d] bg-[#0a0514] text-emerald-400 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all group-hover:border-emerald-500 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              <FiTrendingUp className="w-5 h-5" />
            </div>

            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[45%] bg-[#11081f] p-6 rounded-2xl border border-[#2a1b4d] shadow-2xl hover:border-emerald-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                  <FiClock className="text-indigo-400" />
                  {new Date(update.createdAt).toLocaleDateString()} — {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {/* Visual percentage badge */}
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-md border border-emerald-500/20">
                  +{update.completionPercentage || 0}% Done
                </span>
              </div>
              
              <div className="text-gray-300 text-sm leading-relaxed mb-4 flex gap-3">
                <FiMessageSquare className="shrink-0 mt-1 text-indigo-500 w-4 h-4" />
                <p className="italic">"{update.title || update.content}"</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <FiHash className="text-indigo-500" />
                  {update.taskId?.substring(0, 8) || 'SYSTEM_LOG'}
                </div>
                <button className="text-[10px] text-indigo-400 hover:text-white transition-colors">VIEW TASK</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-[#11081f]/30 border border-dashed border-[#2a1b4d] rounded-2xl">
            <FiMessageSquare className="mx-auto w-12 h-12 text-gray-700 mb-4" />
            <p className="text-gray-500 text-sm">No updates posted yet. Finish a session to post your first standup!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressFeed;