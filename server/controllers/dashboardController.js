const Task = require('../models/task.js');
const ProgressLog = require('../models/ProgressLog.js');
const Session = require('../models/Session.js');

/**
 * Get employee dashboard data: tasks, progress logs, sessions
 */
exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const startOfDay = req.query.startOfDay ? new Date(req.query.startOfDay) : new Date();
    if (!req.query.startOfDay) startOfDay.setHours(0, 0, 0, 0);

    const [tasks, progressLogs, activeSession, todaysSessions] = await Promise.all([
      Task.find({ assignedTo: userId }).sort({ dueDate: 1 }),
      ProgressLog.find({ userId }).sort({ createdAt: -1 }).limit(10),
      Session.findOne({ userId, isActive: true }),
      Session.find({ userId, isActive: false, updatedAt: { $gte: startOfDay } })
    ]);

    const totalSecondsToday = todaysSessions.reduce((acc, session) => acc + session.durationSeconds, 0);

    const stats = {
      activeTasks: tasks.filter(t => t.status !== 'Done').length,
      completedToday: tasks.filter(t => t.status === 'Done' && new Date(t.updatedAt) >= startOfDay).length,
      overdue: tasks.filter(t => t.status === 'Overdue').length,
      sessionSeconds: totalSecondsToday
    };

    res.status(200).json({
      success: true,
      data: { stats, tasks, progressLogs, activeSession }
    });
  } catch (error) {
    next(error);
  }
};
