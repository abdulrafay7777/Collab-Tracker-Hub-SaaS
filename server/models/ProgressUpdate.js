import { Schema, model } from 'mongoose';

const progressUpdateSchema = new Schema({
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

export default model('ProgressUpdate', progressUpdateSchema);