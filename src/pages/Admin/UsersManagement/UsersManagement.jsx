import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers } from '../../../api/users';
import Loader from '../../../components/Loader/Loader';
import styles from './UsersManagement.module.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    return role === 'admin' ? styles.roleAdmin : styles.roleUser;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (users.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No users found</h3>
        <p>There are no users in the system yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.usersContainer}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>All Users</h2>
        <span className={styles.count}>Total: {users.length}</span>
      </div>

      <div className={styles.usersGrid}>
        {users.map((user) => {
          const userId = user._id || user.id;
          return (
            <div key={userId} className={styles.userCard}>
              <div className={styles.userHeader}>
                <h3 className={styles.userName}>{user.name || 'N/A'}</h3>
                <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                  {user.role || 'user'}
                </span>
              </div>
              
              <div className={styles.userInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{user.email || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Phone:</span>
                  <span className={styles.infoValue}>{user.phone || 'N/A'}</span>
                </div>
                {user.createdAt && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Joined:</span>
                    <span className={styles.infoValue}>
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UsersManagement;

