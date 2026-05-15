const mongoose = require('mongoose');
const Task = require('../models/task.js');
const Session = require('../models/Session.js');
const FlagDelay = require('../models/FlagDelay.js');

/**
 * Create a new flag / delay
 */
exports.submitFlagDelay = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId, reasonCategory, severityLevel, explanation, proposedNewETA } = req.body;

    const flag = await FlagDelay.create({
      userId,
      taskId,
      reasonCategory,
      severityLevel,
      explanation,
      proposedNewETA
    });

    if (severityLevel === 'High/Blocker' && taskId) {
      await Task.findByIdAndUpdate(taskId, { status: 'Blocked' });

      const activeSession = await Session.findOne({ userId, taskId, isActive: true });
      if (activeSession) {
        activeSession.endTime = new Date();
        activeSession.isActive = false;
        activeSession.durationSeconds = Math.floor((activeSession.endTime - activeSession.startTime) / 1000);
        await activeSession.save();
      }
    }

    res.status(201).json({ success: true, data: flag });
  } catch (error) {
    next(error);
  }
};

/**
 * Get flags for current user
 */
exports.getUserFlags = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const flags = await FlagDelay.find({ userId })
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .lean();

    const transformedFlags = flags.map((flag) => ({
      id: flag._id.toString(),
      title: flag.reasonCategory,
      description: flag.explanation,
      severity: flag.severityLevel === 'High/Blocker' ? 'high' : flag.severityLevel === 'Medium' ? 'medium' : 'low',
      createdAt: flag.createdAt,
      dueDate: flag.createdAt,
      assignedTo: 'You',
      proposedNewETA: flag.proposedNewETA || null,
      taskId: flag.taskId?._id || null,
      taskTitle: flag.taskId?.title || 'Task'
    }));

    res.status(200).json(transformedFlags);
  } catch (error) {
    next(error);
  }
};
