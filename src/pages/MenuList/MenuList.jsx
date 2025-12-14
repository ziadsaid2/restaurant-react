import { useState, useEffect } from 'react';
import { getMenuItems } from '../../api/menu';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { HiMiniShoppingBag } from "react-icons/hi2";
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import Navbar from '../../components/Layout/Navbar/Navbar';
import Footer from '../../components/Layout/Footer/Footer';
import styles from './MenuList.module.css';

const MenuList = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const categories = ['All', 'Breakfast', 'Main Dishes', 'Drinks', 'Desserts'];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMenuItems(selectedCategory);
        setMenuItems(response.data);
      } catch (err) {
        setError('Failed to load menu items');
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  const handleAddToCart = async (item) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart', {
        position: 'top-center',
        autoClose: 1000,
      });
      navigate('/login');
      return;
    }

    try {
      await addItem(item._id, 1);
      toast.success(`${item.name} added to cart!`, {
        position: 'top-center',
        autoClose: 500,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart', {
        position: 'top-center',
        autoClose: 1000,
      });
    }
  };

  const handleOrderNow = async (item) => {
    if (!isAuthenticated) {
      toast.info('Please login to place an order', {
        position: 'top-center',
        autoClose: 2000,
      });
      navigate('/login');
      return;
    }

    try {
      await addItem(item._id, 1);
      toast.success(`${item.name} added to cart!`, {
        position: 'top-center',
        autoClose: 1500,
      });
      // Navigate to checkout page after adding to cart
      setTimeout(() => {
        navigate('/checkout');
      }, 500);
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart', {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <main>
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Our Menu</h1>
        <p className={styles.subtitle}>
          We consider all the drivers of change gives you the components you need to change to create a truly happens.
        </p>

        <div className={styles.categoryButtons}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''
                }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && <Loader />}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <div className={styles.menuGrid}>
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <div key={item._id} className={styles.menuItem}>
                  <div className={styles.imageContainer}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className={styles.itemImage} />
                    ) : (
                      <div className={styles.placeholderImage}>No Image</div>
                    )}
                    <div className={styles.actionIcons}>
                      <button
                        className={styles.cartIcon}
                        data-tooltip-id={`cart-tooltip-${item._id}`}
                        data-tooltip-content="Add to Cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                      >
                        <FaShoppingCart />
                      </button>
                      <Tooltip id={`cart-tooltip-${item._id}`} place="top" effect="solid" />

                      <button
                        className={styles.orderIcon}
                        data-tooltip-id={`order-tooltip-${item._id}`}
                        data-tooltip-content="Order Now"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderNow(item);
                        }}
                      >
                        <HiMiniShoppingBag />
                      </button>
                      <Tooltip id={`order-tooltip-${item._id}`} place="top" effect="solid" />
                    </div>
                  </div>
                  <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                </div>
              ))
            ) : (
              <div className={styles.noItems}>No menu items found</div>
            )}
          </div>
        )}
      </div>
    </div>
      </main>
      <Footer />
    </>
  );
};

export default MenuList;

