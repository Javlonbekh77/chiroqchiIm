import React from 'react';
import { Link } from 'react-router-dom';
import './SodiqSections.css'; // Assuming the footer styles are in SodiqSections.css

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <img src="/main-logo.png" alt="Chiroqchi IM" className="footer-logo" />
          <p>Kelajak shu yerdan qanot qoqadi. Ilm-fan, texnologiya va tarbiya uyg'unlashgan maskan.</p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h3>Havolalar</h3>
            <nav>
              <Link to="/">Bosh sahifa</Link>
              <Link to="/#about">Maktab haqida</Link>
              <Link to="/#natijalar">Natijalar</Link>
              <Link to="/#galereya">Galereya</Link>
            </nav>
          </div>
          <div className="footer-column">
            <h3>Aloqa</h3>
            <nav>
              <Link to="/#aloqa" style={{ color: 'var(--accent-orange)' }}>Savol yoki taklif qoldirish</Link>
              <span>+998 94 189 00 12</span>
              <span>+998 91 455 55 88</span>
              <span>info@chiroqchi-im.uz</span>
              <span>Chiroqchi tumani, ixtisoslashtirilgan maktab</span>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container developer-credit">
          <span className="dev-text">Designed & Developed by</span>
          <a href="https://t.me/javlonbek_xoliqulov" target="_blank" rel="noopener noreferrer" className="dev-name">
            Javlonbek Xoliqulov
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
