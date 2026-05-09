import React from 'react';
import { CheckCircle2, Clipboard, Users, TrendingUp, AlertCircle } from 'lucide-react';

/**
 * Senior Dashboard
 * 
 * CONCEPT: Project and team coordination
 * 
 * Shows:
 * 1. Project progress and milestones
 * 2. Team collaboration metrics
 * 3. Technical debt and issues
 * 4. Code quality indicators
 * 5. Sprint planning and execution
 */

const SeniorDashboard = () => {
  const projectStats = [
    { title: 'Projects', value: '5', icon: Clipboard, color: 'from-blue-600 to-blue-400' },
    { title: 'Completed Tasks', value: '142', icon: CheckCircle2, color: 'from-green-600 to-green-400' },
    { title: 'Team Size', value: '24', icon: Users, color: 'from-purple-600 to-purple-400' },
    { title: 'Avg Quality', value: '91%', icon: TrendingUp, color: 'from-orange-600 to-orange-400' }
  ];

  const sprints = [
    {
      name: 'Sprint 14',
      progress: 78,
      tasks: { total: 35, completed: 27, remaining: 8 },
      dueDate: '2026-05-23'
    },
    {
      name: 'Sprint 15',
      progress: 15,
      tasks: { total: 40, completed: 6, remaining: 34 },
      dueDate: '2026-06-06'
    }
  ];

  const technicalMetrics = [
    { name: 'Code Coverage', value: 87, target: 90 },
    { name: 'Test Pass Rate', value: 95, target: 98 },
    { name: 'Performance Score', value: 88, target: 95 },
    { name: 'Security Score', value: 92, target: 95 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Senior Developer Dashboard</h1>
        <p className="text-gray-400">Project leadership and technical coordination</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projectStats.map((stat, index) => {
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

      {/* Sprints and Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sprints */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Active Sprints</h2>
          <div className="space-y-4">
            {sprints.map((sprint, index) => (
              <div key={index} className="border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-white">{sprint.name}</p>
                  <span className="text-xs text-gray-400">Due: {sprint.dueDate}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 mb-3">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${sprint.progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 text-xs gap-2">
                  <div className="bg-blue-600/20 border border-blue-400/30 rounded p-2 text-center">
                    <p className="text-blue-400 font-semibold">{sprint.tasks.total}</p>
                    <p className="text-gray-400">Total</p>
                  </div>
                  <div className="bg-green-600/20 border border-green-400/30 rounded p-2 text-center">
                    <p className="text-green-400 font-semibold">{sprint.tasks.completed}</p>
                    <p className="text-gray-400">Done</p>
                  </div>
                  <div className="bg-orange-600/20 border border-orange-400/30 rounded p-2 text-center">
                    <p className="text-orange-400 font-semibold">{sprint.tasks.remaining}</p>
                    <p className="text-gray-400">Left</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Metrics */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Technical Quality</h2>
          <div className="space-y-4">
            {technicalMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{metric.value}%</span>
                    <span className="text-xs text-gray-500">Target: {metric.target}%</span>
                  </div>
                </div>
                <div className="relative w-full bg-white/5 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${metric.value}%` }}
                  />
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-2 bg-gray-400/50"
                    style={{ left: `${metric.target}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Review Queue */}
      <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Pull Requests Awaiting Review</h2>
        <div className="space-y-2">
          <div className="border border-blue-400/30 bg-blue-600/20 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">feat: Add dark mode support</p>
              <p className="text-xs text-gray-400">by John Developer   2 hours ago</p>
            </div>
            <span className="text-xs bg-blue-600 px-2 py-1 rounded">Ready</span>
          </div>
          <div className="border border-green-400/30 bg-green-600/20 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">refactor: Optimize database queries</p>
              <p className="text-xs text-gray-400">by Alice Designer   4 hours ago</p>
            </div>
            <span className="text-xs bg-green-600 px-2 py-1 rounded">In Review</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorDashboard;
