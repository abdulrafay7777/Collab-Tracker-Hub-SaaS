import React, { useState } from 'react';
import { TrendingUp, CheckCircle2, Activity, Calendar, ArrowUp } from 'lucide-react';

const EmployeeProgress = () => {
  const [progressUpdates] = useState([
    { id: 1, date: '2024-05-07', title: 'Login Bug Fixed', description: 'Successfully fixed authentication issue on login page', status: 'completed', impact: 'high' },
    { id: 2, date: '2024-05-06', title: 'PR #234 Review Completed', description: 'Reviewed and provided feedback on database optimization PR', status: 'completed', impact: 'medium' },
    { id: 3, date: '2024-05-05', title: 'API Endpoint Implementation', description: 'Implemented 3 new REST API endpoints for user management', status: 'completed', impact: 'high' },
    { id: 4, date: '2024-05-04', title: 'Documentation Update', description: 'Updated API documentation with new endpoints and examples', status: 'completed', impact: 'medium' },
    { id: 5, date: '2024-05-03', title: 'Performance Optimization', description: 'Optimized database queries reducing load time by 35%', status: 'in-progress', impact: 'high' },
  ]);

  const [goals] = useState([
    { id: 1, title: 'Complete Authentication Module', progress: 85, target: '100%', deadline: '2024-05-15' },
    { id: 2, title: 'Achieve 90% Code Coverage', progress: 72, target: '90%', deadline: '2024-05-20' },
    { id: 3, title: 'Document All API Endpoints', progress: 60, target: '100%', deadline: '2024-05-10' },
    { id: 4, title: 'Performance Baseline Optimization', progress: 45, target: '100%', deadline: '2024-05-25' },
  ]);

  const [metrics] = useState([
    { label: 'Tasks Completed This Week', value: '12', change: '+3 from last week', color: 'text-green-400' },
    { label: 'Avg Code Review Time', value: '2h 15m', change: '-30m faster', color: 'text-blue-400' },
    { label: 'Bug Resolution Rate', value: '94%', change: '+2% improvement', color: 'text-purple-400' },
    { label: 'Documentation Updated', value: '8 items', change: '+4 this week', color: 'text-yellow-400' },
  ]);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const completedCount = progressUpdates.filter(u => u.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">My Progress</h1>
        <p className="text-gray-400">Track your growth and achievements</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">{metric.label}</p>
            <div className="flex items-baseline justify-between">
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">{metric.change}</p>
          </div>
        ))}
      </div>

      {/* Goals Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Goals Progress</h3>
        {goals.map((goal) => (
          <div key={goal.id} className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-medium">{goal.title}</p>
                <p className="text-xs text-gray-500 mt-1">Due: {goal.deadline}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400">{goal.progress}%</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Updates This Week</h3>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{completedCount}</p>
          <p className="text-xs text-emerald-400 mt-2">Progress updates completed</p>
        </div>

        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Momentum Score</h3>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">87/100</p>
          <p className="text-xs text-blue-400 mt-2">Strong performance trend</p>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase">Recent Updates</h3>
        {progressUpdates.map((update) => (
          <div 
            key={update.id}
            className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">{update.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{update.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {update.date}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full border capitalize ${getImpactColor(update.impact)}`}>
                    {update.impact} impact
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeProgress;
