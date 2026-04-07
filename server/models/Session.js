const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  isActive: { type: Boolean, default: true },
  durationSeconds: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);