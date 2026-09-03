import React, { useState, useEffect } from 'react';
import { ArrowRight, Award, ChevronDown, Mail, MapPin, Medal, Phone, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './SodiqSections.css';

const sampleUniversities = [
  'Harvard', 'NYU Abu Dhabi', 'University of Chicago', 'University of Hong Kong',
  'Kyoto University', 'Carnegie Mellon', 'University of Toronto', 'WIUT',
  'Webster University', 'Central Asian University', 'Drexel University', 'Amity University',
];

const sampleOlympiads = [
  {
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=760&q=80',
    title: "Fan olimpiadalari",
    text: "Matematika, fizika, informatika va ingliz tili yo'nalishlarida faol ishtirok.",
    stats: ['18 oltin', '24 kumush', '31 bronza'],
  },
  {
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=760&q=80',
    title: 'Xalqaro tanlovlar',
    text: "O'quvchilarimiz xalqaro bellashuvlarda tajriba va natija to'playdi.",
    stats: ['12 finalchi', '8 sovrindor', '3 kubok'],
  },
  {
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=760&q=80',
    title: 'Loyiha musobaqalari',
    text: 'STEM, robototexnika va ijodiy loyiha tanlovlarida muntazam qatnashuv.',
    stats: ['20 loyiha', '9 g\'olib', '45 qatnashchi'],
  },
];

const faqs = [
  ['Qabul imtihoni qanday o\'tadi?', "Matematika, ingliz tili va mantiqiy fikrlash bo'yicha sinov o'tkaziladi."],
  ['Qaysi sinflar uchun qabul bor?', "Chiroqchi IMda 1-11 sinf o'quvchilari uchun ta'lim jarayoni tashkil etiladi."],
  ['Sertifikat va DTM tayyorgarligi bormi?', "Ha, o'quvchilar IELTS, SAT, fan sertifikatlari va DTM imtihonlariga tayyorlanadi."],
  ['Hujjatlarni qanday topshiraman?', 'Maktabga kelib yoki bog\'lanish formasi orqali ma\'lumot qoldirishingiz mumkin.'],
];

const SodiqSections: React.FC = () => {
  const sampleGallery = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=720&q=80',
  ];

  const [gallery, setGallery] = useState<string[]>(sampleGallery);
  const [dbUniversities, setDbUniversities] = useState<string[]>([]);
  const [dbOlympiads, setDbOlympiads] = useState<any[]>([]);

  useEffect(() => {
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data().image);
      if (data.length > 0) {
        setGallery(data);
      } else {
        setGallery(sampleGallery);
      }
    });
    
    const unsubUni = onSnapshot(collection(db, 'universities'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data().name);
      setDbUniversities(data);
    });

    const unsubOly = onSnapshot(collection(db, 'olympiads'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDbOlympiads(data);
    });

    return () => {
      unsubGallery();
      unsubUni();
      unsubOly();
    };
  }, []);

  const universities = [...dbUniversities, ...sampleUniversities];
  const olympiads = [...dbOlympiads, ...sampleOlympiads];

  return (
    <>
      <section className="universities-section" id="universitetlar" data-aos="fade-up">
        <div className="container">
          <div className="section-head centered">
            <span>Universitetlar</span>
            <h2>O'quvchilarimiz qaysi universitetlarga kirishdi?</h2>
          </div>
          <div className="university-marquee">
            {universities.concat(universities).map((name, index) => (
              <div className="university-logo" key={`${name}-${index}`}>{name}</div>
            ))}
          </div>
          <p className="university-note">Chiroqchi IM bitiruvchilari TOP universitetlar sari dadil qadam tashlaydi</p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/universities" className="see-all-btn" style={{
              display: 'inline-block',
              color: 'var(--accent-orange)',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '10px 20px',
              border: '2px solid var(--accent-orange)',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}>Barchasini ko'rish →</Link>
          </div>
        </div>
      </section>

      <section className="olympiad-section" id="olimpiadachilar" data-aos="fade-up">
        <div className="container">
          <div className="section-head centered">
            <span>Yutuqlar</span>
            <h2>Olimpiadachilarimiz</h2>
            <p>O'quvchilarimiz fan olimpiadalari va xalqaro musobaqalarda erishgan natijalari</p>
          </div>
          {olympiads.length > 0 ? (
            <div className="olympiad-grid">
              {olympiads.map((item) => (
                <article className="olympiad-card" key={item.id || item.title}>
                  <img src={item.image} alt={item.title} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <div className="olympiad-stats">
                      {item.stats?.map((stat: string) => <span key={stat}>{stat}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p style={{textAlign: 'center'}}>Ma'lumotlar yuklanmoqda yoki hali qo'shilmagan.</p>
          )}
          <div className="olympiad-totals">
            <span><Medal size={20} />73 jami medal</span>
            <span><Trophy size={20} />12 xalqaro musobaqa</span>
            <span><Award size={20} />45 sovrindor o'quvchi</span>
          </div>
        </div>
      </section>

      <section className="gallery-section" id="galereya" data-aos="fade-up">
        <div className="container">
          <div className="section-head centered">
            <span>Foto galereya</span>
            <h2>Chiroqchi IM hayotidan lavhalar</h2>
          </div>
        </div>
        <div className="gallery-carousel-wrapper">
          <div className="gallery-marquee">
            {gallery.concat(gallery).map((src, index) => (
              <img src={src} alt={`Chiroqchi IM galereya ${index + 1}`} key={`${src}-${index}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="faq-contact-section" id="aloqa" data-aos="fade-up">
        <div className="container faq-contact-grid">
          <div className="faq-panel">
            <span className="mini-kicker">FAQ</span>
            <h2>Ko'p beriladigan savollar</h2>
            {faqs.map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>{question}<ChevronDown size={18} /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>

          <div className="contact-panel">
            <span className="mini-kicker">Bog'lanish</span>
            <h2>Maslahat olish uchun raqamingizni qoldiring</h2>
            <p>Biz siz bilan 24 soat ichida bog'lanamiz.</p>
            <form className="contact-form">
              <input placeholder="Ismingiz" />
              <input placeholder="+998 90 123 45 67" />
              <select defaultValue="">
                <option value="" disabled>Sinfni tanlang</option>
                <option>1-4 sinf</option>
                <option>5-8 sinf</option>
                <option>9-11 sinf</option>
              </select>
              <button type="button">Maslahat olaman <ArrowRight size={18} /></button>
            </form>
            <div className="contact-info">
              <span><MapPin size={18} /> Chiroqchi tumani, ixtisoslashtirilgan maktab</span>
              <span><Phone size={18} /> +998 90 123 45 67</span>
              <span><Mail size={18} /> info@chiroqchi-im.uz</span>
            </div>
          </div>
        </div>
        <div className="container map-container">
          <iframe
            title="Chiroqchi IM Google Maps location"
            src="https://www.google.com/maps?q=Chiroqchi%20ixtisoslashtirilgan%20maktab&output=embed"
            loading="lazy"
          />
        </div>
      </section>

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
                <a href="#home">Bosh sahifa</a>
                <a href="#about">Maktab haqida</a>
                <a href="#natijalar">Natijalar</a>
                <a href="#galereya">Galereya</a>
              </nav>
            </div>
            <div className="footer-column">
              <h3>Aloqa</h3>
              <nav>
                <span>+998 90 123 45 67</span>
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
    </>
  );
};

export default SodiqSections;
