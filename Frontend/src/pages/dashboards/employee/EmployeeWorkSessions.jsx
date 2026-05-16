import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../../context/ToastContext';

const EmployeeWorkSessions = () => {
  const { showSuccess, showError } = useToast();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Fetch sessions from backend
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/workspace/sessions');
      setSessions(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      showError('Failed to load sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks for dropdown
  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/v1/workspace/tasks');
      const taskList = Array.isArray(res.data) ? res.data : res.data.data || [];
      setTasks(taskList);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchTasks();
  }, []);

  // Timer for elapsed time
  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // Format elapsed time as HH:MM:SS
  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Toggle session - call backend API
  const handleToggleSession = async () => {
    try {
      if (isTracking) {
        // Stop session
        await axios.post('/api/v1/workspace/session/toggle', { action: 'stop' });
        showSuccess('Session stopped');
        setElapsedSeconds(0);
        setIsTracking(false);
        setSelectedTaskId('');
        // Refresh sessions list
        await fetchSessions();
      } else {
        // Start session
        await axios.post('/api/v1/workspace/session/toggle', { 
          action: 'start',
          taskId: selectedTaskId || null
        });
        showSuccess('Session started');
        setElapsedSeconds(0);
        setIsTracking(true);
      }
    } catch (err) {
      console.error('Error toggling session:', err);
      showError(err.response?.data?.message || 'Failed to toggle session');
    }
  };

  const filteredSessions = sessions.filter(session => 
    filterType === 'all' || session.type === filterType
  );

  const todayDate = new Date().toLocaleDateString();
  const totalHoursToday = sessions
    .filter(s => s.date === todayDate && !s.isActive)
    .reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 3600;

  const getSessionColor = (type) => {
    switch (type) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
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
            <p className="text-2xl font-bold text-emerald-400 font-mono">{formatElapsedTime(elapsedSeconds)}</p>
            <p className="text-xs text-gray-400">Elapsed time</p>
          </div>
        </div>

        {!isTracking && (
          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-2">Select Task (Optional)</label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white hover:border-white/20 focus:border-emerald-400 focus:outline-none"
            >
              <option value="" style={{ backgroundColor: '#190e2d', color: 'white' }}>
                General Work (No Task)
              </option>
              {tasks.map((task) => (
                <option key={task._id || task.id} value={task._id || task.id} style={{ backgroundColor: '#190e2d', color: 'white' }}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          onClick={handleToggleSession}
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
          <p className="text-xs text-blue-400 mt-2">{sessions.filter(s => s.date === todayDate && !s.isActive).length} sessions</p>
        </div>

        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Total Sessions</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{sessions.filter(s => !s.isActive).length}</p>
          <p className="text-xs text-green-400 mt-2">Completed</p>
        </div>

        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Avg Duration</h3>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {sessions.filter(s => !s.isActive).length > 0
              ? `${Math.floor(sessions.filter(s => !s.isActive).reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / sessions.filter(s => !s.isActive).length / 3600)}h ${Math.floor((sessions.filter(s => !s.isActive).reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / sessions.filter(s => !s.isActive).length % 3600) / 60)}m`
              : '0h'
            }
          </p>
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
          <option value="all" style={{ backgroundColor: '#190e2d', color: 'white' }}>All Sessions</option>
          <option value="completed" style={{ backgroundColor: '#190e2d', color: 'white' }}>Completed</option>
          <option value="active" style={{ backgroundColor: '#190e2d', color: 'white' }}>Active</option>
        </select>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase">Recent Sessions</h3>
        {loading ? (
          <p className="text-center text-gray-400 py-8">Loading sessions...</p>
        ) : filteredSessions.length > 0 ? (
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
