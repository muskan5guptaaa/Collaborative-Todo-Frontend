import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://collaborative-todo-backend-1.onrender.com';

export default function useSocket(eventHandlers = {}) {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to socket server
    socketRef.current = io(SOCKET_URL);

    // Attach event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socketRef.current.on(event, handler);
    });

    return () => {
      // Cleanup listeners and disconnect on unmount
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socketRef.current.off(event, handler);
      });
      socketRef.current.disconnect();
    };
  }, []);

  // Expose socket instance for emitting events
  return socketRef.current;
}
