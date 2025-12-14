import { useState } from 'react';
import Navbar from '../../components/Layout/Navbar/Navbar';
import Footer from '../../components/Layout/Footer/Footer';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import UsersManagement from './UsersManagement/UsersManagement';
import BookingsManagement from './BookingsManagement/BookingsManagement';
import OrdersManagement from './OrdersManagement/OrdersManagement';
import MenuManagement from './MenuManagement/MenuManagement';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <ProtectedRoute requireAdmin={true}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.subtitle}>
            Manage users, bookings, orders, and menu items
          </p>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users Management
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'bookings' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings Management
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders Management
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'menu' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              Menu Management
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'users' && <UsersManagement />}
            {activeTab === 'bookings' && <BookingsManagement />}
            {activeTab === 'orders' && <OrdersManagement />}
            {activeTab === 'menu' && <MenuManagement />}
          </div>
        </div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
};

export default AdminPanel;

