const Task = require('../models/task.js');
const ProgressUpdate = require('../models/ProgressUpdate.js');

/**
 * Submit a progress update on a task
 */
exports.submitProgressUpdate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId, content, completionPercentage } = req.body;

    const update = await ProgressUpdate.create({
      userId,
      taskId,
      content,
      completionPercentage
    });

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
