import styles from './AboutMain.module.css';
import infoImage from '../../../img/image 111.png';

function AboutMain() {

  return (
    <section className={styles.aboutMainSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left Side - Image with Contact Card */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <img src={infoImage} alt="Food" className={styles.foodImage} />
            </div>
            </div>

          {/* Right Side - Text Content */}
          <div className={styles.textContent}>
            <div className={styles.titleSection}>
              <h2 className={styles.heading}>We provide healthy food for your family.</h2>
              <p className={styles.paragraph1}>
                Our story began with a vision to create a unique dining experience that merges fine dining, exceptional service, and a vibrant ambiance. Rooted in city's rich culinary culture, we aim to honor our local roots while infusing a global palate.
              </p>
              <p className={styles.paragraph2}>
                At place, we believe that dining is not just about food, but also about the overall experience. Our staff, renowned for their warmth and dedication, strives to make every visit an unforgettable event.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMain;

