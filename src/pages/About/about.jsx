import Navbar from '../../components/Layout/Navbar/Navbar';
import Footer from '../../components/Layout/Footer/Footer';
import AboutInfo from './AboutInfo/AboutInfo';
import AboutMain from './AboutMain/AboutMain';
import AboutVideoFeatures from './AboutVideoFeatures/AboutVideoFeatures';
import OurBlogArticles from '../Home/Our-Blog-Articles';
import Testimonials from '../Home/Testimonials/Testimonials';

function About() {
  return (
<>
  <Navbar />
  <main>
  <AboutInfo />
  <AboutVideoFeatures />
  <AboutMain />
  <Testimonials />
  <OurBlogArticles />
  </main>
  <Footer />
</>
  );
}

export default About;