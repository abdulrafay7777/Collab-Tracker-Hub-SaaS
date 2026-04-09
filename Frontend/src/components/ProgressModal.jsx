import React, { useState } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

const ProgressModal = ({ isOpen, onClose, activeTask, onUpdateSuccess }) => {
  const [content, setContent] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(activeTask?.progress || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/v1/workspace/progress', {
        taskId: activeTask?._id || null, // If null, it's a general update
        content,
        completionPercentage
      });
      
      setContent('');
      onUpdateSuccess(); // Refresh dashboard data
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to submit progress update", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#11081f] border border-[#2a1b4d] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2a1b4d] bg-[#190e2d]">
          <h2 className="text-lg font-semibold text-white">Add Progress Update</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What did you accomplish?
            </label>
            <textarea
              required
              rows="4"
              className="w-full bg-[#0a0514] border border-[#2a1b4d] rounded-lg p-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all resize-none"
              placeholder="E.g., Finished the API integration and wrote unit tests..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          {/* Slider for percentage */}
          {activeTask && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">Task Completion</label>
                <span className="text-emerald-400 font-bold">{completionPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={completionPercentage}
                onChange={(e) => setCompletionPercentage(Number(e.target.value))}
                className="w-full accent-emerald-400 h-2 bg-[#2a1b4d] rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-6 py-2 bg-emerald-400 hover:bg-emerald-500 text-black text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Post Update'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProgressModal;