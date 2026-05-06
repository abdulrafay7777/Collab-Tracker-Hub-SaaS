import React, { useState } from 'react';
import { AlertTriangle, Clock, User, ArrowRight, Plus, Trash2 } from 'lucide-react';

const EmployeeFlags = () => {
  const [flags] = useState([
    { 
      id: 1, 
      title: 'Blocked on Database Migration', 
      description: 'Waiting for database team to complete schema migration before proceeding',
      severity: 'high',
      createdAt: '2024-05-07',
      dueDate: '2024-05-10',
      assignedTo: 'You',
      proposedNewETA: '2024-05-12'
    },
    { 
      id: 2, 
      title: 'API Rate Limiting Issue', 
      description: 'Third-party API rate limits affecting testing. Need to request higher limits.',
      severity: 'medium',
      createdAt: '2024-05-06',
      dueDate: '2024-05-09',
      assignedTo: 'You',
      proposedNewETA: '2024-05-11'
    },
    { 
      id: 3, 
      title: 'Missing Design Specifications', 
      description: 'Waiting for design team to finalize UI specifications for new dashboard',
      severity: 'high',
      createdAt: '2024-05-05',
      dueDate: '2024-05-08',
      assignedTo: 'You',
      proposedNewETA: '2024-05-14'
    },
    { 
      id: 4, 
      title: 'Environmental Setup Delay', 
      description: 'Development environment setup took longer than expected. Caught up now.',
      severity: 'low',
      createdAt: '2024-05-03',
      dueDate: '2024-05-06',
      assignedTo: 'You',
      proposedNewETA: '2024-05-06'
    },
  ]);

  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredFlags = flags.filter(flag => 
    filterSeverity === 'all' || flag.severity === filterSeverity
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

  const highSeverityCount = flags.filter(f => f.severity === 'high').length;
  const mediumSeverityCount = flags.filter(f => f.severity === 'medium').length;
  const lowSeverityCount = flags.filter(f => f.severity === 'low').length;

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
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm transition-colors">
          <Plus className="w-4 h-4" />
          Report Flag
        </button>
      </div>

      {/* Flags List */}
      <div className="space-y-4">
        {filteredFlags.length > 0 ? (
          filteredFlags.map((flag) => (
            <div 
              key={flag.id}
              className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <AlertTriangle className={`w-6 h-6 flex-shrink-0 mt-1 ${getSeverityIcon(flag.severity)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg break-words pr-2">{flag.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize whitespace-nowrap flex-shrink-0 ml-2 ${getSeverityColor(flag.severity)}`}>
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{flag.description}</p>
                  
                  {/* Flag Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      Created {flag.createdAt}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <User className="inline" />
                      Assigned to you
                    </div>
                    <div className="text-gray-500 col-span-1 md:col-span-2">
                      Original ETA: {flag.dueDate}
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
                <button className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0 mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg">
            <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No flags match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeFlags;
