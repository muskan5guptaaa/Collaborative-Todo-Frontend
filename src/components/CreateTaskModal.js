import React, { useState } from 'react';
import axios from '../api/axios';

export default function CreateTaskModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo'
  });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(''); // Clear previous errors
  try {
    const res = await axios.post('/tasks', form);
    onCreated(res.data); // update UI
    onClose();
  } catch (err) {
    setError(err.response?.data?.message || 'Error creating task');
  }
};


  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Create New Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
