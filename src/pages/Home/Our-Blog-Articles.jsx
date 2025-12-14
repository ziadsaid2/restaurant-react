import styles from './Our-Blog-Articles.module.css';
import burgerImage from '../../img/pexels-andra-918581 1.png';
import friesImage from '../../img/pexels-suzy-hazelwood-2966196 1.png';
import chickenImage from '../../img/pexels-leonardo-luz-13998974 1.png';
import cheesecakeImage from '../../img/pexels-sebastian-coman-photography-3791088 1.png';
import pizzaImage from '../../img/pexels-katerina-holmes-5908226 1.png';

function OurBlogArticles() {
  const featuredArticle = {
    image: burgerImage,
    date: 'January 3, 2023',
    title: 'The secret tips & tricks to prepare a perfect burger & pizza for our customers',
    description: 'Lorem ipsum dolor sit amet consectetur of a adipiscing elitilmim semper adipiscing massa gravida nisi cras enim quis nibholm varius amet gravida ut facilisis neque egestas.'
  };

  const articles = [
    {
      image: friesImage,
      date: 'January 3, 2023',
      title: 'How to prepare the perfect french fries in an air fryer'
    },
    {
      image: chickenImage,
      date: 'January 3, 2023',
      title: 'How to prepare delicious chicken tenders'
    },
    {
      image: cheesecakeImage,
      date: 'January 3, 2023',
      title: '7 delicious cheesecake recipes you can prepare'
    },
    {
      image: pizzaImage,
      date: 'January 3, 2023',
      title: '5 great pizza restaurants you should visit this city'
    }
  ];

  return (
    <section className={styles.blogSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Our Blog & Articles</h2>
          <button className={styles.readAllBtn}>Read All Articles</button>
        </div>

        <div className={styles.content}>
          {/* Featured Article */}
          <article className={styles.featuredArticle}>
            <div className={styles.featuredImage}>
              <img src={featuredArticle.image} alt={featuredArticle.title} />
            </div>
            <div className={styles.featuredContent}>
              <p className={styles.date}>{featuredArticle.date}</p>
              <h3 className={styles.featuredTitle}>{featuredArticle.title}</h3>
              <p className={styles.featuredDescription}>{featuredArticle.description}</p>
            </div>
          </article>

          {/* Articles Grid */}
          <div className={styles.articlesGrid}>
            {articles.map((article, index) => (
              <article key={index} className={styles.articleCard}>
                <div className={styles.articleImage}>
                  <img src={article.image} alt={article.title} />
                </div>
                <div className={styles.articleContent}>
                  <p className={styles.date}>{article.date}</p>
                  <h4 className={styles.articleTitle}>{article.title}</h4>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurBlogArticles;
