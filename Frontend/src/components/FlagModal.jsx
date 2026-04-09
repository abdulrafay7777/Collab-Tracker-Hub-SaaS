import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

const FlagModal = ({ isOpen, onClose, tasks, onSubmitSuccess }) => {
  const [taskId, setTaskId] = useState(tasks?.[0]?._id || '');
  const [reasonCategory, setReasonCategory] = useState('Technical Blocker');
  const [severityLevel, setSeverityLevel] = useState('Medium');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/v1/workspace/flag', {
        taskId, reasonCategory, severityLevel, explanation
      });
      setExplanation('');
      onSubmitSuccess('Flag Delay');
      onClose();
    } catch (error) {
      console.error("Failed to submit flag", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#11081f] border border-red-500/30 rounded-xl w-full max-w-lg shadow-[0_0_30px_rgba(239,68,68,0.15)] overflow-hidden">
        
        <div className="flex items-center justify-between p-5 border-b border-[#2a1b4d] bg-[#190e2d]">
          <div className="flex items-center gap-2 text-red-400">
            <FiAlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">Flag a Delay / Blocker</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><FiX className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Which task is blocked?</label>
            <select value={taskId} onChange={(e) => setTaskId(e.target.value)} className="w-full bg-[#0a0514] border border-[#2a1b4d] rounded-lg p-3 text-white focus:outline-none focus:border-red-400">
              {tasks?.map(task => <option key={task._id} value={task._id}>{task.title}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Reason</label>
              <select value={reasonCategory} onChange={(e) => setReasonCategory(e.target.value)} className="w-full bg-[#0a0514] border border-[#2a1b4d] rounded-lg p-3 text-white focus:outline-none focus:border-red-400">
                <option>Technical Blocker</option>
                <option>Waiting on 3rd Party</option>
                <option>Scope Creep</option>
                <option>Personal Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
              <select value={severityLevel} onChange={(e) => setSeverityLevel(e.target.value)} className="w-full bg-[#0a0514] border border-[#2a1b4d] rounded-lg p-3 text-white focus:outline-none focus:border-red-400">
                <option value="Low">Low (Heads up)</option>
                <option value="Medium">Medium (Delay likely)</option>
                <option value="High/Blocker">High (Cannot proceed)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Explanation</label>
            <textarea required rows="3" value={explanation} onChange={(e) => setExplanation(e.target.value)} className="w-full bg-[#0a0514] border border-[#2a1b4d] rounded-lg p-3 text-white focus:outline-none focus:border-red-400 resize-none" placeholder="Explain what is blocking you..."></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">Cancel</button>
            <button type="submit" disabled={isSubmitting || !explanation} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50">
              {isSubmitting ? 'Flagging...' : 'Submit Flag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlagModal;