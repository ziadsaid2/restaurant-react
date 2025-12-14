import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllOrders, updateOrderStatus } from '../../../api/orders';
import Loader from '../../../components/Loader/Loader';
import styles from './OrdersManagement.module.css';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getAllOrders();
      setOrders(data || []);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to update order status'
      );
      console.error('Error updating order:', err);
    } finally {
      setUpdatingId(null);
    }
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAvailableStatuses = (currentStatus) => {
    const statusFlow = {
      Pending: ['Accepted', 'Rejected'],
      Accepted: ['In Progress', 'Rejected'],
      'In Progress': ['Delivered', 'Rejected'],
      Delivered: [],
      Rejected: [],
    };
    return statusFlow[currentStatus] || [];
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
        <h3>No orders found</h3>
        <p>There are no orders in the system yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>All Orders</h2>
        <span className={styles.count}>Total: {orders.length}</span>
      </div>

      <div className={styles.ordersList}>
        {orders.map((order) => {
          const orderId = order._id || order.id;
          const shortId = orderId ? orderId.toString().slice(-6) : 'N/A';
          const userId = order.userId;
          const userName =
            typeof userId === 'object' && userId?.name
              ? userId.name
              : 'N/A';
          const userEmail =
            typeof userId === 'object' && userId?.email
              ? userId.email
              : 'N/A';
          const userPhone =
            typeof userId === 'object' && userId?.phone
              ? userId.phone
              : order.phone || 'N/A';
          const isUpdating = updatingId === orderId;
          const availableStatuses = getAvailableStatuses(order.status);

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
                    <span className={styles.infoLabel}>Customer Name:</span>
                    <span className={styles.infoValue}>{userName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>{userEmail}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{userPhone}</span>
                  </div>
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
                {availableStatuses.length > 0 ? (
                  <div className={styles.statusButtons}>
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        className={`${styles.actionButton} ${
                          status === 'Rejected'
                            ? styles.rejectButton
                            : status === 'Delivered'
                            ? styles.deliverButton
                            : styles.updateButton
                        }`}
                        onClick={() => handleStatusUpdate(orderId, status)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Updating...' : status}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className={styles.statusMessage}>
                    Order has been {order.status.toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersManagement;

