// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const taskSchema = new Schema({
//   title: { 
//     type: String, 
//     required: [true, 'Task title is required'],
//     trim: true
//   },
//   sprint: String,
//   category: String,
//   status: {
//     type: String,
//     enum: ['Not Started', 'In Progress', 'Done', 'Overdue', 'Blocked'], // Added 'Blocked' for our Flag feature!
//     default: 'Not Started'
//   },
//   assignedTo: { 
//     type: Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true 
//   },
//   assignedBy: { 
//     type: Schema.Types.ObjectId, 
//     ref: 'User' 
//   },
//   dueDate: { 
//     type: Date, 
//     required: true 
//   },
//   progress: {
//     type: Number,
//     default: 0
//   }
// }, { 
//   timestamps: true 
// });

// module.exports = mongoose.model('Task', taskSchema);


const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Task title is required'],
    trim: true
  },
  description: String, 
  sprint: String,
  category: String,
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Done', 'Overdue', 'Blocked', 'Delayed'], 
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
  parentTask: {
    type: Schema.Types.ObjectId, 
    ref: 'Task', 
    default: null 
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