const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const flagsController = require('../controllers/flagsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/dashboard', workspaceController.getDashboardData);

router.get('/tasks', workspaceController.getTasks);
router.post('/tasks', workspaceController.createTask);

router.get('/team', workspaceController.getTeamMembers);
router.get('/performance', workspaceController.getTeamPerformance);
router.get('/reports', workspaceController.getReports);

router.post('/session/toggle', workspaceController.toggleSession);

router.post('/progress', workspaceController.submitProgressUpdate);

router.get('/flags', flagsController.getUserFlags);
router.post('/flag', flagsController.submitFlagDelay);

module.exports = router;