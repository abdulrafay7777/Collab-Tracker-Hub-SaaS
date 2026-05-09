const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/dashboard', workspaceController.getDashboardData);

router.post('/session/toggle', workspaceController.toggleSession);

router.post('/progress', workspaceController.submitProgressUpdate);
router.post('/flag', workspaceController.submitFlagDelay);

module.exports = router;