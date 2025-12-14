import api from '../utils/axios';

export const loginRequest = (credentials) => api.post('/auth/login', credentials);

export const registerRequest = (payload) => api.post('/auth/register', payload);
