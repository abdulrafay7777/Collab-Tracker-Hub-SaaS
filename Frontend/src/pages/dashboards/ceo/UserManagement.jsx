import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

/**
 * User Management Page (CEO Only)
 * 
 * CONCEPT: CRUD Operations for Users
 * 
 * This page allows CEOs to:
 * 1. View all users with pagination
 * 2. Create new users and assign roles
 * 3. Edit user information and roles
 * 4. Delete users from the system
 * 5. Search and filter users
 * 
 * STATE MANAGEMENT:
 * - Uses useState for user list and modals
 * - Mock data simulates backend responses
 * - Form handling for create/update operations
 */

const UserManagement = () => {
  // Mock user data
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'CEO',
      department: 'Executive',
      status: 'active',
      joinDate: '2020-01-15'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'Manager',
      department: 'Product',
      status: 'active',
      joinDate: '2021-03-20'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@company.com',
      role: 'Senior',
      department: 'Engineering',
      status: 'active',
      joinDate: '2021-06-10'
    },
    {
      id: '4',
      name: 'John Developer',
      email: 'john@company.com',
      role: 'Employee',
      department: 'Engineering',
      status: 'active',
      joinDate: '2023-02-28'
    },
    {
      id: '5',
      name: 'Lisa Marketing',
      email: 'lisa@company.com',
      role: 'Manager',
      department: 'Marketing',
      status: 'inactive',
      joinDate: '2021-11-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    department: ''
  });

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Open modal for creating new user
  const handleCreateClick = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Employee', department: '' });
    setIsModalOpen(true);
  };

  // Open modal for editing user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, ...formData }
          : user
      ));
    } else {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  // Delete user
  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'CEO': return 'bg-red-600/20 text-red-400 border-red-400/30';
      case 'Manager': return 'bg-blue-600/20 text-blue-400 border-blue-400/30';
      case 'Senior': return 'bg-green-600/20 text-green-400 border-green-400/30';
      case 'Employee': return 'bg-purple-600/20 text-purple-400 border-purple-400/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-600/20 text-green-400'
      : 'bg-red-600/20 text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">User Management</h1>
          <p className="text-gray-400">Create, edit, and manage users and roles</p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="CEO">CEO</option>
            <option value="Manager">Manager</option>
            <option value="Senior">Senior</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Join Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{user.department}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-blue-400 hover:bg-blue-400/20 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#190e2d] border border-white/10 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingUser ? 'Edit User' : 'Create New User'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="email@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="CEO">CEO</option>
                  <option value="Manager">Manager</option>
                  <option value="Senior">Senior</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g., Engineering"
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
                onClick={handleSaveUser}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
              >
                Save User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
