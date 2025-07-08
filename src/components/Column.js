import React from 'react';
import TaskCard from './TaskCard';

export default function Column({ title, tasks, onDrop, onDragStart, onSmartAssign, onEdit }) {
  return (
    <div
      className="column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(title)}
    >
      <h3>{title}</h3>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onDragStart={onDragStart}
          onSmartAssign={onSmartAssign}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
