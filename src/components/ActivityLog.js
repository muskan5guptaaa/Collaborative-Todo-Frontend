import React from 'react';

export default function ActivityLog({ logs }) {
  return (
    <aside className="activity-log">
      <h3>Activity Log</h3>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            <strong>{log.userId}</strong> {log.action} <em>{new Date(log.timestamp).toLocaleTimeString()}</em>
          </li>
        ))}
      </ul>
    </aside>
  );
}
