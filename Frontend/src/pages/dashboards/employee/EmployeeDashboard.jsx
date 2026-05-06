import React from 'react';
import { CheckCircle2, Clock, TrendingUp, AlertCircle } from 'lucide-react';

/**
 * Employee Dashboard
 * 
 * CONCEPT: Personal productivity and task management
 * 
 * Shows:
 * 1. Personal task list and progress
 * 2. Time tracking and work sessions
 * 3. Performance metrics
 * 4. Progress updates and milestones
 * 5. Personal goals and achievements
 */

const EmployeeDashboard = () => {
  const personalStats = [
    { title: 'Tasks Today', value: '8', icon: CheckCircle2, color: 'from-blue-600 to-blue-400' },
    { title: 'Completed', value: '5', icon: CheckCircle2, color: 'from-green-600 to-green-400' },
    { title: 'Hours Logged', value: '6.5h', icon: Clock, color: 'from-purple-600 to-purple-400' },
    { title: 'Productivity', value: '87%', icon: TrendingUp, color: 'from-orange-600 to-orange-400' }
  ];

  const todaysTasks = [
    { id: 1, title: 'Fix login page bug', status: 'completed', priority: 'high', dueTime: '10:00 AM' },
    { id: 2, title: 'Code review for PR #234', status: 'in-progress', priority: 'medium', dueTime: '2:00 PM' },
    { id: 3, title: 'Update API documentation', status: 'pending', priority: 'low', dueTime: '4:00 PM' },
    { id: 4, title: 'Team standup meeting', status: 'pending', priority: 'high', dueTime: '3:00 PM' },
    { id: 5, title: 'Performance optimization', status: 'pending', priority: 'medium', dueTime: 'Tomorrow' }
  ];

  const weekProgress = [
    { day: 'Mon', hours: 8.2, tasks: 7 },
    { day: 'Tue', hours: 7.8, tasks: 6 },
    { day: 'Wed', hours: 8.5, tasks: 8 },
    { day: 'Thu', hours: 6.5, tasks: 5 },
    { day: 'Fri', hours: 0, tasks: 0 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-600/20 border-green-400/30 text-green-400';
      case 'in-progress': return 'bg-blue-600/20 border-blue-400/30 text-blue-400';
      case 'pending': return 'bg-gray-600/20 border-gray-400/30 text-gray-400';
      default: return 'bg-gray-600/20 border-gray-400/30 text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">My Dashboard</h1>
        <p className="text-gray-400">Personal productivity and task management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {personalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tasks and Week Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Today's Tasks</h2>
          <div className="space-y-2">
            {todaysTasks.map((task) => (
              <div key={task.id} className={`border rounded-lg p-3 flex items-start justify-between ${getStatusColor(task.status)}`}>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-1">Due: {task.dueTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold uppercase ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`w-3 h-3 rounded-full ${
                    task.status === 'completed' ? 'bg-green-400' :
                    task.status === 'in-progress' ? 'bg-blue-400' : 'bg-gray-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Week Overview */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">This Week</h2>
          <div className="space-y-3">
            {weekProgress.map((day, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">{day.day}</span>
                  <span className="text-sm font-semibold text-white">{day.hours}h</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 mb-1">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${(day.hours / 8) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{day.tasks} tasks</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-400/10 border border-cyan-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm font-semibold text-cyan-400">Keep Going!</p>
            <p className="text-sm text-gray-300 mt-1">You've completed 62% of today's tasks. Finish strong by 5 PM!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
