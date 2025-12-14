import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import styles from './Footer.module.css';
import logo from '../../../img/Vector.png';
import imgOne from '../../../img/pexels-ash-376464 1.png';
import imgTwo from '../../../img/pexels-ella-olsson-1640772 1.png';
import imgThree from '../../../img/pexels-steve-3789885 1.png';
import imgFour from '../../../img/eiliv-aceron-d5PbKQJ0Lu8-unsplash 1.png';

const Footer = () => {
  // edit this
  const pageLinks = ['Home', 'About', 'Menu', 'Pricing', 'Blog', 'Contact', 'Delivery'];
  const utilityLinks = [
    'Start Here',
    'Styleguide',
    'Password Protected',
    '404 Not Found',
    'Licenses',
    'Changelog',
    'View More',
  ];
  const instagramImages = [imgOne, imgTwo, imgThree, imgFour];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.brand}>
            <div className={styles.logoWrap}>
              <img src={logo} alt="Bistro Bliss logo" />
              <span>Bistro Bliss</span>
            </div>
            <p className={styles.brandDescription}>
            In the new era of technology we look at the future with certainty and pride for our company and.
            </p>
            <div className={styles.socials}>
              <a href="https://twitter.com" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://facebook.com" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://github.com" aria-label="GitHub">
                <FaGithub />
              </a>
            </div>
          </div>
          <div className={styles.linksColumn}>
            <h4 className={styles.linksColumnTitle}>Pages</h4>
            <ul>
              {pageLinks.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.linksColumn}>
            <h4 className={styles.linksColumnTitle}>Utility Pages</h4>
            <ul>
              {utilityLinks.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.instagram}>
            <h4 className={styles.linksColumnTitle}>Follow Us On Instagram</h4>
            <div className={styles.instagramGrid}>
              {instagramImages.map((src, index) => (
                <img key={index} src={src} alt="Instagram highlight" />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.bottomRow}>
          Copyright © 2023 Hashtag Developer. All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
