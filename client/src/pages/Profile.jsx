// ============================================
// Profile.jsx - View user profile and stats
// ============================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/taskService';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, progress: 0 });

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="page-container">
      <h1 className="dashboard-title" style={{ marginBottom: 24 }}>My Profile</h1>

      <div className="profile-layout">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{getInitials(user?.name)}</div>
          </div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-joined">Member since {joinedDate}</p>

          <hr className="divider" />

          {/* Stats inside profile */}
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-val">{stats.total}</span>
              <span className="profile-stat-label">Total Tasks</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-val">{stats.completed}</span>
              <span className="profile-stat-label">Completed</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-val">{stats.pending}</span>
              <span className="profile-stat-label">Pending</span>
            </div>
          </div>

          <hr className="divider" />

          {/* Progress ring */}
          <div className="profile-progress">
            <div className="profile-progress-label">
              <span>Completion Rate</span>
              <strong>{stats.progress}%</strong>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${stats.progress}%` }} />
            </div>
          </div>

          <hr className="divider" />

          {/* Logout */}
          <button className="btn btn-danger btn-block" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              /* BUG FIX #5: corrected arc flag from 0 to 1 in logout SVG path */
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>

        {/* Account Info */}
        <div className="profile-info">
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="profile-section-title">Account Information</h3>
            <div className="profile-info-rows">
              <div className="profile-info-row">
                <span className="profile-info-key">Full Name</span>
                <span className="profile-info-val">{user?.name}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-key">Email Address</span>
                <span className="profile-info-val">{user?.email}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-key">Member Since</span>
                <span className="profile-info-val">{joinedDate}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-key">Account Status</span>
                <span className="badge badge-completed">Active</span>
              </div>
            </div>
          </div>

          {/* Task Summary card */}
          <div className="card">
            <h3 className="profile-section-title">Task Summary</h3>
            <div className="profile-summary-grid">
              <div className="profile-summary-item summary-total">
                <span className="summary-val">{stats.total}</span>
                <span className="summary-label">Total Created</span>
              </div>
              <div className="profile-summary-item summary-done">
                <span className="summary-val">{stats.completed}</span>
                <span className="summary-label">Completed</span>
              </div>
              <div className="profile-summary-item summary-pending">
                <span className="summary-val">{stats.pending}</span>
                <span className="summary-label">In Progress</span>
              </div>
              <div className="profile-summary-item summary-progress">
                <span className="summary-val">{stats.progress}%</span>
                <span className="summary-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
