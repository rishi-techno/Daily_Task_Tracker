// ============================================
// authService.js - Handles authentication API calls
// ============================================

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth';

/**
 * Register a new user
 * @param {Object} data - { name, email, password }
 * @returns {Object} - { token, user, message }
 */
export const register = async (data) => {
  const response = await axios.post(`${BASE_URL}/register`, data);
  return response.data;
};

/**
 * Login an existing user
 * @param {Object} data - { email, password }
 * @returns {Object} - { token, user, message }
 */
export const login = async (data) => {
  const response = await axios.post(`${BASE_URL}/login`, data);
  return response.data;
};
