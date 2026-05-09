const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Justification = require('../models/Justification');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/manager-tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
                            .populate('assignedBy', 'name role');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

router.post('/assign-task', async (req, res) => {
  try {
    const { title, description, employeeId, parentTaskId, deadline, priority } = req.body;
    const newTask = new Task({
      title,
      description,
      assignedBy: req.user._id,
      assignedTo: employeeId,
      parentTask: parentTaskId,
      deadline,
      priority
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign task' });
  }
});

// 3. View pending delay justifications from assigned Employees
router.get('/justifications', async (req, res) => {
  try {
    // In a real app, you'd filter by employees managed by this Senior
    const justifications = await Justification.find({ status: 'Pending' })
                                              .populate('employee', 'name')
                                              .populate('task', 'title');
    res.json(justifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching justifications' });
  }
});

// 4. Approve or reject delay justifications
router.put('/justification/:id/review', async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const justification = await Justification.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(justification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update justification status' });
  }
});

module.exports = router;