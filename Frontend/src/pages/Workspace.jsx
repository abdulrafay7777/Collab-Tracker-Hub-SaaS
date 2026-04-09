import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SessionBanner from '../components/SessionBanner';
import StatCard from '../components/StatCard';
import TaskItem from '../components/TaskItem';
import ProgressItem from '../components/ProgressItem';
import ProgressModal from '../components/ProgressModal';

const Workspace = () => {
  // Initialize with an empty structure to prevent "undefined" crashes
  const [dashboardData, setDashboardData] = useState({
    stats: { activeTasks: 0, completedToday: 0, overdue: 0, sessionSeconds: 0 },
    tasks: [],
    progressLogs: [],
    activeSession: null
  });
  
  const [loading, setLoading] = useState(true);
  const [liveSessionSeconds, setLiveSessionSeconds] = useState(0);
  const [isToggling, setIsToggling] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  // 1. UPDATED URL: Now points specifically to /dashboard
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/workspace/dashboard');
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Session timer logic
  useEffect(() => {
    let interval;
    if (dashboardData?.activeSession) {
      const start = new Date(dashboardData.activeSession.startTime).getTime();
      
      const updateTimer = () => {
        setLiveSessionSeconds(Math.floor((new Date().getTime() - start) / 1000));
      };

      updateTimer(); // Run immediately
      interval = setInterval(updateTimer, 1000);
    } else {
      setLiveSessionSeconds(0);
    }
    return () => clearInterval(interval);
  }, [dashboardData?.activeSession]);

  const handleToggleSession = async () => {
    setIsToggling(true);
    try {
      await axios.post('http://localhost:5000/api/v1/workspace/session/toggle', { 
        taskId: dashboardData.tasks?.[0]?._id || null 
      });
      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to toggle session", error);
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-emerald-400 animate-pulse font-medium">Initializing Workspace...</div>
      </div>
    );
  }

  // Destructure with fallbacks to ensure safety
  const { stats, tasks, progressLogs, activeSession } = dashboardData;

  const formatStatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const totalDisplaySeconds = (parseInt(stats?.sessionSeconds) || 0) + Math.max(0, liveSessionSeconds);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">My Workspace</h1>
        <p className="text-sm text-gray-400">Manage your active flow and daily targets</p>
      </div>

      {/* Session Banner */}
      <SessionBanner
        isTracking={!!activeSession}
        secondsElapsed={liveSessionSeconds}
        onToggle={handleToggleSession}
        isToggling={isToggling}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="ACTIVE TASKS" value={stats?.activeTasks || 0} sub="In queue" type="blue" />
        <StatCard title="COMPLETED TODAY" value={stats?.completedToday || 0} sub="Finalized" type="green" />
        <StatCard title="OVERDUE" value={stats?.overdue || 0} sub="Urgent" type="red" />
        <StatCard 
            title="SESSION TIME" 
            value={formatStatTime(totalDisplaySeconds)} 
            sub={activeSession ? "Timer running..." : "Total logged"} 
            type={activeSession ? "green" : "yellow"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Section */}
        <div className="bg-[#11081f] border border-[#2a1b4d] rounded-2xl p-6 shadow-xl flex flex-col min-h-96">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Current Assignments</h3>
          <div className="space-y-4">
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  title={task.title}
                  meta={`${task.category || 'Core'} · Due ${new Date(task.dueDate).toLocaleDateString()}`}
                  status={task.status}
                  color={
                    task.status === 'Done' ? 'green' : 
                    task.status === 'In Progress' ? 'yellow' : 
                    task.status === 'Overdue' ? 'red' : 'gray'
                  }
                />
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-[#2a1b4d] rounded-xl text-gray-500 text-sm">
                No tasks assigned yet.
              </div>
            )}
          </div>
        </div>

        {/* Progress Log Section */}
        <div className="bg-[#11081f] border border-[#2a1b4d] rounded-2xl p-6 shadow-xl flex flex-col min-h-[400px]">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Recent Activity</h3>
          <div className="space-y-5 flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
            {progressLogs && progressLogs.length > 0 ? (
              progressLogs.map((log) => (
                <ProgressItem
                  key={log._id}
                  type={log.type}
                  title={log.title}
                  time={new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-600 text-sm italic">
                Logs will appear here once you start a session.
              </div>
            )}
          </div>

          <button
            onClick={() => setIsProgressModalOpen(true)}
            className="w-full py-3 bg-[#190e2d] border border-[#2a1b4d] rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-[#2a1b4d] transition-all"
          >
            + New Progress Update
          </button>
        </div>
      </div>

      <ProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        activeTask={tasks && tasks.length > 0 ? tasks[0] : null}
        onUpdateSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default Workspace;