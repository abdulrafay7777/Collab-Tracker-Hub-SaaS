const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const progressUpdateSchema = new Schema({
  userId: {
    type: String, // Accept string IDs (for mock/demo)
    required: true
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please describe what you accomplished'],
    trim: true
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  }
}, { timestamps: true });
 
module.exports = mongoose.models.ProgressUpdate || model('ProgressUpdate', progressUpdateSchema);