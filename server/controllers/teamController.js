const Task = require('../models/task.js');
const Session = require('../models/Session.js');
const { generateTeamMemberName, generateTeamMemberRole } = require('../utils/helpers');

/**
 * Get team members with task counts
 */
exports.getTeamMembers = async (req, res, next) => {
  try {
    const teamMembers = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          taskCount: { $sum: 1 },
          activeTasks: {
            $sum: {
              $cond: [{ $ne: ['$status', 'Done'] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'userId',
          as: 'sessions'
        }
      },
      { $sort: { taskCount: -1 } }
    ]);

    const members = teamMembers.map((member, index) => ({
      _id: member._id,
      name: generateTeamMemberName(index),
      role: generateTeamMemberRole(index),
      email: `team.member.${index}@company.com`,
      status: member.activeTasks > 0 ? 'active' : 'inactive',
      tasks: member.activeTasks,
      totalTasks: member.taskCount
    }));

    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    next(error);
  }
};

/**
 * Get team performance metrics
 */
exports.getTeamPerformance = async (req, res, next) => {
  try {
    const teamStats = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Done'] }, 1, 0] }
          },
          onTimeTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', 'Done'] },
                    { $lte: ['$updatedAt', '$dueDate'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const performance = teamStats.map((stat, index) => {
      const completionRate = stat.totalTasks > 0 ? (stat.completedTasks / stat.totalTasks * 100) : 0;
      const onTimeRate = stat.completedTasks > 0 ? (stat.onTimeTasks / stat.completedTasks * 100) : 100;
      const score = Math.round((completionRate * 0.6 + onTimeRate * 0.4));

      return {
        _id: stat._id,
        name: generateTeamMemberName(index),
        score: Math.max(50, Math.min(100, score)),
        completionRate: Math.round(completionRate),
        onTimeRate: Math.round(onTimeRate),
        trend: score > 85 ? 'up' : score > 70 ? 'stable' : 'down'
      };
    });

    const totalTasks = teamStats.reduce((sum, s) => sum + s.totalTasks, 0);
    const completedTasks = teamStats.reduce((sum, s) => sum + s.completedTasks, 0);
    const teamEfficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const onTimeDelivery = completedTasks > 0
      ? Math.round((teamStats.reduce((sum, s) => sum + s.onTimeTasks, 0) / completedTasks) * 100)
      : 100;

    res.status(200).json({
      teamEfficiency,
      completedTasks,
      onTimeDelivery,
      members: performance
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    next(error);
  }
};

/**
 * Get manager reports
 */
exports.getReports = async (req, res, next) => {
  try {
    const [taskStats, sessionStats] = await Promise.all([
      Task.countDocuments(),
      Session.countDocuments()
    ]);

    const now = new Date();
    const reports = [
      {
        _id: '1',
        title: 'Monthly Performance Report',
        date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
        type: 'Performance',
        generatedAt: now
      },
      {
        _id: '2',
        title: 'Team Productivity Analysis',
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'Analytics',
        generatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        _id: '3',
        title: 'Task Completion Summary',
        date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'Summary',
        generatedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      }
    ];

    res.status(200).json({
      reportsGenerated: taskStats + sessionStats,
      lastGenerated: now.toISOString().split('T')[0],
      reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    next(error);
  }
};
