const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

/**
 * Activity Routes
 * 
 * GET /api/activities/health - Health check
 * GET /api/activities/live - Get all live activities
 * GET /api/activities/stats - Get activity statistics
 */

router.get('/health', (req, res) => {
  console.log('✅ Health check endpoint called');
  res.json({ status: 'ok', message: 'Activity API is running' });
});
router.get('/live', activityController.getLiveActivities);
router.get('/stats', activityController.getActivityStats);

module.exports = router;
