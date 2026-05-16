const mongoose = require('mongoose');
const Task = require('../models/task.js');
const { generateTeamMemberName } = require('../utils/helpers');

/**
 * Get all tasks with team member names
 */
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }).lean();

    const teamStats = await Task.aggregate([
      { $group: { _id: '$assignedTo', totalTasks: { $sum: 1 } } }
    ]);

    const nameMap = {};
    teamStats.forEach((stat, index) => {
      const id = stat._id.toString();
      nameMap[id] = generateTeamMemberName(index);
    });

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

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Title and due date are required'
      });
    }

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

    const priorityMap = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High'
    };

    const normalizedStatus = statusMap[status?.toLowerCase()] || 'Not Started';
    const normalizedPriority = priorityMap[priority?.toLowerCase()] || 'Medium';
    const assignedToId = new mongoose.Types.ObjectId();

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
