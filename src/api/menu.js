import api from '../utils/axios';

export const getMenuItems = (category) => {
  const params = category && category !== 'All' ? { category } : {};
  return api.get('/menu', { params });
};

// Get single menu item
export const getMenuItem = (id) => {
  return api.get(`/menu/${id}`);
};
// Create menu item (admin only)
export const createMenuItem = (data) => {
  return api.post('/menu', data);
};

// Update menu item (admin only)
export const updateMenuItem = (id, data) => {
  return api.patch(`/menu/${id}`, data);
};

// Delete menu item (admin only)
export const deleteMenuItem = (id) => {
  return api.delete(`/menu/${id}`);
};


