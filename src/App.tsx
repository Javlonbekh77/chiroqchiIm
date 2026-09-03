import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Inspiration from './components/Inspiration';
import Updates from './components/Updates';
import Results from './components/Results';
import ScrollToTop from './components/ScrollToTop';
import NatijalarGapiradi from './components/NatijalarGapiradi';
import SodiqSections from './components/SodiqSections';
import About from './components/About';
import Motto from './components/Motto';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const [page, setPage] = useState(() => window.location.hash === '#about' ? 'about' : 'home');

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });

    const onHashChange = () => {
      const nextPage = window.location.hash === '#about' ? 'about' : 'home';
      setPage(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (page === 'about') {
    return (
      <div className="app-wrapper about-page">
        <Header solidAtTop />
        <About />
        <Motto />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Header />
      <Hero />
      <Inspiration />
      <Updates />
      <Results />
      <NatijalarGapiradi />
      <SodiqSections />
      <ScrollToTop />
    </div>
  );
}

export default App;
