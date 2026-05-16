const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const tasksController = require('../controllers/tasksController');
const teamController = require('../controllers/teamController');
const sessionsController = require('../controllers/sessionsController');
const progressController = require('../controllers/progressController');
const flagsController = require('../controllers/flagsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Dashboard
router.get('/dashboard', dashboardController.getDashboardData);

// Tasks
router.get('/tasks', tasksController.getTasks);
router.post('/tasks', tasksController.createTask);

// Team
router.get('/team', teamController.getTeamMembers);
router.get('/performance', teamController.getTeamPerformance);
router.get('/reports', teamController.getReports);

// Sessions
router.post('/session/toggle', sessionsController.toggleSession);
router.get('/sessions', sessionsController.getSessions);

// Progress
router.post('/progress', progressController.submitProgressUpdate);

// Flags
router.get('/flags', flagsController.getUserFlags);
router.post('/flag', flagsController.submitFlagDelay);
router.delete('/flag/:flagId', flagsController.deleteFlag);

module.exports = router;