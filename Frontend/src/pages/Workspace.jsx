import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SessionBanner from '../components/SessionBanner';
import StatCard from '../components/StatCard';
import TaskItem from '../components/TaskItem';
import ProgressItem from '../components/ProgressItem';

const Workspace = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveSessionSeconds, setLiveSessionSeconds] = useState(0);
  const [isToggling, setIsToggling] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/workspace');
      setDashboardData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Single Source of Truth Ticker
  useEffect(() => {
    let interval;
    if (dashboardData?.activeSession) {
      const start = new Date(dashboardData.activeSession.startTime).getTime();
      setLiveSessionSeconds(Math.floor((new Date().getTime() - start) / 1000));
      interval = setInterval(() => {
        setLiveSessionSeconds(Math.floor((new Date().getTime() - start) / 1000));
      }, 1000);
    } else {
      setLiveSessionSeconds(0);
    }
    return () => clearInterval(interval);
  }, [dashboardData?.activeSession]);

  const handleToggleSession = async () => {
    setIsToggling(true);
    try {
      await axios.post('http://localhost:5000/api/v1/workspace/session/toggle', {
        taskId: null
      });
      await fetchDashboardData(); 
    } catch (error) {
      console.error("Failed to toggle session", error);
    } finally {
      setIsToggling(false);
    }
  };

  if (loading || !dashboardData) return <div className="text-white p-6">Loading Workspace...</div>;

  const { stats, tasks, progressLogs, activeSession } = dashboardData;

  const formatStatTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return "0h 0m";
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const totalDisplaySeconds = parseInt(stats?.sessionSeconds || 0, 10) + Math.max(0, liveSessionSeconds);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Workspace</h1>
        <p className="text-sm text-gray-400">Your tasks, sessions & progress — focused view only</p>
      </div>

      <SessionBanner 
        isTracking={!!activeSession}
        secondsElapsed={liveSessionSeconds}
        onToggle={handleToggleSession}
        isToggling={isToggling}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="ACTIVE TASKS" value={stats?.activeTasks || 0} sub="Assigned" type="blue" />
        <StatCard title="COMPLETED TODAY" value={stats?.completedToday || 0} sub="↑ Done" type="green" />
        <StatCard title="OVERDUE" value={stats?.overdue || 0} sub="↓ Attention" type="red" />
        
        <StatCard 
          title="SESSION TIME" 
          value={formatStatTime(totalDisplaySeconds)} 
          sub={activeSession ? "Tracking active..." : "Logged today"} 
          type={activeSession ? "green" : "yellow"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* UPDATED: Solid dark hex background #11081f and border #22133d */}
        <div className="bg-[#11081f] border border-[#22133d] rounded-xl p-5 shadow-lg flex flex-col">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">My Assigned Tasks</h3>
          <div className="space-y-4">
            {tasks && tasks.length > 0 ? tasks.map(task => (
              <TaskItem 
                key={task._id}
                title={task.title} 
                meta={`${task.category || 'General'} · Due ${new Date(task.dueDate).toLocaleDateString()}`} 
                status={task.status} 
                color={task.status === 'Done' ? 'green' : task.status === 'In Progress' ? 'yellow' : task.status === 'Overdue' ? 'red' : 'gray'} 
              />
            )) : <p className="text-sm text-gray-500">No tasks assigned.</p>}
          </div>
        </div>

        {/* UPDATED: Solid dark hex background #11081f and border #22133d */}
        <div className="bg-[#11081f] border border-[#22133d] rounded-xl p-5 shadow-lg flex flex-col">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Today's Progress Log</h3>
          <div className="space-y-5 flex-1">
            {progressLogs && progressLogs.length > 0 ? progressLogs.map(log => (
              <ProgressItem 
                key={log._id}
                type={log.type} 
                title={log.title} 
                time={new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              />
            )) : <p className="text-sm text-gray-500">No logs yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;