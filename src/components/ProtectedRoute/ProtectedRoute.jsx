import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../Loader/Loader';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, initializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initializing) {
      if (!isAuthenticated) {
        navigate('/login', { 
          state: { message: 'Please login to access this page' } 
        });
      } else if (requireAdmin && user?.role !== 'admin') {
        navigate('/', { 
          state: { message: 'Access denied. Admin privileges required.' } 
        });
      }
    }
  }, [isAuthenticated, user, initializing, requireAdmin, navigate]);

  // Show loading while checking auth
  if (initializing) {
    return <Loader fullScreen={true} />;
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if admin required but user is not admin
  if (requireAdmin && user?.role !== 'admin') {
    return null;
  }

  return children;
};

export default ProtectedRoute;

