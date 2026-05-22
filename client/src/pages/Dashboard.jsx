// ============================================
// Dashboard.jsx - Main task management view
// Shows stats, search, filters, and task cards
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllTasks, getDashboardStats, filterTasks } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import './Dashboard.css';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`stat-card stat-card-${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-body">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, progress: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeFilter, setActiveFilter] = useState(null);
  const [activePriority, setActivePriority] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Detect URL filter params (from sidebar links)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    if (filter === 'completed') setActiveFilter(true);
    else if (filter === 'pending') setActiveFilter(false);
    else setActiveFilter(null);
  }, [location.search]);

  // Load tasks & stats
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksData, statsData] = await Promise.all([
        filterTasks(activeFilter, activePriority),
        getDashboardStats(),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, activePriority]);

  useEffect(() => {
    if (!isSearching) loadData();
  }, [loadData, isSearching]);

  // Task update handler
  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    getDashboardStats().then(setStats).catch(() => {});
  };

  // Task delete handler
  const handleTaskDelete = (deletedId) => {
    setTasks(prev => prev.filter(t => t.id !== deletedId));
    getDashboardStats().then(setStats).catch(() => {});
  };

  // Search handlers
  const handleSearchResults = (results) => {
    setIsSearching(true);
    setSearchResults(results);
  };

  const handleSearchClear = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  const displayedTasks = isSearching ? searchResults : tasks;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Good day, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="dashboard-subtitle">
            Here's what's on your plate today
          </p>
        </div>
        <Link to="/add-task" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Task
        </Link>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard
          label="Total Tasks" value={stats.total} color="blue"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
        />
        <StatCard
          label="Completed" value={stats.completed} color="green"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard
          label="Pending" value={stats.pending} color="orange"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard
          label="Progress" value={`${stats.progress}%`} color="purple"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
        />
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="progress-bar-container">
          <div className="progress-bar-header">
            <span>Overall Progress</span>
            <span>{stats.completed} of {stats.total} tasks done</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Search */}
      <div className="dashboard-search">
        <SearchBar onResults={handleSearchResults} onClear={handleSearchClear} />
      </div>

      {/* Filters */}
      {!isSearching && (
        <FilterPanel
          activeFilter={activeFilter}
          activePriority={activePriority}
          onFilterChange={setActiveFilter}
          onPriorityChange={setActivePriority}
        />
      )}

      {/* Task List */}
      <div className="tasks-section">
        <div className="tasks-section-header">
          <h2 className="tasks-section-title">
            {isSearching ? `Search Results` : 'Your Tasks'}
          </h2>
          <span className="tasks-count">{displayedTasks.length} task{displayedTasks.length !== 1 ? 's' : ''}</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="tasks-loading">
            <div className="spinner spinner-dark" />
            <p>Loading tasks...</p>
          </div>
        ) : displayedTasks.length === 0 ? (
          <div className="empty-state">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <h3>{isSearching ? 'No tasks found for your search' : 'No tasks yet'}</h3>
            <p>{isSearching ? 'Try a different keyword' : 'Create your first task to get started!'}</p>
            {!isSearching && (
              <Link to="/add-task" className="btn btn-primary" style={{ marginTop: 16 }}>
                + Add First Task
              </Link>
            )}
          </div>
        ) : (
          <div className="tasks-grid">
            {displayedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
