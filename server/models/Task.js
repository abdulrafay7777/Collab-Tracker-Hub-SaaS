const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Task title is required'],
    trim: true
  },
  sprint: String,
  category: String, // e.g., 'Frontend', 'Backend', 'Docs'
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Done', 'Overdue', 'Blocked'], // Added 'Blocked' for our Flag feature!
    default: 'Not Started'
  },
  assignedTo: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assignedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  progress: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Task', taskSchema);