import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import './About.css';

const stats = [
  { end: 15, suffix: '+', label: 'Yillik tajriba' },
  { end: 3, suffix: '+', label: "Zamonaviy yo'nalish" },
  { end: 100, suffix: '%', label: "Bilim va tarbiya uyg'unligi" },
  { end: 11, label: "1-11 sinflar ta'limi" },
];

type CountUpNumberProps = {
  end: number;
  suffix?: string;
};

const CountUpNumber: React.FC<CountUpNumberProps> = ({ end, suffix = '' }) => {
  const [value, setValue] = useState(0);
  const numberRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frameId = 0;
    let hasStarted = false;
    const duration = 1400;

    const runCounter = () => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setValue(Math.round(end * eased));

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick);
        } else {
          setValue(end);
        }
      };

      frameId = window.requestAnimationFrame(tick);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);

        if (isVisible && !hasStarted) {
          hasStarted = true;
          runCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    const current = numberRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [end]);

  return (
    <span className="about-stat-value" ref={numberRef}>
      {value}{suffix}
    </span>
  );
};

const About: React.FC = () => {
  return (
    <section className="about-section" id="maktab-haqida">
      <div className="container about-container">
        <div className="about-copy">
          <span className="about-kicker">MAKTAB HAQIDA</span>
          <h2 className="about-title">
            CHIROQCHI IM QANDAY MAKTAB?
          </h2>

          <div className="about-text">
            <p>
              Chiroqchi IM - iqtidorli o'quvchilar uchun zamonaviy, tartibli va
              natijaga yo'naltirilgan ta'lim muhiti.
            </p>
            <p>
              Bu yerda o'quvchilar <strong>aniq fanlar, laboratoriya ishlari,
              robototexnika</strong> va ijodiy loyihalar orqali bilimini amaliyotda
              mustahkamlaydi.
            </p>
            <p>
              Maktabda dars jarayoni mustaqil fikrlash, mas'uliyat va intizom bilan
              uyg'un olib boriladi. Har bir o'quvchining qiziqishi va o'sish yo'li
              ustozlar tomonidan muntazam kuzatib boriladi.
            </p>
          </div>

          <a className="about-cta" href="#talim">
            O'qish <ArrowRight size={18} />
          </a>
        </div>

        <div className="about-stats" aria-label="Maktab ko'rsatkichlari">
          {stats.map((item) => (
            <div className="about-stat" key={item.label}>
              <CountUpNumber end={item.end} suffix={item.suffix} />
              <span className="about-stat-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
