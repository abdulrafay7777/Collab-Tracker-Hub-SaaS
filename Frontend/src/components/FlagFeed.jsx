import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiAlertTriangle, FiClock, FiUser, FiArrowRight } from 'react-icons/fi';

const FlagFeed = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        // Using the same dashboard endpoint which should return our logs/flags
        const response = await axios.get('http://localhost:5000/api/v1/workspace/dashboard');
        // If your backend doesn't return flags specifically yet, we'll fetch them here
        // For now, let's assume we might need a specific route or filter progressLogs
        setFlags(response.data.data.flags || []); 
      } catch (error) {
        console.error("Error fetching flags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlags();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-400">Checking for blockers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Blockers & Delays</h2>
          <p className="text-gray-400 text-sm">Active issues requiring attention</p>
        </div>
        <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-bold animate-pulse">
          {flags.length} ACTIVE FLAGS
        </div>
      </div>

      <div className="grid gap-4">
        {flags.length > 0 ? flags.map((flag) => (
          <div key={flag._id} className="bg-[#11081f] border border-red-500/30 rounded-xl p-5 hover:border-red-500/60 transition-all shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  <FiAlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{flag.reasonCategory}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <FiUser className="inline" /> Assigned to you
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                flag.severityLevel === 'High/Blocker' ? 'bg-red-500 text-white' : 'bg-orange-500/20 text-orange-500'
              }`}>
                {flag.severityLevel}
              </span>
            </div>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed italic">
              "{flag.explanation}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <FiClock /> Raised {new Date(flag.createdAt).toLocaleDateString()}
              </div>
              {flag.proposedNewETA && (
                <div className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  New ETA: {new Date(flag.proposedNewETA).toLocaleDateString()} <FiArrowRight />
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="bg-[#11081f]/30 border border-[#2a1b4d] rounded-xl p-20 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
              <FiAlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-white font-medium">Clear Skies!</h3>
            <p className="text-gray-500 text-sm">No active blockers or delays reported.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlagFeed;