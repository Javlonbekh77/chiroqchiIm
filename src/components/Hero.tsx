import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, GraduationCap, FlaskConical, Cpu } from 'lucide-react';
import './Hero.css';

const WORDS = ["boshlanadi", "qanot qoqadi", "shakllanadi"];
const TYPE_SPEED = 100;
const DELETE_SPEED = 60;
const PAUSE_AFTER_TYPE = 2500;
const PAUSE_AFTER_DELETE = 500;

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleReplay = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    };

    const handleScroll = () => {
      if (window.scrollY === 0) {
        handleReplay();
      }
    };

    document.addEventListener('replayVideo', handleReplay);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('replayVideo', handleReplay);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    const startDelay = setTimeout(() => setStarted(true), 1800);
    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!started) return;

    const currentWord = WORDS[wordIndex];

    if (!isDeleting && typedText === currentWord) {
      const timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && typedText === '') {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % WORDS.length);
      }, PAUSE_AFTER_DELETE);
      return () => clearTimeout(timeout);
    }

    const speed = isDeleting ? DELETE_SPEED : TYPE_SPEED;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentWord.slice(0, typedText.length + 1));
      } else {
        setTypedText(currentWord.slice(0, typedText.length - 1));
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [typedText, wordIndex, isDeleting, started]);

  return (
    <section className="hero" id="home">
      <video 
        ref={videoRef}
        className="hero-video" 
        src="/background.mp4" 
        autoPlay 
        muted 
        playsInline 
      />
      <div className="hero-overlay"></div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className={`hero-headline ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: '0.4s' }}>
            Kelajak shu yerdan <br />
            <span className="typing-text">{typedText}<span className="caret"></span></span>
          </h1>
          
          <p className={`hero-description ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: '0.6s' }}>
            Biz o'quvchilarga zamonaviy bilim, mustaqil fikrlash va amaliy ko'nikmalarni birlashtirgan ta'lim muhitini taqdim etamiz.
          </p>
          
          <div className={`hero-actions ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: '0.8s' }}>
            <a className="btn btn-primary" href="#aloqa">
              Bog'lanish <ArrowRight size={20} />
            </a>
            <a className="btn btn-secondary" href="#maktab-haqida">
              Maktab haqida <ArrowRight size={20} />
            </a>
          </div>
        </div>

        <div className="hero-cards">
          <div className={`hero-card-stage stage-lab ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: '1.0s' }}>
            <div className="floating-card card-lab">
              <div className="card-icon">
                <FlaskConical size={20} color="var(--accent-orange)" strokeWidth={1.5} />
              </div>
              <div className="card-text-wrapper">
                <span className="card-title">Zamonaviy Laboratoriya</span>
                <span className="card-subtitle">Amaliy bilim, real natija.</span>
              </div>
            </div>
          </div>

          <div className={`hero-card-stage stage-robotics ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: '1.15s' }}>
            <div className="floating-card card-robotics">
              <div className="card-icon">
                <Cpu size={20} color="var(--accent-orange)" strokeWidth={1.5} />
              </div>
              <div className="card-text-wrapper">
                <span className="card-title">Robototexnika</span>
                <span className="card-subtitle">Texnologik kelajak.</span>
              </div>
            </div>
          </div>

          <div className={`hero-card-stage stage-experience ${mounted ? 'animate-fade-up' : ''}`} style={{ animationDelay: '1.3s' }}>
            <div className="floating-card card-experience">
              <div className="card-icon">
                <GraduationCap size={24} color="var(--accent-orange)" strokeWidth={1.5} />
              </div>
              <span className="floating-number">15+</span>
              <span className="card-title">YILLIK TAJRIBA</span>
              <span className="card-subtitle">Sifatli ta'lim va ishonchli natijalar.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
