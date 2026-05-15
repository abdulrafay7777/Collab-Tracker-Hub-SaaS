import React, { useState, useEffect } from 'react';
import { User, Activity, Check, AlertCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../../context/ToastContext';

/**
 * Live Activity Page (CEO Only)
 * 
 * CONCEPT: Real-time Activity Monitoring
 * 
 * This page shows:
 * 1. Live user activities across all teams
 * 2. Task completion in real-time
 * 3. System events and changes
 * 4. Activity timeline (chronological order)
 * 5. Status indicators for ongoing activities
 * 
 * PATTERN: Real-time data simulation
 * - Mock activities that update periodically
 * - Color-coded by activity type
 * - Filterable by status/team
 */

const LiveActivity = () => {
  const { showError } = useToast();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState(['all']);
  const [stats, setStats] = useState({
    activeUsers: 0,
    tasksCompleted: 0,
    events: 0
  });

  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch initial activities and stats
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/activities/live');
      
      // Ensure response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      
      const activitiesData = data.map(activity => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
      setActivities(activitiesData);
      
      // Extract unique teams
      const uniqueTeams = ['all', ...new Set(activitiesData.map(a => a.team))];
      setTeams(uniqueTeams);
    } catch (error) {
      console.error('Error fetching activities:', error);
      showError('Failed to load activities');
      // Fallback: set empty activities
      setActivities([]);
      setTeams(['all']);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activity stats
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/activities/stats');
      // Ensure response.data is an object with required fields
      const statsData = response.data || { activeUsers: 0, tasksCompleted: 0, events: 0 };
      setStats({
        activeUsers: statsData.activeUsers || 0,
        tasksCompleted: statsData.tasksCompleted || 0,
        events: statsData.events || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats on error
      setStats({ activeUsers: 0, tasksCompleted: 0, events: 0 });
    }
  };

  // Initial load
  useEffect(() => {
    // Test API health first
    axios.get('/api/activities/health')
      .then(res => console.log('✅ API Health:', res.data))
      .catch(err => console.error('❌ API Health Check Failed:', err.message));
    
    fetchActivities();
    fetchStats();
  }, []);

  // Poll for new activities in real-time (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchActivities();
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchTeam = filterTeam === 'all' || activity.team === filterTeam;
    const matchStatus = filterStatus === 'all' || activity.status === filterStatus;
    return matchTeam && matchStatus;
  });

  // Format time difference
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Get activity icon and color
  const getActivityInfo = (type) => {
    const config = {
      task_completed: { icon: Check, color: 'text-green-400', label: 'Task Completed', bgColor: 'bg-green-600/20' },
      task_started: { icon: Activity, color: 'text-blue-400', label: 'Task Started', bgColor: 'bg-blue-600/20' },
      user_login: { icon: User, color: 'text-purple-400', label: 'User Login', bgColor: 'bg-purple-600/20' },
      user_logout: { icon: User, color: 'text-gray-400', label: 'User Logout', bgColor: 'bg-gray-600/20' },
      comment_added: { icon: AlertCircle, color: 'text-orange-400', label: 'Comment Added', bgColor: 'bg-orange-600/20' },
      file_uploaded: { icon: Activity, color: 'text-cyan-400', label: 'File Uploaded', bgColor: 'bg-cyan-600/20' },
      meeting_scheduled: { icon: Clock, color: 'text-yellow-400', label: 'Meeting Scheduled', bgColor: 'bg-yellow-600/20' }
    };
    return config[type] || config.task_completed;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Live Activity Monitor</h1>
        <p className="text-gray-400">Real-time tracking of system-wide activities and events</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className=" bg-linear-to-br from-blue-600/20 to-blue-400/10 border border-blue-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Active Users</p>
          <p className="text-2xl font-bold text-blue-400">{stats.activeUsers}</p>
          <p className="text-xs text-gray-500 mt-2">Currently online</p>
        </div>
        <div className=" bg-linear-to-br from-green-600/20 to-green-400/10 border border-green-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Tasks Today</p>
          <p className="text-2xl font-bold text-green-400">{stats.tasksCompleted}</p>
          <p className="text-xs text-gray-500 mt-2">Completed</p>
        </div>
        <div className=" bg-linear-to-br from-purple-600/20 to-purple-400/10 border border-purple-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Events</p>
          <p className="text-2xl font-bold text-purple-400">{stats.events}</p>
          <p className="text-xs text-gray-500 mt-2">Today</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-2">Filter by Team</label>
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
          >
            {teams.map(team => (
              <option key={team} value={team} style={{ backgroundColor: '#190e2d', color: 'white' }}>
                {team === 'all' ? 'All Teams' : team}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-2">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="all" style={{ backgroundColor: '#190e2d', color: 'white' }}>All Status</option>
            <option value="completed" style={{ backgroundColor: '#190e2d', color: 'white' }}>Completed</option>
            <option value="in_progress" style={{ backgroundColor: '#190e2d', color: 'white' }}>In Progress</option>
            <option value="pending" style={{ backgroundColor: '#190e2d', color: 'white' }}>Pending</option>
            <option value="active" style={{ backgroundColor: '#190e2d', color: 'white' }}>Active</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-3 max-h-150 overflow-y-auto">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No activities match your filters</p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const activityInfo = getActivityInfo(activity.type);
            const Icon = activityInfo.icon;

            return (
              <div
                key={activity.id}
                className="bg-linear-to-r from-white/5 to-white/0 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`${activityInfo.bgColor} p-3 rounded-lg shrink-0`}>
                    <Icon className={`w-5 h-5 ${activityInfo.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-white font-semibold">
                          {activity.user}{' '}
                          <span className="text-gray-400 font-normal">{activity.action}</span>
                        </p>
                        {activity.target && (
                          <p className="text-sm text-gray-400 mt-1">
                            <span className="text-emerald-400">"{activity.target}"</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 mt-3 text-xs">
                      <span className="px-2 py-1 bg-white/5 rounded text-gray-400">{activity.team}</span>
                      <span className={`px-2 py-1 rounded ${
                        activity.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                        activity.status === 'in_progress' ? 'bg-blue-600/20 text-blue-400' :
                        activity.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-purple-600/20 text-purple-400'
                      }`}>
                        {activity.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LiveActivity;
