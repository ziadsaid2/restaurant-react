import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyOrders, deleteOrder } from '../../api/orders';
import Loader from '../../components/Loader/Loader';
import styles from './Profile.module.css';

const MyOrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getMyOrders();
      setOrders(data || []);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    setDeletingId(orderId);
    try {
      await deleteOrder(orderId);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to delete order'
      );
      console.error('Error deleting order:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const canDelete = (status) => {
    return status === 'Pending' || status === 'Rejected';
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: styles.statusPending,
      Accepted: styles.statusAccepted,
      'In Progress': styles.statusInProgress,
      Delivered: styles.statusDelivered,
      Rejected: styles.statusRejected,
    };
    return colors[status] || styles.statusPending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No orders yet</h3>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      {orders.map((order) => {
        const orderId = order._id || order.id;
        const shortId = orderId ? orderId.toString().slice(-6) : 'N/A';
        const canDeleteOrder = canDelete(order.status);

        return (
          <div key={orderId} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div>
                <h3 className={styles.orderTitle}>Order #{shortId}</h3>
                <span className={styles.orderDate}>
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className={styles.orderBody}>
              <div className={styles.orderInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Total Price:</span>
                  <span className={styles.infoValue}>
                    ${order.totalPrice?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Payment Method:</span>
                  <span className={styles.infoValue}>{order.paymentMethod || 'N/A'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Delivery Address:</span>
                  <span className={styles.infoValue}>{order.deliveryAddress || 'N/A'}</span>
                </div>
                {order.phone && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{order.phone}</span>
                  </div>
                )}
              </div>

              {order.items && order.items.length > 0 && (
                <div className={styles.orderItems}>
                  <h4 className={styles.itemsTitle}>Items:</h4>
                  <ul className={styles.itemsList}>
                    {order.items.map((item, index) => {
                      const menuItem = item.menuItemId;
                      const itemName =
                        typeof menuItem === 'object' && menuItem?.name
                          ? menuItem.name
                          : 'Menu Item';
                      const itemPrice = item.price || 0;
                      return (
                        <li key={index} className={styles.itemRow}>
                          <span className={styles.itemName}>{itemName}</span>
                          <span className={styles.itemQuantity}>x{item.quantity}</span>
                          <span className={styles.itemPrice}>
                            ${(itemPrice * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {order.notes && (
                <div className={styles.orderNotes}>
                  <span className={styles.notesLabel}>Notes:</span>
                  <span className={styles.notesValue}>{order.notes}</span>
                </div>
              )}
            </div>

            <div className={styles.orderActions}>
              <button
                className={`${styles.deleteButton} ${!canDeleteOrder ? styles.disabledButton : ''}`}
                onClick={() => canDeleteOrder && handleDelete(orderId)}
                disabled={!canDeleteOrder || deletingId === orderId}
                title={
                  !canDeleteOrder
                    ? 'Cannot delete order that is already accepted, in progress, or delivered'
                    : 'Delete order'
                }
              >
                {deletingId === orderId ? 'Deleting...' : 'Delete'}
              </button>
              {!canDeleteOrder && (
                <span className={styles.disabledMessage}>
                  This order cannot be deleted because it has been {order.status.toLowerCase()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrdersTab;
