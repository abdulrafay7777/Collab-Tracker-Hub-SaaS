import React from 'react';
import { Users, CheckCircle2, TrendingUp, Clock, AlertCircle } from 'lucide-react';

/**
 * Manager Dashboard
 * 
 * CONCEPT: Team-level oversight and performance
 * 
 * Shows:
 * 1. Team member status and availability
 * 2. Project progress and milestones
 * 3. Performance metrics for their team
 * 4. Task allocation and tracking
 * 5. Team alerts and notifications
 */

const ManagerDashboard = () => {
  const teamStats = [
    { title: 'Team Members', value: '12', icon: Users, color: 'from-blue-600 to-blue-400' },
    { title: 'Tasks In Progress', value: '24', icon: CheckCircle2, color: 'from-green-600 to-green-400' },
    { title: 'Completion Rate', value: '89%', icon: TrendingUp, color: 'from-purple-600 to-purple-400' },
    { title: 'Avg Time', value: '2.4d', icon: Clock, color: 'from-orange-600 to-orange-400' }
  ];

  const teamMembers = [
    { name: 'John Developer', role: 'Senior Dev', status: 'active', tasks: 5, completion: 92 },
    { name: 'Alice Designer', role: 'UI Designer', status: 'active', tasks: 3, completion: 88 },
    { name: 'Bob QA Engineer', role: 'QA', status: 'busy', tasks: 7, completion: 95 },
    { name: 'Carol DevOps', role: 'DevOps', status: 'away', tasks: 2, completion: 100 }
  ];

  const projects = [
    { name: 'Product V2.0', progress: 65, status: 'on-track', deadline: '2026-06-15' },
    { name: 'API Redesign', progress: 45, status: 'on-track', deadline: '2026-05-30' },
    { name: 'Mobile App', progress: 80, status: 'ahead', deadline: '2026-06-01' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-400';
      case 'busy': return 'text-yellow-400';
      case 'away': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Manager Dashboard</h1>
        <p className="text-gray-400">Team management and performance tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className=" bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg  bg-linear-to-br ${stat.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members */}
        <div className=" bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Team Members</h2>
          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="border border-white/10 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.role}</p>
                  </div>
                  <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(member.status) === 'text-green-400' ? 'bg-green-400' : getStatusColor(member.status) === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{member.tasks} tasks</span>
                  <span className="text-emerald-400">{member.completion}% done</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className=" bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Active Projects</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-white">{project.name}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    project.status === 'ahead' ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 mb-2">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{project.progress}%   Due {project.deadline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className=" bg-linear-to-br from-yellow-600/20 to-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
          <div>
            <p className="text-sm font-semibold text-yellow-400">Attention Required</p>
            <p className="text-sm text-gray-300 mt-1">Carol DevOps is away and has 2 pending tasks. Consider reassigning work.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
