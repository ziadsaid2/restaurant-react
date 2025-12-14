import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  getCart as getCartAPI,
  addToCart as addToCartAPI,
  updateCartItem as updateCartItemAPI,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI,
} from '../api/orders';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, initializing, token, logout } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();
  // جلب الكارت من API
  const fetchCart = useCallback(async () => {
    // لا نحاول جلب الكارت إذا كان الـ auth مش جاهز أو مش موجود
    if (initializing || !isAuthenticated || !token) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await getCartAPI();
      setCart(response.data);
      hasFetchedRef.current = true;
    } catch (err) {
      // إذا كان الخطأ 401، معناه الـ token غير صالح
      if (err.response?.status === 401) {
        setError(null); // لا نعرض خطأ للمستخدم
        setCart(null);
        hasFetchedRef.current = false;
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch cart');
        console.error('Error fetching cart:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, initializing, token]);

  // جلب الكارت عند تسجيل الدخول (بعد التأكد من أن الـ auth جاهز)
  useEffect(() => {
    // ننتظر حتى ينتهي تحميل الـ auth
    if (initializing) {
      return;
    }
    
    // إذا كان المستخدم مسجل دخول وموجود token
    if (isAuthenticated && token) {
      // نجلب الكارت فقط إذا لم يتم جلبها من قبل أو إذا تغير الـ token
      if (!hasFetchedRef.current) {
        fetchCart();
      }
    } else {
      // إذا لم يكن مسجل دخول، نمسح الكارت
      setCart(null);
      setError(null);
      hasFetchedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, initializing, token]);

  // إضافة عنصر للكارت
  const addItem = async (menuItemId, quantity = 1) => {
    if (!isAuthenticated || !token) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setLoading(true);
      setError(null);
      const response = await addToCartAPI(menuItemId, quantity);
      setCart(response.data);
      hasFetchedRef.current = true; // تحديث المرجع بعد إضافة عنصر
      return response.data;
    } catch (err) {
      // إذا كان الخطأ 401، معناه الـ token غير صالح
      if (err.response?.status === 401) {
        const errorMessage = 'Please login to add items to cart';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      const errorMessage = err.response?.data?.message || 'Failed to add item to cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // تحديث كمية عنصر
  const updateItemQuantity = async (menuItemId, quantity) => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await updateCartItemAPI(menuItemId, quantity);
      setCart(response.data);
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to update cart');
        setCart(null);
        throw new Error('Please login to update cart');
      }
      const errorMessage = err.response?.data?.message || 'Failed to update item quantity';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // حذف عنصر من الكارت
  const removeItem = async (menuItemId) => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      setError(null);
      // التأكد من أن menuItemId هو string
      const itemId = String(menuItemId);
      const response = await removeFromCartAPI(itemId);
      // الـ API يرجع { message, cart }
      if (response.data && response.data.cart) {
        // تحديث الكارت بالبيانات الجديدة
        setCart(response.data.cart);
        hasFetchedRef.current = true;
      } else {
        // لو مش رجع cart، نجلب الكارت من جديد
        await fetchCart();
      }
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to remove items from cart');
        setCart(null);
        throw new Error('Please login to remove items from cart');
      }
      const errorMessage = err.response?.data?.message || 'Failed to remove item from cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // مسح الكارت بالكامل
  const clearCart = async () => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await clearCartAPI();
      // الـ API يرجع { message, cart }
      if (response.data.cart) {
        setCart(response.data.cart);
      } else {
        setCart(null);
      }
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to clear cart');
        setCart(null);
        throw new Error('Please login to clear cart');
      }
      const errorMessage = err.response?.data?.message || 'Failed to clear cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // حساب عدد العناصر في الكارت
  const itemCount = useMemo(() => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      itemCount,
      fetchCart,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
    }),
    [cart, loading, error, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

