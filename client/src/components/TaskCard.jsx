// ============================================
// TaskCard.jsx - Individual task card display
// Shows task info with edit, delete, complete buttons
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTask, updateTask } from '../services/taskService';
import './TaskCard.css';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Priority color mapping
  const priorityClass = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
  }[task.priority] || 'low';

  // Format due date nicely
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  // Toggle completion status
  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const updated = await updateTask(task.id, { ...task, completed: !task.completed });
      onUpdate(updated);
    } catch (err) {
      alert('Failed to update task status.');
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    try {
      await deleteTask(task.id);
      onDelete(task.id);
    } catch (err) {
      alert('Failed to delete task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`task-card priority-${priorityClass} ${task.completed ? 'completed' : ''}`}>
      {/* Priority stripe */}
      <div className={`task-stripe stripe-${priorityClass}`} />

      <div className="task-card-body">
        {/* Header row */}
        <div className="task-card-header">
          <div className="task-meta">
            <span className={`badge badge-${priorityClass}`}>{task.priority}</span>
            <span className={`badge ${task.completed ? 'badge-completed' : 'badge-pending'}`}>
              {task.completed ? '✓ Completed' : '● Pending'}
            </span>
          </div>

          {task.dueDate && (
            <span className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {isOverdue() ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`task-title ${task.completed ? 'task-title-done' : ''}`}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {/* Actions */}
        <div className="task-actions">
          <button
            className={`btn btn-sm ${task.completed ? 'btn-secondary' : 'btn-success'}`}
            onClick={handleToggleComplete}
            disabled={loading}
          >
            {task.completed ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.96"/>
                </svg>
                Mark Pending
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Complete
              </>
            )}
          </button>

          <button
            className="btn btn-sm btn-secondary"
            onClick={() => navigate(`/edit-task/${task.id}`)}
            disabled={loading}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
