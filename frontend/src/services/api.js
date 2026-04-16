import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // usa proxy de Vite
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;