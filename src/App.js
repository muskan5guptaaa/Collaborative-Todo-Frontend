import React, { useContext, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Board from './components/Board';
import { AuthContext, AuthProvider } from './context/AuthContext';

function AppContent() {
  const { user } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);

  if (!user) {
    return isRegister ? <Register onSwitch={() => setIsRegister(false)} /> : <Login onSwitch={() => setIsRegister(true)} />;
  }

  return <Board />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
