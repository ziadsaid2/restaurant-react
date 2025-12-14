import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Navbar.module.css";
import { FaPhoneAlt, FaFacebookF, FaInstagram, FaGithub, FaTwitter, FaEnvelope, FaUser } from "react-icons/fa";
import flagImage from "../../../img/japanese-food (1).png";
import NotificationIcon from "../../NotificationIcon/NotificationIcon";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.left}>
            <span>
              <FaPhoneAlt /> (414) 857 - 0107
            </span>
            <span>
              <FaEnvelope /> yummy@bistrobliss.com
            </span>
          </div>
          <div className={styles.right}>
            <FaTwitter />
            <FaFacebookF />
            <FaInstagram />
            <FaGithub />
          </div>
        </div>
      </div>

      <div className={styles.mainNav}>
        <div className={styles.mainNavInner}>
          <div className={styles.logoGroup}>
            <div className={styles.logoContainer}>
              <img src={flagImage} alt="Bistro Bliss logo" />
              <div className={styles.logo}>Bistro Bliss</div>
            </div>
            <div className={styles.mobileActions}>
              {isAuthenticated && (
                <>
                  <NotificationIcon />
                  <Link to="/profile" className={styles.profileBtnMobile} title="Profile">
                    <FaUser />
                  </Link>
                </>
              )}
              <button
                type="button"
                className={styles.menuToggle}
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>

          <nav className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              Menu
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                Cart
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${styles.navLink} ${styles.sign} ${isActive ? styles.active : ''}`
                }
              >
                Admin Panel
              </NavLink>
            )}
            {!isAuthenticated && (
              location.pathname === '/register' ? (
                <NavLink 
                  to="/register" 
                  className={({ isActive }) =>
                    `${styles.navLink} ${styles.sign} ${isActive ? styles.active : ''}`
                  }
                >
                  Register
                </NavLink>
              ) : (
                <NavLink 
                  to="/login" 
                  className={({ isActive }) =>
                    `${styles.navLink} ${styles.sign} ${isActive ? styles.active : ''}`
                  }
                >
                  Login
                </NavLink>
              )
            )}
          </nav>
          <div className={styles.rightActions}>
            <NavLink
              to="/create-booking"
              className={({ isActive }) => 
                `${styles.bookBtn} ${isActive ? styles.active : ''}`
              }
            >
              Book A Table
            </NavLink>
            {isAuthenticated && (
              <>
                <NotificationIcon />
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `${styles.profileBtn} ${isActive ? styles.active : ''}`
                  }
                  title="Profile"
                >
                  <FaUser />
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
