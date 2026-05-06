import React, { useState } from 'react';
import { CheckCircle2, Clock, Trash2, Plus } from 'lucide-react';

const EmployeeTasks = () => {
  const [tasks] = useState([
    { id: 1, title: 'Fix login page bug', status: 'completed', priority: 'high', dueDate: '2024-05-05', assignee: 'Me' },
    { id: 2, title: 'Code review for PR #234', status: 'in-progress', priority: 'medium', dueDate: '2024-05-08', assignee: 'Me' },
    { id: 3, title: 'Update API documentation', status: 'pending', priority: 'low', dueDate: '2024-05-10', assignee: 'Me' },
    { id: 4, title: 'Implement new dashboard feature', status: 'pending', priority: 'high', dueDate: '2024-05-12', assignee: 'Me' },
    { id: 5, title: 'Refactor authentication module', status: 'in-progress', priority: 'medium', dueDate: '2024-05-15', assignee: 'Me' },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
        <p className="text-gray-400">Manage and track your work</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Total Tasks</h3>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{tasks.length}</p>
          <p className="text-xs text-gray-400 mt-2">All assigned tasks</p>
        </div>

        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">In Progress</h3>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{inProgressCount}</p>
          <p className="text-xs text-blue-400 mt-2">Currently working</p>
        </div>

        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400">Completed</h3>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{completedCount}</p>
          <p className="text-xs text-green-400 mt-2">{Math.round((completedCount / tasks.length) * 100)}% completion rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="text-xs text-gray-400 block mb-2">Status</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white hover:border-white/20 focus:border-emerald-400 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-2">Priority</label>
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white hover:border-white/20 focus:border-emerald-400 focus:outline-none"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="ml-auto">
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm transition-colors">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div 
              key={task.id}
              className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-2">{task.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusColor(task.status)} capitalize`}>
                      {task.status.replace('-', ' ')}
                    </span>
                    <span className={`text-xs font-semibold capitalize ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No tasks match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTasks;
