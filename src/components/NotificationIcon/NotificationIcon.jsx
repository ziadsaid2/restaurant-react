import { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationContext';
import Loader from '../Loader/Loader';
import styles from './NotificationIcon.module.css';

const NotificationIcon = () => {
  const { notifications, count, deleteNotification, clearAll, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearAll = async (e) => {
    e.stopPropagation();
    try {
      await clearAll();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.iconButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <FaBell />
        {count > 0 && (
          <span className={styles.badge}>{count > 99 ? '99+' : count}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h3 className={styles.dropdownTitle}>Notifications</h3>
            {notifications.length > 0 && (
              <button
                className={styles.clearAllButton}
                onClick={handleClearAll}
                disabled={loading}
              >
                Clear All
              </button>
            )}
          </div>

          <div className={styles.dropdownContent}>
            {loading && notifications.length === 0 ? (
              <div className={styles.emptyState}><Loader size="small" /></div>
            ) : notifications.length === 0 ? (
              <div className={styles.emptyState}>No notifications</div>
            ) : (
              notifications.map((notification) => {
                const notificationId = notification._id || notification.id;
                return (
                  <div key={notificationId} className={styles.notificationItem}>
                    <div className={styles.notificationContent}>
                      <h4 className={styles.notificationTitle}>{notification.title}</h4>
                      <p className={styles.notificationMessage}>{notification.message}</p>
                      <span className={styles.notificationTime}>
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => handleDelete(notificationId, e)}
                      aria-label="Delete notification"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;

