// ============================================
// EditTask.jsx - Edit an existing task
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAllTasks, updateTask } from '../services/taskService';
import TaskForm from '../components/TaskForm';
import './TaskPage.css';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch task data by ID
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const tasks = await getAllTasks();
        const found = tasks.find(t => t.id === parseInt(id));
        if (!found) { setError('Task not found.'); return; }
        // Format dueDate for date input
        // BUG FIX #3: Backend returns dueDate as LocalDate array [year,month,day]
        // or ISO string "2025-12-31". Normalize both to "YYYY-MM-DD" for the date input.
        if (found.dueDate) {
          if (Array.isArray(found.dueDate)) {
            const [y, m, d] = found.dueDate;
            found.dueDate = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          } else {
            found.dueDate = String(found.dueDate).split('T')[0];
          }
        }
        setTask(found);
      } catch (err) {
        setError('Failed to load task data.');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      await updateTask(parseInt(id), formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task. Please try again.');
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page-container">
        <div className="tasks-loading">
          <div className="spinner spinner-dark" />
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <span>/</span>
        <span>Edit Task</span>
      </div>

      <div className="task-page-layout">
        <div className="task-page-card">
          <div className="task-page-header">
            <div className="task-page-icon edit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div>
              <h1>Edit Task</h1>
              <p>Update the task details below</p>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {task && (
            <TaskForm
              initialValues={task}
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel="Save Changes"
            />
          )}
        </div>

        <div className="task-tips">
          <h3>✏️ Editing tips</h3>
          <ul>
            <li><strong>Update priority</strong> — Reprioritize if things have changed.</li>
            <li><strong>Extend due date</strong> — Adjust if you need more time.</li>
            <li><strong>Mark complete</strong> — Check the box when you're done!</li>
            <li><strong>Refine description</strong> — Add notes as the task evolves.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
