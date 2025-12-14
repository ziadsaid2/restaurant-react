import api from '../utils/axios';

export const getNotifications = () => api.get('/notifications');

export const getNotificationCount = () => api.get('/notifications/count');

export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

export const clearAllNotifications = () => api.delete('/notifications');

