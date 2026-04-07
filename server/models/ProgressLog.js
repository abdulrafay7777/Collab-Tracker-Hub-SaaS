const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['success', 'play', 'warning', 'info'],
    default: 'info'
  }
}, { 
  timestamps: true 
});

// Index to quickly fetch a user's logs in descending order
progressLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ProgressLog', progressLogSchema);