import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import Loader from '../../components/Loader/Loader';
import Navbar from '../../components/Layout/Navbar/Navbar';
import Footer from '../../components/Layout/Footer/Footer';
import styles from './Cart.module.css';

const Cart = () => {
  const { cart, loading, error, updateItemQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // CartContext يدير جلب الكارت تلقائياً، لا نحتاج لاستدعاء fetchCart هنا

  const handleQuantityChange = async (menuItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateItemQuantity(menuItemId, newQuantity);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveItem = async (menuItemId) => {
    try {
      // التأكد من أن menuItemId هو string
      const itemId = String(menuItemId);
      await removeItem(itemId);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // لو المستخدم مش مسجل دخول
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.emptyState}>
            <FaShoppingCart className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Please Login</h2>
            <p className={styles.emptyMessage}>You need to login to view your cart</p>
            <Link to="/login" className={styles.emptyButton}>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
        </main>
        <Footer />
      </>
    );
  }

  // Loading state
  if (loading && !cart) {
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

  // Error state
  if (error && !cart) {
    return (
      <>
        <Navbar />
        <main>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
        </main>
        <Footer />
      </>
    );
  }

  // Empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <main>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Your Cart</h1>
          <div className={styles.emptyState}>
            <FaShoppingCart className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyMessage}>Add some delicious items to your cart!</p>
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
        <h1 className={styles.title}>Your Cart</h1>
        <p className={styles.subtitle}>
          We consider all the drivers of change gives you the components you need to change to create a truly happens.
        </p>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.tableWrapper}>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => {
                const menuItem = item.menuItemId;
                // الحصول على ID بشكل آمن (سواء كان object أو string)
                // بعد populate، menuItemId يصبح object مع _id
                let menuItemId;
                if (typeof menuItem === 'object' && menuItem !== null) {
                  // إذا كان object (بعد populate)، نأخذ _id
                  if (menuItem._id) {
                    // _id هو ObjectId object، نحوله إلى string
                    menuItemId = menuItem._id.toString ? menuItem._id.toString() : String(menuItem._id);
                  } else {
                    // إذا لم يكن _id موجود، نحاول toString مباشرة
                    menuItemId = menuItem.toString ? menuItem.toString() : String(menuItem);
                  }
                } else {
                  // إذا كان string، نستخدمه مباشرة
                  menuItemId = String(menuItem);
                }
                const itemTotal = item.price * item.quantity;

                return (
                  <tr key={menuItemId}>
                    <td className={styles.itemCell}>
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
                          {menuItem && typeof menuItem === 'object' && menuItem.description && (
                            <p className={styles.itemDescription}>{menuItem.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={styles.priceCell}>
                      ${item.price.toFixed(2)}
                    </td>
                    <td className={styles.quantityCell}>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(menuItemId, item.quantity - 1)}
                          disabled={loading}
                          aria-label="Decrease quantity"
                        >
                          <FaMinus />
                        </button>
                        <span className={styles.quantityValue}>{item.quantity}</span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(menuItemId, item.quantity + 1)}
                          disabled={loading}
                          aria-label="Increase quantity"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className={styles.totalCell}>
                      ${itemTotal.toFixed(2)}
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemoveItem(menuItemId)}
                        disabled={loading}
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.cartSummary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Subtotal:</span>
            <span className={styles.summaryValue}>
              ${cart.totalPrice ? cart.totalPrice.toFixed(2) : '0.00'}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Total:</span>
            <span className={styles.summaryTotal}>
              ${cart.totalPrice ? cart.totalPrice.toFixed(2) : '0.00'}
            </span>
          </div>
          <button
            className={styles.checkoutButton}
            onClick={handleCheckout}
            disabled={loading || !cart.items || cart.items.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;

