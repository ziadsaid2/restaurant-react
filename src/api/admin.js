import api from '../utils/axios';

// Get all users (admin only)
export const getAllUsers = () => {
  return api.get('/users');
};

// Get all bookings (admin only)
export const getAllBookings = () => {
  return api.get('/bookings');
};

// Update booking status (admin only)
export const updateBookingStatus = (id, status) => {
  return api.patch(`/bookings/${id}`, { status });
};

// Get all orders (admin only)
export const getAllOrders = () => {
  return api.get('/orders');
};

// Update order status (admin only)
export const updateOrderStatus = (id, status) => {
  return api.patch(`/orders/${id}`, { status });
};

