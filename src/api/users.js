import api from '../utils/axios';

// Get current user profile
export const getProfile = () => {
  return api.get('/users/profile');
};

// Update user profile
export const updateProfile = (userId, data) => {
  return api.patch(`/users/${userId}`, data);
};

// Get all users (admin only)
export const getAllUsers = () => {
  return api.get('/users');
};
