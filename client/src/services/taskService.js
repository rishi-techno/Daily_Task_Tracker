// ============================================
// taskService.js - Handles all task-related API calls
// ============================================

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/tasks';

/**
 * Create axios instance with JWT auth header
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

/**
 * Fetch all tasks for the logged-in user
 */
export const getAllTasks = async () => {
  const response = await axios.get(BASE_URL, getAuthHeaders());
  return response.data;
};

/**
 * Create a new task
 * @param {Object} taskData - { title, description, priority, dueDate }
 */
export const createTask = async (taskData) => {
  const response = await axios.post(BASE_URL, taskData, getAuthHeaders());
  return response.data;
};

/**
 * Update an existing task by ID
 * @param {number} id - Task ID
 * @param {Object} taskData - Updated task fields
 */
export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, taskData, getAuthHeaders());
  return response.data;
};

/**
 * Delete a task by ID
 * @param {number} id - Task ID
 */
export const deleteTask = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, getAuthHeaders());
  return response.data;
};

/**
 * Search tasks by keyword in title
 * @param {string} keyword - Search term
 */
export const searchTasks = async (keyword) => {
  const response = await axios.get(`${BASE_URL}/search?keyword=${keyword}`, getAuthHeaders());
  return response.data;
};

/**
 * Filter tasks by completion status and/or priority
 * @param {boolean|null} completed - Filter by status
 * @param {string|null} priority   - Filter by priority (HIGH, MEDIUM, LOW)
 */
export const filterTasks = async (completed, priority) => {
  let url = `${BASE_URL}/filter?`;
  if (completed !== null && completed !== undefined) url += `completed=${completed}&`;
  if (priority) url += `priority=${priority}`;

  const response = await axios.get(url, getAuthHeaders());
  return response.data;
};

/**
 * Fetch dashboard statistics (total, completed, pending, progress)
 */
export const getDashboardStats = async () => {
  const response = await axios.get(`${BASE_URL}/stats`, getAuthHeaders());
  return response.data;
};
