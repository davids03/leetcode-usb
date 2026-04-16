import api from './api';

export const register = (username, email, password) => {
  return api.post('/auth/register', { username, email, password });
};

export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};