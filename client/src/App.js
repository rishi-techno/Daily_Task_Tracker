// ============================================
// App.js - Root component with routing setup
// ============================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import Profile from './pages/Profile';

// Layout
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

/**
 * ProtectedRoute - Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner spinner-dark" /></div>;
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

/**
 * AppLayout - Shared layout with Navbar + Sidebar for authenticated pages
 */
const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      {children}
    </div>
  </div>
);

/**
 * Main App with all routes
 */
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/add-task" element={
          <ProtectedRoute>
            <AppLayout><AddTask /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/edit-task/:id" element={
          <ProtectedRoute>
            <AppLayout><EditTask /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout><Profile /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
