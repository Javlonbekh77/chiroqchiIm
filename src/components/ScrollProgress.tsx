import React, { useEffect, useState } from 'react';

const ScrollProgress: React.FC = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = (scrollTop / docHeight) * 100;
        setScrollWidth(scrolled);
      } else {
        setScrollWidth(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '4px',
        width: `${scrollWidth}%`,
        backgroundColor: 'var(--accent-orange, #f97316)',
        zIndex: 9999,
        transition: 'width 0.1s ease-out'
      }}
    />
  );
};

export default ScrollProgress;
