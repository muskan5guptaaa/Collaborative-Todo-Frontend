import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import Column from './Column';
import ActivityLog from './ActivityLog';

const socket = io('http://localhost:5000');
const columns = ['Todo', 'In Progress', 'Done'];

export default function Board() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [draggingTask, setDraggingTask] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });

useEffect(() => {
  fetchTasks();
  fetchLogs();

  const handleUpdate = () => {
    fetchTasks();
    fetchLogs();
  };

  socket.on('task-updated', handleUpdate);

  // only remove the listener, not disconnect socket
  return () => {
    socket.off('task-updated', handleUpdate);
  };
}, [tasks]);
  const fetchTasks = async () => {
    const res = await axios.get('/tasks');
    setTasks(res.data);
  };

  const fetchLogs = async () => {
    const res = await axios.get('/tasks/logs');
    setLogs(res.data.slice(0, 20));
  };

  const onDrop = async (status) => {
    if (!draggingTask || draggingTask.status === status) return;
    const res = await axios.put(`/tasks/${draggingTask._id}`, { ...draggingTask, status });
    setDraggingTask(null);
    socket.emit('task-updated', res.data);
  };

  const handleSmartAssign = async (taskId) => {
    await axios.post(`/tasks/smart-assign/${taskId}`);
    fetchTasks();
    socket.emit('task-updated');
  };

  const handleEdit = async (task) => {
    const updatedTitle = prompt('New title:', task.title);
    if (!updatedTitle || updatedTitle === task.title) return;

    const fresh = await axios.get('/tasks');
    const latest = fresh.data.find(t => t._id === task._id);

    if (latest.title !== task.title) {
      const choice = window.confirm('Conflict detected! Overwrite?');
      if (!choice) return;
    }

    const res = await axios.put(`/tasks/${task._id}`, { ...task, title: updatedTitle });
    socket.emit('task-updated', res.data);
  };

  const handleCreateTask = async () => {
    if (!newTask.title) return alert("Title is required.");
    await axios.post('/tasks', newTask);
    setNewTask({ title: '', description: '', priority: 'Medium' });
    setShowModal(false);
    fetchTasks();
    socket.emit('task-updated');
  };

  return (
    <div className="board">
      <header className="board-header">
        <h2>Welcome, {user.name}</h2>
        <div>
          <button onClick={() => setShowModal(true)}>➕ Add Task</button>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="columns">
        {columns.map((col) => (
          <Column
            key={col}
            title={col}
            tasks={tasks.filter(task => task.status === col)}
            onDrop={onDrop}
            onDragStart={setDraggingTask}
            onSmartAssign={handleSmartAssign}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <ActivityLog logs={logs} />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Task</h3>
            <input
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <div className="modal-actions">
              <button onClick={handleCreateTask}>Create</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

