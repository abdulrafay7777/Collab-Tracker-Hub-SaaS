import React, { useState } from 'react';
import { Clock, Play, Square, TrendingUp, Calendar } from 'lucide-react';

const EmployeeWorkSessions = () => {
  const [sessions] = useState([
    { id: 1, date: '2024-05-07', startTime: '09:00 AM', endTime: '12:30 PM', duration: '3h 30m', task: 'Fix login bug', type: 'focused' },
    { id: 2, date: '2024-05-07', startTime: '02:00 PM', endTime: '05:45 PM', duration: '3h 45m', task: 'Code review', type: 'review' },
    { id: 3, date: '2024-05-06', startTime: '09:15 AM', endTime: '01:00 PM', duration: '3h 45m', task: 'API implementation', type: 'development' },
    { id: 4, date: '2024-05-06', startTime: '02:30 PM', endTime: '04:00 PM', duration: '1h 30m', task: 'Team standup', type: 'meeting' },
    { id: 5, date: '2024-05-05', startTime: '09:00 AM', endTime: '12:00 PM', duration: '3h', task: 'Documentation', type: 'documentation' },
  ]);

  const [isTracking, setIsTracking] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const filteredSessions = sessions.filter(session => 
    filterType === 'all' || session.type === filterType
  );

  const totalHoursToday = sessions
    .filter(s => s.date === '2024-05-07')
    .reduce((acc, s) => {
      const hours = parseFloat(s.duration);
      return acc + hours;
    }, 0);

  const getSessionColor = (type) => {
    switch (type) {
      case 'focused': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'review': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'development': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'meeting': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'documentation': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Work Sessions</h1>
        <p className="text-gray-400">Track and manage your work time</p>
      </div>

      {/* Current Session Tracker */}
      <div className="bg-linear-to-br from-emerald-500/20 to-emerald-500/0 border border-emerald-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Current Session</h3>
            <p className="text-sm text-gray-400">Click start to begin tracking your work</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">{isTracking ? '00:15' : '00:00'}</p>
            <p className="text-xs text-gray-400">Elapsed time</p>
          </div>
        </div>
        <button 
          onClick={() => setIsTracking(!isTracking)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            isTracking 
              ? 'bg-red-600/30 hover:bg-red-600/40 text-red-400 border border-red-500/30' 
              : 'bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {isTracking ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              Stop Session
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Start Session
            </>
          )}
        </button>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Today's Hours</h3>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalHoursToday.toFixed(1)}h</p>
          <p className="text-xs text-blue-400 mt-2">2 sessions completed</p>
        </div>

        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Weekly Total</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">38.5h</p>
          <p className="text-xs text-green-400 mt-2">On track with goal</p>
        </div>

        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Avg Duration</h3>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">3h 26m</p>
          <p className="text-xs text-purple-400 mt-2">Per session</p>
        </div>
      </div>

      {/* Filter */}
      <div>
        <label className="text-xs text-gray-400 block mb-2">Filter by Type</label>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white hover:border-white/20 focus:border-emerald-400 focus:outline-none"
        >
          <option value="all">All Sessions</option>
          <option value="focused">Focused Work</option>
          <option value="review">Code Review</option>
          <option value="development">Development</option>
          <option value="meeting">Meeting</option>
          <option value="documentation">Documentation</option>
        </select>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase">Recent Sessions</h3>
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div 
              key={session.id}
              className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-medium">{session.task}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {session.date} {session.startTime} - {session.endTime}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${getSessionColor(session.type)} capitalize block mb-2`}>
                    {session.type}
                  </span>
                  <p className="text-sm font-semibold text-emerald-400">{session.duration}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">No sessions match your filter</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeWorkSessions;
