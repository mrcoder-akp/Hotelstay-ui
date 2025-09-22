// API Configuration
// Use environment variable if available, otherwise use localhost
const getApiUrl = () => {
  // Check for Vite environment variable
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Fallback to localhost
  return 'http://localhost:5000';
};

const baseUrl = getApiUrl();

const API_CONFIG = {
  BASE_URL: baseUrl,
  API_URL: `${baseUrl}/api`,
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth header
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to build API URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.API_URL}${endpoint}`;
};

export default API_CONFIG;