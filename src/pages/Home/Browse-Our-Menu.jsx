import styles from './Home.module.css';
import breakfastIcon from '../../img/icon (3).png';
import mainsIcon from '../../img/icon (3)س.png';
import drinksIcon from '../../img/icon (٤).png';
import dessertsIcon from '../../img/icon (٥).png';
function BrowseOurMenu() {
    const menuCategories = [
        {
          icon: breakfastIcon,
          title: 'Breakfast',
          copy: 'In the new era of technology we look in the future with certainty and pride for our life.',
        },
        {
          icon: mainsIcon,
          title: 'Main Dishes',
          copy: 'In the new era of technology we look in the future with certainty and pride for our life.',
        },
        {
          icon: drinksIcon,
          title: 'Drinks',
          copy: 'In the new era of technology we look in the future with certainty and pride for our life.',
        },
        {
          icon: dessertsIcon,
          title: 'Desserts',
          copy: 'In the new era of technology we look in the future with certainty and pride for our life.',
        },
      ];
      return (
        <section className={styles.menuSection}>
        <div className={styles.menuIntro}>
          <h2>Browse Our Menu</h2>
        </div>
        <div className={styles.menuGrid}>
          {menuCategories.map((category) => (
            <article key={category.title} className={styles.menuCard}>
              <div className={styles.menuIcon}>
                <img src={category.icon} alt={`${category.title} icon`} />
              </div>
              <h3>{category.title}</h3>
              <p>{category.copy}</p>
              <a href="/menu">Explore Menu</a>
            </article>
          ))}
        </div>
      </section>
      );
}

export default BrowseOurMenu;
