import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeniorDashboard = () => {
  const [managerTasks, setManagerTasks] = useState([]);
  const [justifications, setJustifications] = useState([]);
  const [employees, setEmployees] = useState([]); // Assume fetched from an org chart endpoint
  
  // Form state for assigning tasks
  const [newTask, setNewTask] = useState({ title: '', employeeId: '', parentTaskId: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Note: In production, include JWT headers via an axios interceptor
    const [tasksRes, justRes] = await Promise.all([
      axios.get('/api/senior/manager-tasks'),
      axios.get('/api/senior/justifications')
    ]);
    setManagerTasks(tasksRes.data);
    setJustifications(justRes.data);
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/senior/assign-task', newTask);
      alert('Task successfully assigned to employee!');
      setNewTask({ title: '', employeeId: '', parentTaskId: '' });
    } catch (error) {
      console.error('Error assigning task');
    }
  };

  const handleJustificationReview = async (id, status) => {
    try {
      await axios.put(`/api/senior/justification/${id}/review`, { status });
      // Remove from pending list
      setJustifications(justifications.filter(j => j._id !== id));
    } catch (error) {
      console.error('Error updating justification');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Senior Employee Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* View Manager-Assigned Tasks */}
        <section className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">Tasks from Managers</h2>
          <ul>
            {managerTasks.map(task => (
              <li key={task._id} className="mb-3 p-3 bg-gray-50 rounded border">
                <strong>{task.title}</strong> - Priority: {task.priority}
                <div className="text-sm text-gray-600">Deadline: {new Date(task.deadline).toLocaleDateString()}</div>
              </li>
            ))}
            {managerTasks.length === 0 && <p>No tasks currently assigned.</p>}
          </ul>
        </section>

        {/* Distribute Tasks to Employees */}
        <section className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">Assign Task to Employee</h2>
          <form onSubmit={handleAssignTask} className="flex flex-col gap-3">
            <select 
              required
              className="border p-2 rounded"
              value={newTask.parentTaskId} 
              onChange={e => setNewTask({...newTask, parentTaskId: e.target.value})}
            >
              <option value="">Select Parent Task (From Manager)...</option>
              {managerTasks.map(task => (
                <option key={task._id} value={task._id}>{task.title}</option>
              ))}
            </select>
            
            <input 
              type="text" 
              placeholder="Sub-task Title" 
              className="border p-2 rounded"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              required 
            />

            <select 
              required
              className="border p-2 rounded"
              value={newTask.employeeId} 
              onChange={e => setNewTask({...newTask, employeeId: e.target.value})}
            >
              <option value="">Select Employee...</option>
              {/* Dummy data for illustration, normally mapped from employees state */}
              <option value="emp123">John Doe (Employee)</option>
              <option value="emp456">Jane Smith (Employee)</option>
            </select>

            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Assign Task
            </button>
          </form>
        </section>

        {/* Handle Delay Justifications */}
        <section className="bg-white p-4 shadow rounded md:col-span-2">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">Pending Delay Justifications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Employee</th>
                  <th className="p-2 border">Task</th>
                  <th className="p-2 border">Reason</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {justifications.map(just => (
                  <tr key={just._id}>
                    <td className="p-2 border">{just.employee.name}</td>
                    <td className="p-2 border">{just.task.title}</td>
                    <td className="p-2 border">{just.reason}</td>
                    <td className="p-2 border flex gap-2">
                      <button 
                        onClick={() => handleJustificationReview(just._id, 'Approved')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleJustificationReview(just._id, 'Rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {justifications.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">No pending justifications.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeniorDashboard;