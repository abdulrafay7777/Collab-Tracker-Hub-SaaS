const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const flagDelaySchema = new Schema({
  userId: {
    type: String, // Accept string IDs (for mock/demo) or can be converted from ObjectId
    required: true
  },
  taskId: {
    type: String, // Accept string IDs (for mock/demo)
    default: null
  },
  reasonCategory: {
    type: String, // Accept any string for flexibility
    required: true
  },
  severityLevel: {
    type: String, // Accept any string (high, medium, low)
    required: true
  },
  explanation: {
    type: String,
    default: ''
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