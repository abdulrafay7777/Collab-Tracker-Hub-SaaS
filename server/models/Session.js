const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String, // Accept string IDs (for mock/demo)
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null // Null means it's a general work session
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  durationSeconds: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);