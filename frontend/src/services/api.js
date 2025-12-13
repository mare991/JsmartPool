// API service for connecting to Flask backend
// Update the baseURL if your Flask server runs on a different port or host

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://168.119.175.54:5000';

/**
 * Generic fetch wrapper for API calls
 */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

/**
 * GET request
 */
export const get = (endpoint) => {
  return apiCall(endpoint, {
    method: 'GET',
  });
};

/**
 * POST request
 */
export const post = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT request
 */
export const put = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 */
export const del = (endpoint) => {
  return apiCall(endpoint, {
    method: 'DELETE',
  });
};

export default {
  get,
  post,
  put,
  delete: del,
};


