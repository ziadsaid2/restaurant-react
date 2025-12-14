import styles from './AboutVideoFeatures.module.css';
import videoBg from '../../../img/BG (1).png';
import cuisineIcon from '../../../img/restaurant-menu 1.png';
import orderIcon from '../../../img/restaurant-menu 2.png';
import deliveryIcon from '../../../img/restaurant-menu 3.png';

function AboutVideoFeatures() {
  const features = [
    {
      icon: 'cuisine',
      title: 'Multi Cuisine',
      description: 'In the new era of technology we look in the future with certainty life.'
    },
    {
      icon: 'order',
      title: 'Easy To Order',
      description: 'In the new era of technology we look in the future with certainty life.'
    },
    {
      icon: 'delivery',
      title: 'Fast Delivery',
      description: 'In the new era of technology we look in the future with certainty life.'
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.videoSection}>
        <div className={styles.videoBackground}>
          <img src={videoBg} alt="Restaurant interior" className={styles.videoImage} />
          <div className={styles.videoOverlay}>
            <div className={styles.playButton}>
              <div className={styles.playIcon}></div>
            </div>
            <h2 className={styles.videoTitle}>Feel the authentic & original taste from us</h2>
          </div>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.iconContainer}>
                  {feature.icon === 'cuisine' && (
                    <img src={cuisineIcon} alt="Cuisine" className={styles.cuisineIcon} />
                  )}
                  {feature.icon === 'order' && (
                        <img src={orderIcon} alt="Order" className={styles.orderIcon} />
                  )}
                  {feature.icon === 'delivery' && (
                    <img src={deliveryIcon} alt="Delivery" className={styles.deliveryIcon} />
                  )}
                </div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutVideoFeatures;

