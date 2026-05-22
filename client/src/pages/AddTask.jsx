// ============================================
// AddTask.jsx - Create a new task
// ============================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTask } from '../services/taskService';
import TaskForm from '../components/TaskForm';
import './TaskPage.css';

const AddTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      await createTask(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <span>/</span>
        <span>Add Task</span>
      </div>

      <div className="task-page-layout">
        {/* Form card */}
        <div className="task-page-card">
          <div className="task-page-header">
            <div className="task-page-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <div>
              <h1>Create New Task</h1>
              <p>Fill in the details below to add a task to your list</p>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <TaskForm
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Create Task"
          />
        </div>

        {/* Tips panel */}
        <div className="task-tips">
          <h3>💡 Tips for great tasks</h3>
          <ul>
            <li><strong>Be specific</strong> — Clear titles help you act immediately.</li>
            <li><strong>Set priority</strong> — Use High for urgent, Low for someday tasks.</li>
            <li><strong>Add a due date</strong> — Deadlines keep you accountable.</li>
            <li><strong>Describe it well</strong> — Add context so you know exactly what to do.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
