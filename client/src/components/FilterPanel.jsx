// ============================================
// FilterPanel.jsx - Filter tasks by status / priority
// ============================================

import React from 'react';
import './FilterPanel.css';

const FilterPanel = ({ activeFilter, activePriority, onFilterChange, onPriorityChange }) => {
  const statusFilters = [
    { value: null, label: 'All Tasks' },
    { value: false, label: 'Pending' },
    { value: true, label: 'Completed' },
  ];

  const priorities = [
    { value: null, label: 'All' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  return (
    <div className="filter-panel">
      {/* Status filter */}
      <div className="filter-group">
        <span className="filter-group-label">Status</span>
        <div className="filter-chips">
          {statusFilters.map(f => (
            <button
              key={String(f.value)}
              className={`filter-chip ${activeFilter === f.value ? 'active' : ''}`}
              onClick={() => onFilterChange(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      {/* Priority filter */}
      <div className="filter-group">
        <span className="filter-group-label">Priority</span>
        <div className="filter-chips">
          {priorities.map(p => (
            <button
              key={String(p.value)}
              className={`filter-chip priority-chip-${(p.value || 'all').toLowerCase()} ${activePriority === p.value ? 'active' : ''}`}
              onClick={() => onPriorityChange(p.value)}
            >
              {p.value && <span className="filter-dot" />}
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
