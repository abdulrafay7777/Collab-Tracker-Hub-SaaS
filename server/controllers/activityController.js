const Task = require('../models/Task.js');
const Session = require('../models/Session.js');
const ProgressLog = require('../models/ProgressLog.js');

// Helper to generate team member names
const generateTeamMemberName = (index) => {
  const names = ['John Developer', 'Sarah Designer', 'Mike QA', 'Alice Frontend', 'Bob Backend', 'Carol DevOps'];
  return names[index % names.length];
};

// Helper to generate team member roles
const generateTeamMemberRole = (index) => {
  const roles = ['Senior Developer', 'UI/UX Designer', 'QA Engineer', 'Frontend Engineer', 'Backend Engineer', 'DevOps Engineer'];
  return roles[index % roles.length];
};

/**
 * Get Live Activities
 * Fetches recent activities from various sources
 */
const getLiveActivities = async (req, res) => {
  try {
    console.log('Fetching live activities...');
    const limit = parseInt(req.query.limit) || 50;
    
    // Fetch recent tasks
    const recentTasks = await Task.find()
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    // Fetch recent sessions
    const recentSessions = await Session.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Fetch recent progress logs
    const recentProgress = await ProgressLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Build name maps from all unique user IDs
    const allUserIds = new Set();
    recentTasks.forEach(t => t.assignedBy && allUserIds.add(t.assignedBy.toString()));
    recentSessions.forEach(s => s.employeeId && allUserIds.add(s.employeeId.toString()));
    recentProgress.forEach(p => p.employeeId && allUserIds.add(p.employeeId.toString()));

    const userIdArray = Array.from(allUserIds);
    const nameMap = {};
    userIdArray.forEach((userId, index) => {
      nameMap[userId] = generateTeamMemberName(index);
    });

    // Convert to activity format
    const activities = [];

    recentTasks.forEach(task => {
      const assignedByStr = task.assignedBy ? task.assignedBy.toString() : null;
      activities.push({
        id: task._id.toString(),
        type: 'task_completed',
        user: assignedByStr && nameMap[assignedByStr] ? nameMap[assignedByStr] : 'Unknown User',
        action: 'completed task',
        target: task.title,
        timestamp: task.updatedAt,
        team: task.team || 'General',
        status: task.status || 'completed'
      });
    });

    recentSessions.forEach(session => {
      const employeeIdStr = session.employeeId ? session.employeeId.toString() : null;
      activities.push({
        id: session._id.toString(),
        type: 'user_login',
        user: employeeIdStr && nameMap[employeeIdStr] ? nameMap[employeeIdStr] : 'Unknown User',
        action: 'started work session',
        target: null,
        timestamp: session.createdAt,
        team: session.team || 'General',
        status: 'active'
      });
    });

    recentProgress.forEach(progress => {
      const employeeIdStr = progress.employeeId ? progress.employeeId.toString() : null;
      activities.push({
        id: progress._id.toString(),
        type: 'task_started',
        user: employeeIdStr && nameMap[employeeIdStr] ? nameMap[employeeIdStr] : 'Unknown User',
        action: 'updated progress',
        target: progress.taskTitle,
        timestamp: progress.createdAt,
        team: progress.team || 'General',
        status: 'in_progress'
      });
    });

    // Sort by timestamp and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.json(sortedActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching activities',
      error: error.message 
    });
  }
};

/**
 * Get Activity Stats
 * Returns summary statistics
 */
const getActivityStats = async (req, res) => {
  try {
    console.log('Fetching activity stats...');
    // Count active sessions (started in last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const activeUsers = await Session.countDocuments({
      createdAt: { $gte: oneHourAgo },
      endTime: null
    });

    // Count completed tasks today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const tasksCompleted = await Task.countDocuments({
      status: 'completed',
      updatedAt: { $gte: startOfDay }
    });

    // Total events today
    const allEvents = await Promise.all([
      Task.countDocuments({ updatedAt: { $gte: startOfDay } }),
      Session.countDocuments({ createdAt: { $gte: startOfDay } }),
      ProgressLog.countDocuments({ createdAt: { $gte: startOfDay } })
    ]);

    const totalEvents = allEvents.reduce((sum, count) => sum + count, 0);

    res.json({
      activeUsers: activeUsers || 0,
      tasksCompleted: tasksCompleted || 0,
      events: totalEvents || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching stats',
      error: error.message 
    });
  }
};

module.exports = {
  getLiveActivities,
  getActivityStats
};
