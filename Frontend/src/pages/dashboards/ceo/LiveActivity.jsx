import React, { useState, useEffect } from 'react';
import { User, Activity, Check, AlertCircle, Clock } from 'lucide-react';

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
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'task_completed',
      user: 'John Developer',
      action: 'completed task',
      target: 'API Integration - Payment Gateway',
      timestamp: new Date(Date.now() - 2 * 60000), // 2 minutes ago
      team: 'Backend',
      status: 'completed'
    },
    {
      id: 2,
      type: 'user_login',
      user: 'Emily Rodriguez',
      action: 'logged in',
      target: null,
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      team: 'Frontend',
      status: 'active'
    },
    {
      id: 3,
      type: 'task_started',
      user: 'Mike Chen',
      action: 'started task',
      target: 'Database Optimization',
      timestamp: new Date(Date.now() - 8 * 60000), // 8 minutes ago
      team: 'Backend',
      status: 'in_progress'
    },
    {
      id: 4,
      type: 'comment_added',
      user: 'Lisa Marketing',
      action: 'commented on',
      target: 'Q2 Marketing Strategy',
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      team: 'Marketing',
      status: 'completed'
    },
    {
      id: 5,
      type: 'file_uploaded',
      user: 'Sarah Johnson',
      action: 'uploaded file',
      target: 'Monthly Report - May.pdf',
      timestamp: new Date(Date.now() - 25 * 60000), // 25 minutes ago
      team: 'Executive',
      status: 'completed'
    },
    {
      id: 6,
      type: 'meeting_scheduled',
      user: 'James Smith',
      action: 'scheduled meeting',
      target: 'Team Standup',
      timestamp: new Date(Date.now() - 35 * 60000), // 35 minutes ago
      team: 'Backend',
      status: 'pending'
    },
    {
      id: 7,
      type: 'user_logout',
      user: 'David Lee',
      action: 'logged out',
      target: null,
      timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      team: 'Frontend',
      status: 'completed'
    }
  ]);

  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Simulate new activities coming in
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new activity (simulating real-time updates)
      if (Math.random() > 0.7) {
        const teams = ['Frontend', 'Backend', 'Marketing', 'Executive'];
        const actions = [
          { type: 'task_completed', action: 'completed task', target: 'Feature Development' },
          { type: 'user_login', action: 'logged in', target: null },
          { type: 'task_started', action: 'started task', target: 'Bug Fixing' }
        ];
        
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomUser = ['John', 'Emily', 'Mike', 'Lisa', 'Sarah'][Math.floor(Math.random() * 5)];

        const newActivity = {
          id: Date.now(),
          type: randomAction.type,
          user: randomUser + ' Developer',
          action: randomAction.action,
          target: randomAction.target,
          timestamp: new Date(),
          team: randomTeam,
          status: 'completed'
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, 5000); // Check every 5 seconds

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

  const teams = ['all', ...new Set(activities.map(a => a.team))];

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
          <p className="text-2xl font-bold text-blue-400">42</p>
          <p className="text-xs text-gray-500 mt-2">Currently online</p>
        </div>
        <div className=" bg-linear-to-br from-green-600/20 to-green-400/10 border border-green-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Tasks Today</p>
          <p className="text-2xl font-bold text-green-400">128</p>
          <p className="text-xs text-gray-500 mt-2">Completed</p>
        </div>
        <div className=" bg-linear-to-br from-purple-600/20 to-purple-400/10 border border-purple-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Events</p>
          <p className="text-2xl font-bold text-purple-400">342</p>
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
              <option key={team} value={team}>
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
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredActivities.length === 0 ? (
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
                className="bg-gradient-to-r from-white/5 to-white/0 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`${activityInfo.bgColor} p-3 rounded-lg flex-shrink-0`}>
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
                      <div className="text-right flex-shrink-0">
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
