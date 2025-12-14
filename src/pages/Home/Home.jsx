import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import heroImage from '../../img/image 110.png';
import BrowseOurMenu from './Browse-Our-Menu';
import OurBlogArticles from './Our-Blog-Articles';
import Testimonials from './Testimonials/Testimonials';
import Navbar from '../../components/Layout/Navbar/Navbar';
import Footer from '../../components/Layout/Footer/Footer';


const Home = () => {
  return (
    <>
      <Navbar />
      <main>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <img src={heroImage} alt="Fresh dishes and ingredients" />
        </div>
        <div className={styles.heroOverlay}>
          <div className={styles.heroCopy}>
            <h1>Best food for your taste</h1>
            <p className={styles.subtitle}>
              Discover delectable cuisine and unforgettable moments in our welcoming, culinary haven.
            </p>
            <div className={styles.ctaRow}>
              <Link to="/create-booking" className={`${styles.ctaButton} ${styles.primary}`}>Book A Table</Link>
              <Link to="/menu" className={`${styles.ctaButton} ${styles.secondary}`}>Explore Menu</Link>
            </div>
          </div>
        </div>
      </section>

      <BrowseOurMenu />
      <OurBlogArticles />
      <Testimonials />
      </main>
      <Footer />
    </>
  );
};

export default Home;
