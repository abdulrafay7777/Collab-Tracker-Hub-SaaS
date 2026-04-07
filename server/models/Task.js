const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Task title is required'],
    trim: true
  },
  sprint: String,
  category: String, // e.g., 'Frontend', 'Backend', 'Docs'
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Done', 'Overdue'],
    default: 'Not Started'
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assignedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  dueDate: { 
    type: Date, 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Task', taskSchema);