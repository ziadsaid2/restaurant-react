import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { checkout as checkoutAPI } from '../../api/orders';
import Loader from '../../components/Loader/Loader';
import Navbar from '../../components/Layout/Navbar/Navbar';
import Footer from '../../components/Layout/Footer/Footer';
import styles from './Checkout.module.css';

const Checkout = () => {
  const { cart, loading: cartLoading, fetchCart, clearCart } = useCart();
  const { user, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    phone: '',
    paymentMethod: 'Cash on Delivery',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Load saved address from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('lastDeliveryAddress');
    if (savedAddress) {
      setFormData((prev) => ({ ...prev, deliveryAddress: savedAddress }));
    }
  }, []);

  // Auto-fill phone from user data
  useEffect(() => {
    if (user && user.phone) {
      setFormData((prev) => ({ ...prev, phone: user.phone.toString() }));
    }
  }, [user]);

  // Redirect if not authenticated (only after initializing is complete)
  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, initializing, navigate]);

  // Fetch cart if not loaded
  useEffect(() => {
    if (isAuthenticated && !cart && !cartLoading) {
      fetchCart();
    }
  }, [isAuthenticated, cart, cartLoading, fetchCart]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart && (!cart.items || cart.items.length === 0)) {
      toast.info('Your cart is empty. Please add items to your cart first.');
      navigate('/menu');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain only digits';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    } else if (!['Cash on Delivery', 'Card'].includes(formData.paymentMethod)) {
      newErrors.paymentMethod = 'Payment method must be either "Cash on Delivery" or "Card"';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty. Please add items to your cart first.');
      navigate('/menu');
      return;
    }

    setIsSubmitting(true);

    try {
      const checkoutData = {
        deliveryAddress: formData.deliveryAddress.trim(),
        phone: parseInt(formData.phone, 10),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim() || undefined,
      };

      const response = await checkoutAPI(checkoutData);
      
      // Save address to localStorage for next time
      localStorage.setItem('lastDeliveryAddress', formData.deliveryAddress.trim());

      // Clear cart from context (backend already cleared it, but we sync the frontend)
      await clearCart();

      toast.success('Order placed successfully!', {
        position: 'top-center',
        autoClose: 2000,
      });

      // Redirect to home or orders page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to place order. Please try again.';
      setApiError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state (wait for auth to initialize and cart to load)
  if (initializing || cartLoading || !cart) {
    return (
      <>
        <Navbar />
        <main>
      <div className={styles.container}>
        <div className={styles.content}>
          <Loader />
        </div>
      </div>
        </main>
        <Footer />
      </>
    );
  }

  // Empty cart state
  if (!cart.items || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <main>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Checkout</h1>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyMessage}>Please add items to your cart first.</p>
            <Link to="/menu" className={styles.emptyButton}>
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.subtitle}>
          Please fill in your delivery information to complete your order.
        </p>

        <div className={styles.checkoutWrapper}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Delivery Information</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              {apiError && (
                <div className={`${styles.status} ${styles.error}`}>{apiError}</div>
              )}

              <div className={`${styles.formControl} ${styles.fullWidth}`}>
                <label htmlFor="deliveryAddress" className={styles.label}>
                  Delivery Address *
                </label>
                <input
                  type="text"
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.deliveryAddress ? styles.inputError : ''}`}
                  placeholder="Enter your delivery address"
                  disabled={isSubmitting}
                />
                {errors.deliveryAddress && (
                  <span className={styles.errorText}>{errors.deliveryAddress}</span>
                )}
              </div>

              <div className={styles.formControl}>
                <label htmlFor="phone" className={styles.label}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                  placeholder="Enter your phone number"
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <span className={styles.errorText}>{errors.phone}</span>
                )}
              </div>

              <div className={styles.formControl}>
                <label htmlFor="paymentMethod" className={styles.label}>
                  Payment Method *
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.paymentMethod ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Card">Card</option>
                </select>
                {errors.paymentMethod && (
                  <span className={styles.errorText}>{errors.paymentMethod}</span>
                )}
              </div>

              <div className={`${styles.formControl} ${styles.fullWidth}`}>
                <label htmlFor="notes" className={styles.label}>
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Any special instructions or notes for your order..."
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || cartLoading}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.orderItems}>
              {cart.items.map((item) => {
                const menuItem = item.menuItemId;
                const itemTotal = item.price * item.quantity;
                return (
                  <div key={item._id || menuItem?._id || Math.random()} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      {menuItem && typeof menuItem === 'object' && menuItem.image ? (
                        <img
                          src={menuItem.image}
                          alt={menuItem.name || 'Menu item'}
                          className={styles.itemImage}
                        />
                      ) : (
                        <div className={styles.placeholderImage}>No Image</div>
                      )}
                      <div className={styles.itemDetails}>
                        <h3 className={styles.itemName}>
                          {menuItem && typeof menuItem === 'object' ? menuItem.name : 'Menu Item'}
                        </h3>
                        <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className={styles.itemPrice}>${itemTotal.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>

            <div className={styles.summaryTotal}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal:</span>
                <span className={styles.summaryValue}>
                  ${cart.totalPrice ? cart.totalPrice.toFixed(2) : '0.00'}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Total:</span>
                <span className={styles.summaryTotalValue}>
                  ${cart.totalPrice ? cart.totalPrice.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;

