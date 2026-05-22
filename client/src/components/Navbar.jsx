// ============================================
// Navbar.jsx - Top navigation bar
// Shows logo, current user, and logout button
// ============================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get initials for avatar
  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">✦</span>
        <span className="navbar-title">Daily Task Tracker</span>
      </div>

      <div className="navbar-right">
        <Link to="/profile" className="navbar-user">
          <div className="avatar">{getInitials(user?.name)}</div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user?.name}</span>
            <span className="navbar-user-email">{user?.email}</span>
          </div>
        </Link>

        <button className="navbar-logout" onClick={handleLogout} title="Logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
