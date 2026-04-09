// const express = require('express');
// const router = express.Router();
// const {
//   getDashboardData,
//   toggleSession,
//   submitProgressUpdate,
//   submitFlagDelay
// } = require('../controllers/workspaceController');

// // GET: Fetch everything needed to paint the Workspace UI
// router.get('/', getDashboardData);

// // POST: Start/Stop the time tracker
// router.post('/session/toggle', toggleSession);

// // POST: Submit a manual progress update
// router.post('/progress', submitProgressUpdate);

// // POST: Submit an emergency blocker flag
// router.post('/flag', submitFlagDelay);

// module.exports = router;

const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');

// This makes the URL: http://localhost:5000/api/v1/workspace/dashboard
router.get('/dashboard', workspaceController.getDashboardData);

// This makes the URL: http://localhost:5000/api/v1/workspace/session/toggle
router.post('/session/toggle', workspaceController.toggleSession);

router.post('/progress', workspaceController.submitProgressUpdate);
router.post('/flag', workspaceController.submitFlagDelay);

module.exports = router;