const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    // These match the visual icons in your Figma design (play button, checkmark, etc.)
    enum: ['play', 'success', 'warning', 'info', 'error'], 
    default: 'info'
  }
}, { 
  timestamps: true 
});

// This is the crucial line that makes .find() and .create() work in your controller!
module.exports = mongoose.model('ProgressLog', progressLogSchema);