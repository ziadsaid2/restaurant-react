import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import {
  getNotifications as getNotificationsAPI,
  getNotificationCount as getNotificationCountAPI,
  deleteNotification as deleteNotificationAPI,
  clearAllNotifications as clearAllNotificationsAPI,
} from '../api/notifications';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, initializing, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastNotificationIdRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const shownNotificationIdsRef = useRef(new Set()); // لتتبع الإشعارات التي تم عرضها بالفعل
  const isInitialFetchRef = useRef(true); // لتحديد ما إذا كانت هذه أول مرة يتم فيها جلب الإشعارات

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (initializing || !isAuthenticated || !token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getNotificationsAPI();
      const fetchedNotifications = response.data || [];
      
      // Check for new notifications
      if (fetchedNotifications.length > 0) {
        if (isInitialFetchRef.current) {
          // عند التحميل الأولي (بعد refresh)، نحفظ كل الإشعارات بدون عرض toast
          fetchedNotifications.forEach((notif) => {
            const notifId = notif._id || notif.id;
            shownNotificationIdsRef.current.add(notifId);
          });
          isInitialFetchRef.current = false; // نحدد أن التحميل الأولي انتهى
        } else {
          // بعد التحميل الأولي، نجد الإشعارات الجديدة فقط
          const newNotifications = fetchedNotifications.filter((notif) => {
            const notifId = notif._id || notif.id;
            // إذا لم يتم عرض هذا الإشعار من قبل
            if (!shownNotificationIdsRef.current.has(notifId)) {
              shownNotificationIdsRef.current.add(notifId); // نحفظه كإشعار تم عرضه
              return true; // هذا إشعار جديد
            }
            return false; // هذا إشعار قديم تم عرضه من قبل
          });
          
          // نعرض toast فقط للإشعارات الجديدة
          newNotifications.forEach((notif) => {
            toast.success(notif.title || notif.message || 'New notification');
          });
        }
      }
      
      // Update last notification ID
      if (fetchedNotifications.length > 0) {
        const firstNotification = fetchedNotifications[0];
        lastNotificationIdRef.current = firstNotification._id || firstNotification.id;
      }
      
      setNotifications(fetchedNotifications);
    } catch (err) {
      if (err.response?.status === 401) {
        setError(null);
        setNotifications([]);
        setCount(0);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch notifications');
        console.error('Error fetching notifications:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, initializing, token]);

  // Fetch notification count
  const fetchCount = useCallback(async () => {
    if (initializing || !isAuthenticated || !token) {
      return;
    }

    try {
      const response = await getNotificationCountAPI();
      setCount(response.data?.count || 0);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Error fetching notification count:', err);
      } else {
        setCount(0);
      }
    }
  }, [isAuthenticated, initializing, token]);

  // Delete a single notification
  const deleteNotification = useCallback(async (id) => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      setError(null);
      await deleteNotificationAPI(id);
      
      // Remove from local state
      setNotifications((prev) => prev.filter((notif) => {
        const notifId = notif._id || notif.id;
        return notifId !== id;
      }));
      
      // نزيل الإشعار من قائمة الإشعارات المعروضة أيضاً
      shownNotificationIdsRef.current.delete(id);
      
      // Update count
      setCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to delete notifications');
        setNotifications([]);
        setCount(0);
      } else {
        const errorMessage = err.response?.data?.message || 'Failed to delete notification';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      setError(null);
      await clearAllNotificationsAPI();
      setNotifications([]);
      setCount(0);
      lastNotificationIdRef.current = null;
      shownNotificationIdsRef.current.clear(); // نمسح الإشعارات المعروضة عند مسح كل الإشعارات
      isInitialFetchRef.current = true; // نعيد تعيين flag التحميل الأولي
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to clear notifications');
        setNotifications([]);
        setCount(0);
      } else {
        const errorMessage = err.response?.data?.message || 'Failed to clear notifications';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (initializing) {
      return;
    }

    if (isAuthenticated && token) {
      fetchNotifications();
      fetchCount();
    } else {
      setNotifications([]);
      setCount(0);
      lastNotificationIdRef.current = null;
      shownNotificationIdsRef.current.clear(); // نمسح الإشعارات المعروضة عند تسجيل الخروج
      isInitialFetchRef.current = true; // نعيد تعيين flag التحميل الأولي
    }
  }, [isAuthenticated, initializing, token, fetchNotifications, fetchCount]);

  // Set up polling every 60 seconds
  useEffect(() => {
    if (initializing || !isAuthenticated || !token) {
      return;
    }

    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Set up new interval
    pollingIntervalRef.current = setInterval(() => {
      fetchNotifications();
      fetchCount();
    }, 10000); // 10 seconds

    // Cleanup on unmount or when dependencies change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isAuthenticated, initializing, token, fetchNotifications, fetchCount]);

  const value = useMemo(
    () => ({
      notifications,
      count,
      loading,
      error,
      fetchNotifications,
      fetchCount,
      deleteNotification,
      clearAll,
    }),
    [notifications, count, loading, error, fetchNotifications, fetchCount, deleteNotification, clearAll]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

