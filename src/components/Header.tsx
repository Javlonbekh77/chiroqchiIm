import React, { useState, useEffect } from 'react';
import { Menu, X, Home, GraduationCap, Users, Newspaper, Trophy, PhoneCall, ArrowRight, Sparkles } from 'lucide-react';
import './Header.css';

const navItems = [
  { label: 'Bosh sahifa', href: '/', icon: Home },
  { label: 'Maktab haqida', href: '/#about', icon: GraduationCap },
  { label: 'Ustozlar', href: '/teachers', icon: Users },
  { label: 'Yangiliklar', href: '/news', icon: Newspaper },
  { label: 'Olimpiadalar', href: '/olympiads', icon: Trophy },
  { label: 'Aloqa', href: '/#aloqa', icon: PhoneCall },
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

      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} style={{ zIndex: 99999 }}>
        <div className="mobile-nav-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
          <span className="mobile-nav-badge">
            <Sparkles size={14} /> Chiroqchi IM
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            aria-label="Yopish"
          >
            <X size={24} />
          </button>
        </div>

        <ul className="mobile-nav-list">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <a
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (item.href.includes('#about')) {
                      if (window.location.pathname !== '/') {
                        window.location.href = '/#about';
                      } else {
                        window.location.hash = 'about';
                      }
                    }
                  }}
                >
                  <span className="mobile-nav-icon-wrapper">
                    <Icon size={20} />
                  </span>
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mobile-btn-container">
          <a className="btn btn-primary mobile-apply-btn" href="#" onClick={(e) => { setIsMobileMenuOpen(false); handleApplyClick(e); }}>
            <span>Qabulga ariza topshirish</span>
            <ArrowRight size={18} />
          </a>

          <div className="mobile-nav-footer">
            <span>📞 +998 90 123 45 67</span>
            <span>📍 Chiroqchi tumani</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

