import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllBookings, updateBookingStatus } from '../../../api/bookings';
import Loader from '../../../components/Loader/Loader';
import styles from './BookingsManagement.module.css';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getAllBookings();
      setBookings(data || []);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
      fetchBookings();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to update booking status'
      );
      console.error('Error updating booking:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: styles.statusPending,
      Accepted: styles.statusAccepted,
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
        <h3>No bookings found</h3>
        <p>There are no bookings in the system yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.bookingsContainer}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>All Bookings</h2>
        <span className={styles.count}>Total: {bookings.length}</span>
      </div>

      <div className={styles.bookingsList}>
        {bookings.map((booking) => {
          const bookingId = booking._id || booking.id;
          const shortId = bookingId ? bookingId.toString().slice(-6) : 'N/A';
          const userId = booking.userId;
          const userName =
            typeof userId === 'object' && userId?.name
              ? userId.name
              : booking.name || 'N/A';
          const userEmail =
            typeof userId === 'object' && userId?.email
              ? userId.email
              : 'N/A';
          const userPhone =
            typeof userId === 'object' && userId?.phone
              ? userId.phone
              : booking.phone || 'N/A';
          const isUpdating = updatingId === bookingId;

          return (
            <div key={bookingId} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div>
                  <h3 className={styles.bookingTitle}>Booking #{shortId}</h3>
                  <span className={styles.bookingDate}>
                    {formatDate(booking.date)} at {formatTime(booking.time)}
                  </span>
                </div>
                <span className={`${styles.statusBadge} ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className={styles.bookingBody}>
                <div className={styles.bookingInfo}>
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
                    <span className={styles.infoLabel}>Date:</span>
                    <span className={styles.infoValue}>{formatDate(booking.date)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Time:</span>
                    <span className={styles.infoValue}>{formatTime(booking.time)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Number of Guests:</span>
                    <span className={styles.infoValue}>{booking.numberOfGuests || 'N/A'}</span>
                  </div>
                  {booking.tableNumber && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Table Number:</span>
                      <span className={styles.infoValue}>{booking.tableNumber}</span>
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
                {booking.status === 'Pending' && (
                  <>
                    <button
                      className={`${styles.actionButton} ${styles.acceptButton}`}
                      onClick={() => handleStatusUpdate(bookingId, 'Accepted')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Accept'}
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.rejectButton}`}
                      onClick={() => handleStatusUpdate(bookingId, 'Rejected')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Reject'}
                    </button>
                  </>
                )}
                {booking.status !== 'Pending' && (
                  <span className={styles.statusMessage}>
                    Booking has been {booking.status.toLowerCase()}
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

export default BookingsManagement;

