import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiClock, FiCalendar, FiCheckCircle } from 'react-icons/fi';

const WorkSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/workspace/dashboard');
        // Our dashboard route returns { data: { activeSession, tasks, progressLogs, stats } }
        // We'll use progressLogs as the history for now
        setSessions(response.data.data.progressLogs || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds) return '---';
    const mins = Math.floor(seconds / 60);
    return `${mins}m ${seconds % 60}s`;
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading your history...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Work Sessions History</h2>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
          <FiCheckCircle /> All sessions synced
        </div>
      </div>

      <div className="bg-[#11081f]/50 border border-[#2a1b4d] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#190e2d] text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Activity</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a1b4d]">
            {sessions.length > 0 ? sessions.map((log) => (
              <tr key={log._id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <FiClock className="w-4 h-4" />
                    </div>
                    <span className="text-gray-200 font-medium">{log.title}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {log.type}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {new Date(log.createdAt).toLocaleDateString()} at {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-4">
                  <span className="text-emerald-400 text-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" /> 
                    Logged
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-500">No sessions logged yet. Start working to see data!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkSessions;