const mongoose = require('mongoose');
const Task = require('../models/task.js');
const Session = require('../models/Session.js');
const FlagDelay = require('../models/FlagDelay.js');

/**
 * Create a new flag / delay
 */
exports.submitFlagDelay = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { taskId, reasonCategory, severityLevel, explanation, proposedNewETA } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    if (!reasonCategory || !severityLevel) {
      return res.status(400).json({ success: false, message: 'reasonCategory and severityLevel are required' });
    }

    console.log('[FLAGS] Creating flag for userId:', userId, { reasonCategory, severityLevel, taskId });

    // Normalize severity level to match DB format
    const severityMap = {
      'high': 'High/Blocker',
      'medium': 'Medium',
      'low': 'Low',
      'High/Blocker': 'High/Blocker',
      'Medium': 'Medium',
      'Low': 'Low'
    };
    const normalizedSeverity = severityMap[severityLevel] || severityLevel;

    const flag = await FlagDelay.create({
      userId,
      taskId: taskId || null,
      reasonCategory,
      severityLevel: normalizedSeverity,
      explanation: explanation || '',
      proposedNewETA: proposedNewETA || null
    });

    console.log('[FLAGS] Flag created:', flag._id);

    // If high severity and taskId provided, auto-pause task
    if ((normalizedSeverity === 'High/Blocker' || severityLevel === 'high') && taskId) {
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
    console.error('[FLAGS] Error creating flag:', error.message, error.stack);
    next(error);
  }
};

/**
 * Delete a flag
 */
exports.deleteFlag = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { flagId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    console.log('[FLAGS] Deleting flag:', flagId, 'for user:', userId);

    const flag = await FlagDelay.findByIdAndDelete(flagId);

    if (!flag) {
      return res.status(404).json({ success: false, message: 'Flag not found' });
    }

    res.status(200).json({ success: true, message: 'Flag deleted' });
  } catch (error) {
    console.error('[FLAGS] Error deleting flag:', error.message, error.stack);
    next(error);
  }
};
exports.getUserFlags = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      console.error('[FLAGS] No userId found in request:', req.user);
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    console.log('[FLAGS] Fetching flags for userId:', userId);

    const flags = await FlagDelay.find({ userId })
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .lean();

    console.log('[FLAGS] Found', flags.length, 'flags for user');

    const transformedFlags = flags.map((flag) => {
      try {
        // Normalize severity to lowercase for frontend
        let severity = 'low';
        if (flag.severityLevel) {
          const sev = flag.severityLevel.toLowerCase();
          if (sev.includes('high') || sev.includes('blocker')) severity = 'high';
          else if (sev.includes('medium')) severity = 'medium';
          else severity = 'low';
        }

        return {
          id: flag._id?.toString() || flag._id,
          title: flag.reasonCategory || 'Flag',
          description: flag.explanation || '',
          severity,
          createdAt: flag.createdAt,
          dueDate: flag.createdAt,
          assignedTo: 'You',
          proposedNewETA: flag.proposedNewETA || null,
          taskId: flag.taskId || null,
          taskTitle: flag.taskId?.title || 'Task'
        };
      } catch (mapErr) {
        console.error('[FLAGS] Error mapping flag:', flag, mapErr);
        throw mapErr;
      }
    });

    res.status(200).json(transformedFlags);
  } catch (error) {
    console.error('[FLAGS] Error fetching flags:', error.message, error.stack);
    next(error);
  }
};
