import React, { useState, useEffect } from 'react';
import { Users, Plus, Mail, Phone, MapPin, CheckSquare2 } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import axios from 'axios';

const ManagerTeam = () => {
  const { showError } = useToast();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/workspace/team');
      const members = Array.isArray(response.data) ? response.data : response.data.members || [];
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      showError('Failed to load team members');
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Team Management</h1>
          <p className="text-gray-400">Manage and monitor your team members</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-400">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Team Management</h1>
        <p className="text-gray-400">Manage and monitor your team members</p>
      </div>

      {teamMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No team members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div key={member._id} className="bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  member.status === 'active' 
                    ? 'bg-green-600/20 text-green-400' 
                    : 'bg-gray-600/20 text-gray-400'
                }`}>
                  {member.status}
                </span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{member.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{member.role}</p>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {member.email}
                </p>
                <p className="flex items-center gap-2">
                  <CheckSquare2 className="w-4 h-4" />
                  {member.tasks} active tasks
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerTeam;
