const Task = require('../models/task.js');
const ProgressLog = require('../models/ProgressLog.js');
const Session = require('../models/Session.js');
const ProgressUpdate = require('../models/ProgressUpdate.js');
const FlagDelay = require('../models/FlagDelay.js');

exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = '65fa1c2b8a4f2c001f3e4a99'; 
    
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
    const userId = '65fa1c2b8a4f2c001f3e4a99'; 
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
    const userId = '65fa1c2b8a4f2c001f3e4a99'; // Mock ID for now
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

exports.submitFlagDelay = async (req, res, next) => {
  try {
    const userId = '65fa1c2b8a4f2c001f3e4a99'; // Mock ID for now
    const { taskId, reasonCategory, severityLevel, explanation, proposedNewETA } = req.body;

    // 1. Create the Flag
    const flag = await FlagDelay.create({
      userId,
      taskId,
      reasonCategory,
      severityLevel,
      explanation,
      proposedNewETA
    });

    // 2. Smart Logic: If it's a High Blocker, auto-pause the task
    if (severityLevel === 'High/Blocker') {
      await Task.findByIdAndUpdate(taskId, { status: 'Blocked' });
      
      // Stop any active session on this task so they aren't logging dead time
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