import React from 'react';

export default function TaskCard({ task, onDragStart, onSmartAssign, onEdit }) {
  return (
    <div
      className="task-card"
      draggable
      onDragStart={() => onDragStart(task)} // sets the dragging task in parent
    >
      <strong>{task.title}</strong>
      <p>{task.description}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Assigned to:</strong> {task.assignedTo?.name || 'Unassigned'}</p>

      <button onClick={() => onEdit(task)}>✏️</button>
      <button onClick={() => onSmartAssign(task._id)}>🎯 Smart Assign</button>
    </div>
  );
}

