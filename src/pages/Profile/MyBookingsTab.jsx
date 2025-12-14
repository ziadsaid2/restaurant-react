import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyBookings, deleteBooking } from '../../api/bookings';
import Loader from '../../components/Loader/Loader';
import styles from './Profile.module.css';

const MyBookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getMyBookings();
      setBookings(data || []);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setDeletingId(bookingId);
    try {
      await deleteBooking(bookingId);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to delete booking'
      );
      console.error('Error deleting booking:', err);
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

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    // Time is already in HH:MM format
    return timeString;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No bookings yet</h3>
        <p>You haven't made any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.bookingsContainer}>
      {bookings.map((booking) => {
        const bookingId = booking._id || booking.id;
        const shortId = bookingId ? bookingId.toString().slice(-6) : 'N/A';
        const canDeleteBooking = canDelete(booking.status);

        return (
          <div key={bookingId} className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
              <div>
                <h3 className={styles.bookingTitle}>Booking #{shortId}</h3>
                <span className={styles.bookingDate}>
                  {formatDate(booking.date)}
                </span>
              </div>
              <span className={`${styles.statusBadge} ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>

            <div className={styles.bookingBody}>
              <div className={styles.bookingInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Date:</span>
                  <span className={styles.infoValue}>{formatDate(booking.date)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Time:</span>
                  <span className={styles.infoValue}>{formatTime(booking.time)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Table Number:</span>
                  <span className={styles.infoValue}>{booking.tableNumber || 'N/A'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Number of Guests:</span>
                  <span className={styles.infoValue}>{booking.numberOfGuests || 'N/A'}</span>
                </div>
                {booking.name && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Name:</span>
                    <span className={styles.infoValue}>{booking.name}</span>
                  </div>
                )}
                {booking.phone && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{booking.phone}</span>
                  </div>
                )}
              </div>

              {booking.notes && (
                <div className={styles.bookingNotes}>
                  <span className={styles.notesLabel}>Notes:</span>
                  <span className={styles.notesValue}>{booking.notes}</span>
                </div>
              )}
            </div>

            <div className={styles.bookingActions}>
              <button
                className={`${styles.deleteButton} ${!canDeleteBooking ? styles.disabledButton : ''}`}
                onClick={() => canDeleteBooking && handleDelete(bookingId)}
                disabled={!canDeleteBooking || deletingId === bookingId}
                title={
                  !canDeleteBooking
                    ? 'Cannot delete booking that is already accepted, in progress, or delivered'
                    : 'Delete booking'
                }
              >
                {deletingId === bookingId ? 'Deleting...' : 'Delete'}
              </button>
              {!canDeleteBooking && (
                <span className={styles.disabledMessage}>
                  This booking cannot be deleted because it has been {booking.status.toLowerCase()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookingsTab;
