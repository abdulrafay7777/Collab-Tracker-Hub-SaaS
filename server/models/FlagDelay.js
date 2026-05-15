const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const flagDelaySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  reasonCategory: {
    type: String,
    enum: ['Technical Blocker', 'Waiting on 3rd Party', 'Scope Creep', 'Personal Emergency', 'Other'],
    required: true
  },
  severityLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High/Blocker'],
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  proposedNewETA: {
    type: Date
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.models.FlagDelay || model('FlagDelay', flagDelaySchema);