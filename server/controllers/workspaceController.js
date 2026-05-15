const mongoose = require('mongoose');
const Task = require('../models/task.js');
const ProgressLog = require('../models/ProgressLog.js');
const Session = require('../models/Session.js');
const ProgressUpdate = require('../models/ProgressUpdate.js');
// Flag related logic moved to server/controllers/flagsController.js

exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    
    // 1. Timezone Fix: Accept client's local midnight, fallback to server midnight
    const startOfDay = req.query.startOfDay ? new Date(req.query.startOfDay) : new Date();
    if (!req.query.startOfDay) startOfDay.setHours(0, 0, 0, 0);

    // Fetch all data concurrently using the proper Model.method() syntax
    const [tasks, progressLogs, activeSession, todaysSessions] = await Promise.all([
      Task.find({ assignedTo: userId }).sort({ dueDate: 1 }),
      ProgressLog.find({ userId }).sort({ createdAt: -1 }).limit(10),
      Session.findOne({ userId, isActive: true }),
      
      // 2. Midnight Crossing Fix: Check updatedAt so sessions spanning midnight are counted
      Session.find({ userId, isActive: false, updatedAt: { $gte: startOfDay } }) 
    ]);

    // Sum up the duration of all completed sessions today
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

exports.toggleSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.body;

    const activeSession = await Session.findOne({ userId, isActive: true });

    if (activeSession) {
      // STOP CURRENT SESSION
      activeSession.endTime = new Date();
      activeSession.isActive = false;
      activeSession.durationSeconds = Math.floor((activeSession.endTime - activeSession.startTime) / 1000);
      await activeSession.save();

      await ProgressLog.create({
        userId, 
        taskId: activeSession.taskId, 
        title: `Ended work session (${Math.floor(activeSession.durationSeconds / 60)} mins)`, 
        type: 'success'
      });

      return res.status(200).json({ success: true, message: 'Session stopped', session: activeSession });
      
    } else {
      // START NEW SESSION
      
      // 3. Race Condition Fix: Double check right before creation
      const checkDouble = await Session.findOne({ userId, isActive: true });
      if (checkDouble) {
        return res.status(400).json({ success: false, message: 'A session is already active' });
      }

      // If no taskId is provided, explicitly set to null
      const safeTaskId = taskId || null;

      const newSession = await Session.create({ 
        userId, 
        taskId: safeTaskId, 
        startTime: new Date() 
      });
      
      await ProgressLog.create({
        userId, 
        taskId: safeTaskId, 
        title: 'Started work session', 
        type: 'play'
      });

      return res.status(200).json({ success: true, message: 'Session started', session: newSession });
    }
  } catch (error) {
    next(error);
  }
};

exports.submitProgressUpdate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId, content, completionPercentage } = req.body;

    // 1. Save the new update
    const update = await ProgressUpdate.create({
      userId,
      taskId,
      content,
      completionPercentage
    });

    // 2. Automatically update the parent task's progress
    const task = await Task.findById(taskId);
    if (task) {
      task.progress = completionPercentage;
      if (completionPercentage === 100) {
        task.status = 'Done';
      } else if (task.status === 'Not Started' && completionPercentage > 0) {
        task.status = 'In Progress';
      }
      await task.save();
    }

    res.status(201).json({ success: true, data: update });
  } catch (error) {
    next(error);
  }
};


/**
 * Get all flags for the current user
 */
// Flag handlers extracted to flagsController.js for clarity and maintainability

/**
 * Get all tasks with team member names
 */
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .lean();
    
    // Build team member name map from all unique assignees
    const teamStats = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 }
        }
      }
    ]);

    // Create a name map for all assigned members
    const nameMap = {};
    teamStats.forEach((stat, index) => {
      const id = stat._id.toString();
      nameMap[id] = generateTeamMemberName(index);
    });

    // Add assignedToName to each task
    const tasksWithNames = tasks.map((task, index) => ({
      ...task,
      assignedToName: task.assignedTo ? (nameMap[task.assignedTo.toString()] || generateTeamMemberName(index)) : 'Unassigned',
      assignedToId: task.assignedTo
    }));

    res.status(200).json(tasksWithNames);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    next(error);
  }
};

/**
 * Create a new task
 */
exports.createTask = async (req, res, next) => {
  try {
    const { title, assignedTo, status, priority, dueDate, team } = req.body;

    // Validate required fields
    if (!title || !dueDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and due date are required' 
      });
    }

    // Normalize status from frontend format to schema format
    const statusMap = {
      'pending': 'Not Started',
      'in_progress': 'In Progress',
      'completed': 'Done',
      'overdue': 'Overdue',
      'blocked': 'Blocked',
      'delayed': 'Delayed',
      'not started': 'Not Started',
      'in progress': 'In Progress',
      'done': 'Done'
    };

    // Normalize priority from frontend format to schema format
    const priorityMap = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High'
    };

    const normalizedStatus = statusMap[status?.toLowerCase()] || 'Not Started';
    const normalizedPriority = priorityMap[priority?.toLowerCase()] || 'Medium';

    // Create valid ObjectId for assignedTo
    let assignedToId = new mongoose.Types.ObjectId();

    const newTask = await Task.create({
      title,
      assignedTo: assignedToId,
      status: normalizedStatus,
      priority: normalizedPriority,
      dueDate: new Date(dueDate),
      category: team || 'General',
      assignedBy: new mongoose.Types.ObjectId()
    });

    res.status(201).json({ 
      success: true, 
      message: 'Task created successfully',
      data: newTask 
    });
  } catch (error) {
    console.error('Error creating task:', error.message);
    next(error);
  }
};

/**
 * Get team members (for manager dashboard)
 */
exports.getTeamMembers = async (req, res, next) => {
  try {
    // Get all unique assignees with their task counts
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
      {
        $sort: { taskCount: -1 }
      }
    ]);

    // Map to a more user-friendly format
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
    // Get performance data from tasks and sessions
    const teamStats = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Done'] }, 1, 0]
            }
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

    // Calculate performance scores
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

    // Calculate aggregate metrics
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
    // Get task and session statistics
    const [taskStats, sessionStats] = await Promise.all([
      Task.countDocuments(),
      Session.countDocuments()
    ]);

    // Generate reports based on timestamps
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

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

/**
 * Helper functions for demo data
 */
function generateTeamMemberName(index) {
  const names = [
    'John Developer', 'Sarah Designer', 'Mike QA', 'Alice Frontend',
    'Bob Backend', 'Carol DevOps', 'Dave Security', 'Emma Product'
  ];
  return names[index % names.length];
}

function generateTeamMemberRole(index) {
  const roles = [
    'Senior Developer', 'UI/UX Designer', 'QA Engineer', 'Frontend Engineer',
    'Backend Engineer', 'DevOps Engineer', 'Security Engineer', 'Product Manager'
  ];
  return roles[index % roles.length];
}