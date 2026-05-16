const Session = require('../models/Session.js');
const ProgressLog = require('../models/ProgressLog.js');

/**
 * Get all sessions for current user
 */
exports.getSessions = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    console.log('[SESSIONS] Fetching sessions for userId:', userId);

    const sessions = await Session.find({ userId })
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .lean();

    const transformedSessions = sessions.map((session, index) => ({
      id: session._id?.toString() || session._id,
      date: new Date(session.startTime).toLocaleDateString(),
      startTime: new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: session.endTime ? new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In Progress',
      duration: session.durationSeconds 
        ? `${Math.floor(session.durationSeconds / 3600)}h ${Math.floor((session.durationSeconds % 3600) / 60)}m`
        : 'Active',
      task: session.taskId?.title || 'General Work',
      type: session.isActive ? 'active' : 'completed',
      isActive: session.isActive,
      durationSeconds: session.durationSeconds || 0
    }));

    res.status(200).json(transformedSessions);
  } catch (error) {
    console.error('[SESSIONS] Error fetching sessions:', error);
    next(error);
  }
};

/**
 * Toggle work session on/off
 */
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
      // START NEW SESSION - Race condition check
      const checkDouble = await Session.findOne({ userId, isActive: true });
      if (checkDouble) {
        return res.status(400).json({ success: false, message: 'A session is already active' });
      }

      const safeTaskId = taskId || null;
      const newSession = await Session.create({ userId, taskId: safeTaskId, startTime: new Date() });

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
