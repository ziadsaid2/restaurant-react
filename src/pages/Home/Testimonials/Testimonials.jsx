import styles from './Testimonials.module.css';

// You'll need to add these profile images to the img folder
// For now, using placeholder paths - replace with actual customer images
import customer1Image from '../../../img/Image٨.png';
import customer2Image from '../../../img/Ellipse 19.png';
import customer3Image from '../../../img/Image.png';

function Testimonials() {
  const testimonials = [
    {
      quote: 'The best restaurant',
      text: 'Last night, we dined at place and were simply blown away. From the moment we stepped in, we were enveloped in an inviting atmosphere and greeted with warm smiles.',
      name: 'Sophire Robson',
      location: 'Los Angeles, CA',
      image: customer1Image
    },
    {
      quote: 'Simply delicious',
      text: 'Place exceeded my expectations on all fronts. The ambiance was cozy and relaxed, making it a perfect venue for our anniversary dinner. Each dish was prepared and beautifully presented.',
      name: 'Matt Cannon',
      location: 'San Diego, CA',
      image: customer2Image
    },
    {
      quote: 'One of a kind restaurant',
      text: 'The culinary experience at place is first to none. The atmosphere is vibrant, the food - nothing short of extraordinary. The food was the highlight of our evening. Highly recommended.',
      name: 'Andy Smith',
      location: 'San Francisco, CA',
      image: customer3Image
    }
  ];

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>What Our Customers Say</h2>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <article key={index} className={styles.testimonialCard}>
              <h3 className={styles.quote}>"{testimonial.quote}"</h3>
              <p className={styles.text}>{testimonial.text}</p>
              <div className={styles.customerInfo}>
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className={styles.profileImage}
                />
                <div className={styles.customerDetails}>
                  <p className={styles.name}>{testimonial.name}</p>
                  <p className={styles.location}>{testimonial.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

