import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, User, ArrowRight, Plus, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../../context/ToastContext';

const EmployeeFlags = () => {
  const { showSuccess, showError } = useToast();
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    reasonCategory: '',
    severity: 'medium',
    explanation: '',
    proposedNewETA: '',
    taskId: ''
  });

  // Fetch flags from backend
  const fetchFlags = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/workspace/flags');
      const data = Array.isArray(res.data) ? res.data : res.data.data || res.data;
      setFlags(data);
    } catch (err) {
      console.error('Error fetching flags:', err);
      showError('Failed to load flags');
      setFlags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const filteredFlags = flags.filter(flag => 
    filterSeverity === 'all' || (flag.severity || flag.severityLevel || '').toLowerCase() === filterSeverity
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const highSeverityCount = flags.filter(f => (f.severity || f.severityLevel || '').toLowerCase() === 'high').length;
  const mediumSeverityCount = flags.filter(f => (f.severity || f.severityLevel || '').toLowerCase() === 'medium').length;
  const lowSeverityCount = flags.filter(f => (f.severity || f.severityLevel || '').toLowerCase() === 'low').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Flags & Blockers</h1>
        <p className="text-gray-400">Manage project risks and blockers</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Total Flags</p>
          <p className="text-2xl font-bold text-white">{flags.length}</p>
        </div>
        <div className="bg-linear-to-br from-red-500/10 to-red-500/0 border border-red-500/30 rounded-lg p-4">
          <p className="text-xs text-red-400 mb-2">High Severity</p>
          <p className="text-2xl font-bold text-red-400">{highSeverityCount}</p>
        </div>
        <div className="bg-linear-to-br from-yellow-500/10 to-yellow-500/0 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-xs text-yellow-400 mb-2">Medium Severity</p>
          <p className="text-2xl font-bold text-yellow-400">{mediumSeverityCount}</p>
        </div>
        <div className="bg-linear-to-br from-blue-500/10 to-blue-500/0 border border-blue-500/30 rounded-lg p-4">
          <p className="text-xs text-blue-400 mb-2">Low Severity</p>
          <p className="text-2xl font-bold text-blue-400">{lowSeverityCount}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs text-gray-400 block mb-2">Filter by Severity</label>
          <select 
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white hover:border-white/20 focus:border-emerald-400 focus:outline-none"
          >
            <option value="all" style={{ backgroundColor: '#190e2d', color: 'white' }}>All Severities</option>
            <option value="high" style={{ backgroundColor: '#190e2d', color: 'white' }}>High</option>
            <option value="medium" style={{ backgroundColor: '#190e2d', color: 'white' }}>Medium</option>
            <option value="low" style={{ backgroundColor: '#190e2d', color: 'white' }}>Low</option>
          </select>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Report Flag
        </button>
      </div>

      {/* Flags List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading flags...</p>
          </div>
        ) : filteredFlags.length > 0 ? (
          filteredFlags.map((flag) => {
            const sev = (flag.severity || flag.severityLevel || '').toLowerCase();
            return (
              <div 
                key={flag.id || flag._id}
                className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <AlertTriangle className={`w-6 h-6 shrink-0 mt-1 ${getSeverityIcon(sev)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold text-lg wrap-break-word pr-2">{flag.title || flag.reasonCategory || flag.taskTitle}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full border capitalize whitespace-nowrap shrink-0 ml-2 ${getSeverityColor(sev)}`}>
                        {sev}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{flag.description || flag.explanation}</p>
                    
                    {/* Flag Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        Created {flag.createdAt ? new Date(flag.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <User className="inline" />
                        Assigned to you
                      </div>
                      <div className="text-gray-500 col-span-1 md:col-span-2">
                        Original ETA: {flag.dueDate || flag.createdAt ? (flag.dueDate ? new Date(flag.dueDate).toLocaleDateString() : new Date(flag.createdAt).toLocaleDateString()) : 'N/A'}
                      </div>
                    </div>

                    {/* New ETA */}
                    {flag.proposedNewETA && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-gray-400 text-sm flex items-center gap-2 mb-2">
                          <ArrowRight className="w-4 h-4" />
                          New ETA: {new Date(flag.proposedNewETA).toLocaleDateString()} {flag.proposedNewETA && <ArrowRight className="w-3 h-3 inline" />}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(`/api/v1/workspace/flag/${flag.id || flag._id}`);
                        setFlags(prev => prev.filter(p => (p.id || p._id) !== (flag.id || flag._id)));
                        showSuccess('Flag deleted');
                      } catch (err) {
                        console.error('Error deleting flag:', err);
                        showError(err.response?.data?.message || 'Failed to delete flag');
                      }
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors shrink-0 mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg">
            <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No flags match your filters</p>
          </div>
        )}
      </div>

      {/* Report Flag Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#190e2d] border border-white/10 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Report New Flag</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Reason *</label>
                <input
                  type="text"
                  value={formData.reasonCategory}
                  onChange={(e) => setFormData({ ...formData, reasonCategory: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Short reason e.g. Blocked on DB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Severity *</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="high" style={{ backgroundColor: '#190e2d', color: 'white' }}>High</option>
                  <option value="medium" style={{ backgroundColor: '#190e2d', color: 'white' }}>Medium</option>
                  <option value="low" style={{ backgroundColor: '#190e2d', color: 'white' }}>Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Explanation</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Proposed New ETA</label>
                <input
                  type="date"
                  value={formData.proposedNewETA}
                  onChange={(e) => setFormData({ ...formData, proposedNewETA: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Related Task ID (optional)</label>
                <input
                  type="text"
                  value={formData.taskId}
                  onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
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
                onClick={async () => {
                  // Validate
                  if (!formData.reasonCategory || !formData.severity) {
                    showError('Please provide a reason and severity');
                    return;
                  }

                  try {
                    const payload = {
                      reasonCategory: formData.reasonCategory,
                      severityLevel: formData.severity === 'high' ? 'High/Blocker' : (formData.severity === 'medium' ? 'Medium' : 'Low'),
                      explanation: formData.explanation,
                      proposedNewETA: formData.proposedNewETA || null,
                      taskId: formData.taskId || null
                    };

                    await axios.post('/api/v1/workspace/flag', payload);
                    showSuccess('Flag reported');
                    setIsModalOpen(false);
                    setFormData({ reasonCategory: '', severity: 'medium', explanation: '', proposedNewETA: '', taskId: '' });
                    fetchFlags();
                  } catch (err) {
                    console.error('Error submitting flag:', err);
                    showError(err.response?.data?.message || 'Failed to submit flag');
                  }
                }}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
              >
                Submit Flag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeFlags;
