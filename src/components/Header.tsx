import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const navItems = [
  { label: 'Bosh sahifa', href: '/' },
  { label: 'Maktab haqida', href: '/#maktab-haqida' },
  { label: "Ustozlar", href: '/teachers' },
  { label: 'Yangiliklar', href: '/news' },
  { label: 'Aloqa', href: '/#aloqa' },
];

type HeaderProps = {
  solidAtTop?: boolean;
};

const Header: React.FC<HeaderProps> = ({ solidAtTop = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(solidAtTop || window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, solidAtTop]);

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Hozircha qabul yakunlangan!");
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : 'header--top'} ${isMobileMenuOpen ? 'header--menu-open' : ''}`}>
      <div className="container header-container" style={{ zIndex: 100 }}>
        <a href="/" className="header-logo">
          <img src="/main-logo.png" alt="Chiroqchi IM Maktab Logo" />
        </a>

        <nav className="desktop-nav">
          <ul className="nav-list">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="nav-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <a className="btn btn-primary" href="#" onClick={handleApplyClick}>
            Qabulga ariza
          </a>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label={isMobileMenuOpen ? 'Yopish' : 'Menyu'}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} style={{ zIndex: 99 }}>
        <ul className="mobile-nav-list">
          {navItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-btn-container">
          <a className="btn btn-primary" href="#" onClick={handleApplyClick}>
            Qabulga ariza
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
