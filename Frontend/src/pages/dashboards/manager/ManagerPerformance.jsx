import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Target } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import axios from 'axios';

const ManagerPerformance = () => {
  const { showError } = useToast();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/workspace/performance');
      setPerformance(response.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      showError('Failed to load performance metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Performance Metrics</h1>
          <p className="text-gray-400">Track team and individual performance</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400">Loading performance data...</p>
        </div>
      </div>
    );
  }

  const teamPerformance = performance?.members || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Performance Metrics</h1>
        <p className="text-gray-400">Track team and individual performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-600/20 to-blue-400/10 border border-blue-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Team Efficiency</p>
          <p className="text-3xl font-bold text-blue-400">{performance?.teamEfficiency || 0}%</p>
        </div>
        <div className="bg-linear-to-br from-green-600/20 to-green-400/10 border border-green-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Completed Tasks</p>
          <p className="text-3xl font-bold text-green-400">{performance?.completedTasks || 0}</p>
        </div>
        <div className="bg-linear-to-br from-purple-600/20 to-purple-400/10 border border-purple-400/30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">On-time Delivery</p>
          <p className="text-3xl font-bold text-purple-400">{performance?.onTimeDelivery || 0}%</p>
        </div>
      </div>

      <div className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
        <h3 className="text-white font-bold mb-4">Member Performance Scores</h3>
        <div className="space-y-4">
          {teamPerformance.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No performance data available</p>
          ) : (
            teamPerformance.map((member) => (
              <div key={member._id} className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-gray-300">{member.name}</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Completion: {member.completionRate}% | On-time: {member.onTimeRate}%
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-linear-to-r from-emerald-500 to-emerald-400 h-2 rounded-full" 
                      style={{ width: `${member.score}%` }}
                    />
                  </div>
                  <span className="text-emerald-400 font-bold w-12 text-right">{member.score}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerPerformance;
