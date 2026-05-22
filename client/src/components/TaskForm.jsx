// ============================================
// TaskForm.jsx - Reusable form for Add / Edit task
// ============================================

import React, { useState } from 'react';
import './TaskForm.css';

const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];

const TaskForm = ({ initialValues = {}, onSubmit, loading, submitLabel = 'Save Task' }) => {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    priority: initialValues.priority || 'MEDIUM',
    dueDate: initialValues.dueDate || '',
    completed: initialValues.completed || false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (form.title.trim().length > 100) newErrors.title = 'Title must be under 100 characters.';
    if (!form.priority) newErrors.priority = 'Priority is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // BUG FIX: Send null for empty dueDate — backend LocalDate cannot
    // deserialize an empty string "" and throws a 400 error.
    const payload = {
      ...form,
      dueDate: form.dueDate || null,
    };
    onSubmit(payload);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="form-group">
        <label className="form-label">Task Title *</label>
        <input
          type="text"
          name="title"
          className={`form-control ${errors.title ? 'error' : ''}`}
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange}
          maxLength={100}
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          placeholder="Add more details about this task..."
          value={form.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      {/* Priority + Due Date row */}
      <div className="task-form-row">
        <div className="form-group">
          <label className="form-label">Priority *</label>
          <div className="priority-selector">
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                className={`priority-btn priority-btn-${p.toLowerCase()} ${form.priority === p ? 'selected' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, priority: p }))}
              >
                <span className="priority-dot" />
                {p}
              </button>
            ))}
          </div>
          {errors.priority && <p className="form-error">{errors.priority}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            name="dueDate"
            className="form-control"
            value={form.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Completed toggle (only show on edit) */}
      {initialValues.id && (
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
            />
            <span>Mark as completed</span>
          </label>
        </div>
      )}

      {/* Submit */}
      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
        {loading ? (
          <><div className="spinner" /> Saving...</>
        ) : (
          <>{submitLabel}</>
        )}
      </button>
    </form>
  );
};

export default TaskForm;
