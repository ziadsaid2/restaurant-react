import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Layout/Navbar/Navbar';
import Footer from '../../components/Layout/Footer/Footer';
import ProfileDetails from './ProfileDetails';
import MyOrdersTab from './MyOrdersTab';
import MyBookingsTab from './MyBookingsTab';
import Loader from '../../components/Loader/Loader';
import styles from './Profile.module.css';

const Profile = () => {
  const { isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Wait for auth to initialize before checking authentication
    if (!initializing && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, initializing, navigate]);

  // Show loading state while initializing
  if (initializing) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.content}>
            <Loader />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.subtitle}>
            Manage your profile information, orders, and bookings
          </p>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Details
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              My Orders
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'bookings' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              My Bookings
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'profile' && <ProfileDetails />}
            {activeTab === 'orders' && <MyOrdersTab />}
            {activeTab === 'bookings' && <MyBookingsTab />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
