import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { createBooking } from '../../api/bookings';
import styles from './CreateBooking.module.css';
import Navbar from '../../components/Layout/Navbar/Navbar';
import Footer from '../../components/Layout/Footer/Footer';
import mapImage from '../../img/image 112.png';
import { FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

const CreateBooking = () => {
  const { isAuthenticated, user, initializing } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name:  '',
    phone: '',
    totalPerson: 1,
    tableNumber: 1,
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Generate time options (from 6:00 PM to 11:00 PM in 30-minute intervals)
  // react moment library
  const timeOptions = [];
  for (let hour = 18; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
      timeOptions.push({ value: time24, label: time12 });
    }
  }

  // Check authentication on mount
  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      toast.error('Please login to book a table');
      navigate('/login', { state: { from: '/create-booking' } });
    }
  }, [isAuthenticated, initializing, navigate]);

  // Set default date to today
  useEffect(() => {
    if (isAuthenticated) {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, date: dateString }));
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Booking date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.totalPerson || formData.totalPerson < 1) {
      newErrors.totalPerson = 'Number of guests is required';
    }

    if (!formData.tableNumber || formData.tableNumber < 1) {
      newErrors.tableNumber = 'Table number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for backend
      const bookingData = {
        date: formData.date,
        time: formData.time,
        numberOfGuests: Number(formData.totalPerson),
        tableNumber: Number(formData.tableNumber),
        name: formData.name,
        phone: Number(formData.phone),
        ...(formData.notes && { notes: formData.notes }),
      };

      console.log('Sending booking data:', bookingData);
      const response = await createBooking(bookingData);
      console.log('Booking response:', response);
      toast.success('Table booked successfully Please wait for confirmation.');
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: '',
        name: '',
        phone: '',
        totalPerson: 1,
        tableNumber: 1,
        notes: '',
      });

      // Redirect to my bookings after a short delay
      setTimeout(() => {
        navigate('/create-booking');
      }, 1500);
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error?.response);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to book table. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show nothing while checking authentication
  if (initializing) {
    return null;
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.header}>Book A Table</h1>
          <p className={styles.subtitle}>
            We consider all the drivers of change gives you the components you need to change to create a truly happens.
          </p>

          <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formControl}>
              <label htmlFor="date" className={styles.label}>
                Date
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                />
                <FaCalendarAlt className={styles.inputIcon} />
              </div>
              {errors.date && <span className={styles.errorText}>{errors.date}</span>}
            </div>

            <div className={styles.formControl}>
              <label htmlFor="time" className={styles.label}>
                Time
              </label>
              <div className={styles.inputWrapper}>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.select} ${errors.time ? styles.inputError : ''}`}
                  disabled={isLoading}
                >
                  <option value="">Select time</option>
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown className={styles.inputIcon} />
              </div>
              {errors.time && <span className={styles.errorText}>{errors.time}</span>}
            </div>

            <div className={styles.formControl}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Enter your name"
                disabled={isLoading}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formControl}>
              <label htmlFor="phone" className={styles.label}>
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                placeholder="01XXXXXXXXX"
                disabled={isLoading}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.formControl}>
              <label htmlFor="totalPerson" className={styles.label}>
                Total Person
              </label>
              <div className={styles.inputWrapper}>
                <select
                  id="totalPerson"
                  name="totalPerson"
                  value={formData.totalPerson}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.select} ${errors.totalPerson ? styles.inputError : ''}`}
                  disabled={isLoading}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Person' : 'Persons'}
                    </option>
                  ))}
                </select>
                <FaChevronDown className={styles.inputIcon} />
              </div>
              {errors.totalPerson && <span className={styles.errorText}>{errors.totalPerson}</span>}
            </div>

            <div className={styles.formControl}>
              <label htmlFor="tableNumber" className={styles.label}>
                Table Number
              </label>
              <div className={styles.inputWrapper}>
                <select
                  id="tableNumber"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.select} ${errors.tableNumber ? styles.inputError : ''}`}
                  disabled={isLoading}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Table {num}
                    </option>
                  ))}
                </select>
                <FaChevronDown className={styles.inputIcon} />
              </div>
              {errors.tableNumber && <span className={styles.errorText}>{errors.tableNumber}</span>}
            </div>

            <div className={`${styles.formControl} ${styles.fullWidth}`}>
              <label htmlFor="notes" className={styles.label}>
                Notes <span className={styles.optional}>(Optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Any special requests or notes..."
                rows={4}
                disabled={isLoading}
              />
            </div>

            <button type="submit" className={styles.cta} disabled={isLoading}>
              {isLoading ? 'Booking...' : 'Book A Table'}
            </button>
          </form>
          </div>
        </div>

        <div className={styles.mapContainer}>
          <img
            src={mapImage}
            alt="mapImage"
            className={styles.mapImage}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateBooking;
