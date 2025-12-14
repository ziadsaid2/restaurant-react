import styles from './Loader.module.css';

const Loader = ({ fullScreen = false, size = 'normal' }) => {
  const containerClass = fullScreen 
    ? `${styles.loaderContainer} ${styles.fullScreen}` 
    : styles.loaderContainer;
  
  const loaderClass = size === 'small' 
    ? `${styles.loader} ${styles.small}` 
    : styles.loader;

  return (
    <div className={containerClass}>
      <div className={loaderClass}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>
    </div>
  );
};

export default Loader;
