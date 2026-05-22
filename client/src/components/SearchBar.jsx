// ============================================
// SearchBar.jsx - Real-time task search input
// ============================================

import React, { useState, useCallback } from 'react';
import { searchTasks } from '../services/taskService';
import './SearchBar.css';

const SearchBar = ({ onResults, onClear }) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  // Debounced search handler
  const handleSearch = useCallback(async (value) => {
    if (!value.trim()) {
      onClear();
      return;
    }
    setSearching(true);
    try {
      const results = await searchTasks(value.trim());
      onResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  }, [onResults, onClear]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    // Debounce: wait 400ms after user stops typing
    clearTimeout(window._searchTimeout);
    window._searchTimeout = setTimeout(() => handleSearch(val), 400);
  };

  const handleClear = () => {
    setQuery('');
    clearTimeout(window._searchTimeout);
    onClear();
  };

  return (
    <div className="searchbar">
      <div className="searchbar-icon">
        {searching ? (
          <div className="spinner spinner-dark" style={{ width: 16, height: 16 }} />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        )}
      </div>

      <input
        type="text"
        className="searchbar-input"
        placeholder="Search tasks by title..."
        value={query}
        onChange={handleChange}
      />

      {query && (
        <button className="searchbar-clear" onClick={handleClear} title="Clear search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
