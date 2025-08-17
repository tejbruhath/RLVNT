import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ResponsiveChatApp from './components/chat/ResponsiveChatApp';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

          return (
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="App">
              <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/chat" /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/chat" /> : <SignUp />} 
          />
                           <Route
                   path="/chat"
                   element={user ? <ResponsiveChatApp /> : <Navigate to="/login" />}
                 />
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
