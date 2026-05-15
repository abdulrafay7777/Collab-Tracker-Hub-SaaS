import React, { useState, useEffect } from 'react';
import { CheckSquare2, Plus, Filter, X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import axios from 'axios';

const ManagerTasks = () => {
  const { showSuccess, showError } = useToast();
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    assignedTo: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  // Fetch tasks and team members from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, teamRes] = await Promise.all([
        axios.get('/api/v1/workspace/tasks'),
        axios.get('/api/v1/workspace/team')
      ]);
      
      const tasksData = Array.isArray(tasksRes.data) ? tasksRes.data : tasksRes.data.data || [];
      setTasks(tasksData);
      
      const teamData = Array.isArray(teamRes.data) ? teamRes.data : [];
      setTeamMembers(teamData);
      
      // Set first team member as default if available
      if (teamData.length > 0 && !formData.assignedTo) {
        setFormData(prev => ({ ...prev, assignedTo: teamData[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Failed to load tasks and team');
      setTasks([]);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async () => {
    if (!formData.title || !formData.dueDate || !formData.assignedTo) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      const taskData = {
        title: formData.title,
        assignedTo: formData.assignedTo,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        team: 'Management'
      };

      await axios.post('/api/v1/workspace/tasks', taskData);
      
      // Reset form and refresh tasks
      setFormData({
        title: '',
        assignedTo: teamMembers.length > 0 ? teamMembers[0]._id : '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
      });
      setIsModalOpen(false);
      showSuccess('Task created successfully');
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error creating task:', error);
      showError(error.response?.data?.message || 'Failed to create task');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-600/20 text-green-400';
      case 'in_progress': return 'bg-blue-600/20 text-blue-400';
      case 'pending': return 'bg-yellow-600/20 text-yellow-400';
      default: return 'bg-gray-600/20 text-gray-400';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Task Management</h1>
          <p className="text-gray-400">Assign and track team tasks</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No tasks yet. Create your first task!</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Assigned To</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id || task.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 text-white">{task.title}</td>
                    <td className="px-6 py-4 text-gray-400">{task.assignedToName || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                        {task.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#190e2d] border border-white/10 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Create New Task</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Assign To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="" style={{ backgroundColor: '#190e2d', color: 'white' }}>Select a team member</option>
                  {teamMembers.map(member => (
                    <option key={member._id} value={member._id} style={{ backgroundColor: '#190e2d', color: 'white' }}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="low" style={{ backgroundColor: '#190e2d', color: 'white' }}>Low</option>
                    <option value="medium" style={{ backgroundColor: '#190e2d', color: 'white' }}>Medium</option>
                    <option value="high" style={{ backgroundColor: '#190e2d', color: 'white' }}>High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="pending" style={{ backgroundColor: '#190e2d', color: 'white' }}>Pending</option>
                    <option value="in_progress" style={{ backgroundColor: '#190e2d', color: 'white' }}>In Progress</option>
                    <option value="completed" style={{ backgroundColor: '#190e2d', color: 'white' }}>Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTasks;
