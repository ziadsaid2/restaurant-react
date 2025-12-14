import api from '../utils/axios';

// جلب الكارت
export const getCart = () => {
  return api.get('/orders/cart');
};

// إضافة عنصر للكارت
export const addToCart = (menuItemId, quantity = 1) => {
  return api.post('/orders/cart', {
    menuItemId,
    quantity,
  });
};

// تحديث كمية عنصر في الكارت
export const updateCartItem = (menuItemId, quantity) => {
  return api.patch(`/orders/cart/items/${menuItemId}`, {
    quantity,
  });
};

// حذف عنصر من الكارت
export const removeFromCart = (menuItemId) => {
  return api.delete(`/orders/cart/items/${menuItemId}`);
};

// مسح الكارت بالكامل
export const clearCart = () => {
  return api.delete('/orders/cart');
};

// Checkout - تحويل الكارت لطلب
export const checkout = (checkoutData) => {
  return api.post('/orders/checkout', checkoutData);
};

// جلب طلبات المستخدم
export const getMyOrders = () => {
  return api.get('/orders/my-orders');
};

// حذف طلب
export const deleteOrder = (id) => {
  return api.delete(`/orders/${id}`);
};

// Get all orders (admin only)
export const getAllOrders = () => {
  return api.get('/orders');
};

// Update order status (admin only)
export const updateOrderStatus = (id, status) => {
  return api.patch(`/orders/${id}`, { status });
};

