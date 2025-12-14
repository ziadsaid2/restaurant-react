import styles from './AboutInfo.module.css';
import infoImage from '../../../img/Mask group.png';

function AboutInfo() {
  const stats = [
    { number: '3', label: 'Locations' },
    { number: '1995', label: 'Founded' },
    { number: '65+', label: 'Staff Members' },
    { number: '100%', label: 'Satisfied Customers' }
  ];

  return (
    <section className={styles.aboutInfoSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left Side - Text and Statistics */}
          <div className={styles.textContent}>
            <h2 className={styles.heading}>A little information for our valuable guest</h2>
            <p className={styles.paragraph}>
              At place, we believe that dining is not just about food, but also about the overall experience. Our staff, renowned for their warmth and dedication, strives to make every visit an unforgettable event.
            </p>
            <div className={styles.statsGrid}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.statCard}>
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className={styles.imageContainer}>
            <img src={infoImage} alt="Food preparation" className={styles.infoImage} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutInfo;

