
const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');

router.get('/', workspaceController.getDashboardData);
router.post('/session/toggle', workspaceController.toggleSession); // New route

module.exports = router;