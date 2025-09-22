
const getApiUrl = () => {
  
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  return 'https://hotelstay-ov1p.onrender.com';
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

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.API_URL}${endpoint}`;
};

export default API_CONFIG;