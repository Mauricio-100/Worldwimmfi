import axios from 'axios';

const API_BASE_URL = 'https://sarver-fullstack-4.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor pour ajouter le token JWT aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
  getHistory: () => api.get('/chat/history'),
};

export const tokenAPI = {
  getTokenInfo: () => api.get('/tokens'),
  purchaseMaxToken: () => api.post('/tokens/purchase-max'),
};

export default api;