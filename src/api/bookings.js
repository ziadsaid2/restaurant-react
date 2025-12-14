import api from '../utils/axios';

export const createBooking = (bookingData) => api.post('/bookings', bookingData);

export const getMyBookings = () => api.get('/bookings/my-bookings');

export const getAllBookings = () => api.get('/bookings');

export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}`, { status });

export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
